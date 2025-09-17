// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');
const { Customer } = require('../models/order');

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'AED', 
      customerEmail, 
      shippingDetails, 
      orderItems 
    } = req.body;

    // Validate required fields
    if (!amount || !customerEmail || !shippingDetails || !orderItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // Verify amount matches calculation
    if (Math.abs(amount - Math.round(total * 100)) > 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch'
      });
    }

    // Create or get Stripe customer
    let stripeCustomer;
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        stripeCustomer = customers.data[0];
      } else {
        stripeCustomer = await stripe.customers.create({
          email: customerEmail,
          name: shippingDetails.name,
          address: shippingDetails.address
        });
      }
    } catch (error) {
      console.error('Stripe customer error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create customer'
      });
    }

    // Create order in database first (with pending status)
    const order = new Order({
      customerEmail,
      items: orderItems.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
      })),
      shippingAddress: {
        name: shippingDetails.name,
        line1: shippingDetails.address.line1,
        line2: shippingDetails.address.line2,
        city: shippingDetails.address.city,
        state: shippingDetails.address.state,
        postal_code: shippingDetails.address.postal_code,
        country: shippingDetails.address.country
      },
      subtotal,
      tax,
      total,
      paymentDetails: {
        method: 'card',
        amount: Math.round(total * 100),
        currency,
        status: 'pending'
      }
    });

    const savedOrder = await order.save();

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency,
      customer: stripeCustomer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: savedOrder._id.toString(),
        customerEmail,
        orderNumber: savedOrder.orderNumber
      },
      shipping: {
        name: shippingDetails.name,
        address: shippingDetails.address
      }
    });

    // Update order with payment intent ID
    savedOrder.paymentDetails.paymentIntentId = paymentIntent.id;
    await savedOrder.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderNumber
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer'
    });

    // Update order in database
    const order = await Order.findOne({ 'paymentDetails.paymentIntentId': paymentIntentId });
    if (order) {
      order.paymentDetails.refundedAt = new Date();
      order.paymentDetails.refundAmount = refund.amount / 100;
      order.orderStatus = 'canceled';
      await order.save();
    }

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
};