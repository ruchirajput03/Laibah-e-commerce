const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true }, // Product name (snapshot)
  variation: {
    size: { type: String }, // Optional if product has size
    color: { type: String }, // Optional if product has color
    materials: [{ type: String }], // Optional if product has materials
    price: { type: Number, required: true }, // Variation price at purchase time
    images: [{ type: String }] // Store the variation images
  },
  quantity: { type: Number, required: true, default: 1 },
  subtotal: { type: Number, required: true } // price * quantity
});

const shippingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zip: { type: String },
  country: { type: String, required: true },
  phone: { type: String }
});

const paymentSchema = new mongoose.Schema({
  method: { type: String, required: true }, // e.g., "Credit Card", "PayPal", "COD"
  status: { type: String, default: "Pending" }, // Pending, Paid, Failed, Refunded
  transactionId: { type: String, default: null }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true }, // Custom order ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Null for guest checkout
    userEmail: { type: String, required: true },
    items: [orderItemSchema],
    shipping: shippingSchema,
    payment: paymentSchema,
    totalAmount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

