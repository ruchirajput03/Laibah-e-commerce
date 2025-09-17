const customerSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    firstName: String,
    lastName: String,
    phone: String,
    addresses: [{
      name: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }],
    stripeCustomerId: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  customerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports.Customer = mongoose.model('Customer', customerSchema);