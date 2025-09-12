const Order = require("../models/order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      userEmail,
      shipping,
      payment,
      items,
      totalAmount,
      tax,
      userId
    } = req.body;

    // Generate unique order ID
    const orderId = "ORD-" + Date.now();

    const order = new Order({
      orderId,
      userId: userId || null, // null for guest
      userEmail,
      shipping,
      payment: {
        method: payment.method,
        status: "Pending",
        transactionId: payment.transactionId || null
      },
      items,
      totalAmount,
      tax
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
};
const lookupOrder = async (req, res) => {
    try {
      const { orderId, email } = req.query;
  
      if (!orderId || !email) {
        return res.status(400).json({ message: "Order ID and Email are required" });
      }
  
      const order = await Order.findOne({
        orderId,
        userEmail: email
      }).populate('items.productId', 'name images price'); // Optional: populate product info
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
module.exports = { createOrder, lookupOrder };
