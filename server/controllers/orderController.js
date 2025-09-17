// controllers/orderController.js
const Order = require('../models/order');
const { Customer } = require('../models/order');

// Get all orders for a customer by email
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const query = { customerEmail: email.toLowerCase() };
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get orders by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order by ID and email (for security)
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and email are required'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      customerEmail: email.toLowerCase()
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Get order by order number and email
exports.getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number and email are required'
      });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
      customerEmail: email.toLowerCase()
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const updateData = { orderStatus: status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Send status update email (implement as needed)
    // await sendOrderStatusUpdateEmail(order);

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Get order statistics (Admin only)
exports.getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'canceled'] }, 1, 0] }
          }
        }
      }
    ]);

    const statusDistribution = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          canceledOrders: 0
        },
        statusDistribution
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};

// Cancel order (Customer can cancel if order is pending or confirmed)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, reason } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      customerEmail: email.toLowerCase()
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be canceled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be canceled at this stage'
      });
    }

    // Update order status
    order.orderStatus = 'canceled';
    order.notes = reason ? `Canceled by customer: ${reason}` : 'Canceled by customer';
    await order.save();

    // Process refund if payment was successful
    if (order.paymentDetails.status === 'succeeded') {
      // You can initiate refund here using the refund function from paymentController
      // await refundPayment({ body: { paymentIntentId: order.paymentDetails.paymentIntentId } }, res);
    }

    res.json({
      success: true,
      data: order,
      message: 'Order canceled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};