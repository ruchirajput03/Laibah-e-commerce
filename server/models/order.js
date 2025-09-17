const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  line1: {
    type: String,
    required: true
  },
  line2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const paymentDetailsSchema = new mongoose.Schema({
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  method: {
    type: String,
    default: 'card'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'aed'
  },
  paidAt: Date,
  refundedAt: Date,
  refundAmount: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentDetails: paymentDetailsSchema,
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
  shippingMethod: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update updatedAt on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);