// controllers/webhookController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');
const { Customer } = require('../models/order');

// Handle Stripe webhooks
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
console.log('Received Stripe event:', event);
  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      case 'payment_intent.processing':
        await handlePaymentProcessing(event.data.object);
        break;
      
      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        // Handle subscription payments if you have subscriptions
        console.log('Invoice payment succeeded:', event.data.object.id);
        break;
      
      case 'customer.subscription.deleted':
        // Handle subscription cancellation if you have subscriptions
        console.log('Subscription deleted:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    const order = await Order.findOne({ 
      'paymentDetails.paymentIntentId': paymentIntent.id 
    });
    
    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    order.paymentDetails.status = 'succeeded';
    order.paymentDetails.paidAt = new Date();
    order.orderStatus = 'confirmed';
    
    await order.save();

    // Update or create customer record
    await updateCustomerRecord(paymentIntent, order);
    
    // Send confirmation email (implement as needed)
    // await sendOrderConfirmationEmail(order);
    
    console.log(`Order ${order.orderNumber} confirmed for ${order.customerEmail}`);
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    const order = await Order.findOne({ 
      'paymentDetails.paymentIntentId': paymentIntent.id 
    });
    
    if (order) {
      order.paymentDetails.status = 'failed';
      order.orderStatus = 'canceled';
      await order.save();
      
      // Send payment failed email (implement as needed)
      // await sendPaymentFailedEmail(order);
      
      console.log(`Order ${order.orderNumber} payment failed`);
    }
    
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle canceled payment
async function handlePaymentCanceled(paymentIntent) {
  try {
    console.log('Payment canceled:', paymentIntent.id);
    
    const order = await Order.findOne({ 
      'paymentDetails.paymentIntentId': paymentIntent.id 
    });
    
    if (order) {
      order.paymentDetails.status = 'canceled';
      order.orderStatus = 'canceled';
      await order.save();
      
      console.log(`Order ${order.orderNumber} canceled`);
    }
    
  } catch (error) {
    console.error('Error handling payment canceled:', error);
  }
}

// Handle payment processing
async function handlePaymentProcessing(paymentIntent) {
  try {
    console.log('Payment processing:', paymentIntent.id);
    
    const order = await Order.findOne({ 
      'paymentDetails.paymentIntentId': paymentIntent.id 
    });
    
    if (order) {
      order.paymentDetails.status = 'processing';
      order.orderStatus = 'processing';
      await order.save();
      
      console.log(`Order ${order.orderNumber} payment processing`);
    }
    
  } catch (error) {
    console.error('Error handling payment processing:', error);
  }
}

// Handle charge dispute
async function handleChargeDispute(dispute) {
  try {
    console.log('Charge dispute created:', dispute.id);
    
    const charge = await stripe.charges.retrieve(dispute.charge);
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
    
    const order = await Order.findOne({ 
      'paymentDetails.paymentIntentId': paymentIntent.id 
    });
    
    if (order) {
      // Add dispute information to order
      order.notes = `Dispute created: ${dispute.reason} - ${dispute.id}`;
      order.orderStatus = 'disputed';
      await order.save();
      
      // Notify admin about dispute (implement as needed)
      // await notifyAdminAboutDispute(order, dispute);
      
      console.log(`Dispute created for order ${order.orderNumber}`);
    }
    
  } catch (error) {
    console.error('Error handling charge dispute:', error);
  }
}

// Update customer record
async function updateCustomerRecord(paymentIntent, order) {
  try {
    let customer = await Customer.findOne({ email: order.customerEmail });
    
    if (!customer) {
      customer = new Customer({
        email: order.customerEmail,
        stripeCustomerId: paymentIntent.customer
      });
    }
    
    // Add order to customer's orders if not already present
    if (!customer.orders.includes(order._id)) {
      customer.orders.push(order._id);
    }
    
    // Update customer's address if not already saved
    const existingAddress = customer.addresses.find(addr => 
      addr.line1 === order.shippingAddress.line1 &&
      addr.city === order.shippingAddress.city &&
      addr.postal_code === order.shippingAddress.postal_code
    );
    
    if (!existingAddress) {
      customer.addresses.push({
        name: order.shippingAddress.name,
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postal_code: order.shippingAddress.postal_code,
        country: order.shippingAddress.country,
        isDefault: customer.addresses.length === 0
      });
    }
    
    await customer.save();
    
  } catch (error) {
    console.error('Error updating customer record:', error);
  }
}