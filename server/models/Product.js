// const mongoose = require('mongoose');

// // Define the ProductVariation schema
// const productVariationSchema = new mongoose.Schema({
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   size: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   images: [{
//     type: String,
//     required: true
//   }],
//   color: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   materials: [{
//     type: String,
//     required: true,
//     trim: true
//   }],
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, { _id: true }); // Allow _id for each variation

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   // price: {
//   //   type: Number,
//   //   required: true,
//   //   min: 0
//   // },
//   brand: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     required: true,
   
//   },
//   variations: {
//     type: [productVariationSchema],
//     default: [],
//     validate: {
//       validator: function(variations) {
//         return variations && variations.length > 0;
//       },
//       message: 'Product must have at least one variation'
//     }
//   },
  
//   // Keep legacy fields for backward compatibility (optional)
//   images: [{
//     type: String
//   }],
//   sizes: [{
//     size: String,
//     stock: Number
//   }],
//   colors: [String],
//   materials: [String],
  
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Pre-save middleware to update the updatedAt field
// productSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Virtual to get all active variations
// productSchema.virtual('activeVariations').get(function() {
//   return this.variations.filter(variation => variation.isActive);
// });

// // Method to get price range
// productSchema.methods.getPriceRange = function() {
//   if (!this.variations || this.variations.length === 0) {
//     return { min: this.price, max: this.price };
//   }
  
//   const prices = this.variations
//     .filter(variation => variation.isActive)
//     .map(variation => variation.price);
    
//   return {
//     min: Math.min(...prices),
//     max: Math.max(...prices)
//   };
// };

// // Static method to find products by color
// productSchema.statics.findByColor = function(color) {
//   return this.find({
//     'variations.color': { $regex: color, $options: 'i' },
//     'variations.isActive': true
//   });
// };

// // Static method to find products by size
// productSchema.statics.findBySize = function(size) {
//   return this.find({
//     'variations.size': size,
//     'variations.isActive': true
//   });
// };

// module.exports = mongoose.model('Product', productSchema);



const mongoose = require('mongoose');
 
// Sub-schema for size and stock
const SizeStockSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);
 
// Sub-schema for each variation (like color variant)
const VariationSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(images) {
          return images && images.length > 0;
        },
        message: 'Each variation must have at least one image.'
      }
    },
    stock: { type: Number, default: 0 }, 
    sizes: {
    
  type: [SizeStockSchema],
  validate: {
    validator: function (sizes) {
    
      if (sizes === undefined || sizes === null) return true;
     
      if (sizes.length === 0) return true;
    
      const seen = new Set();
      for (const item of sizes) {
        if (seen.has(item.size)) return false;
        seen.add(item.size);
      }
      return true;
    },
    message: 'Sizes must be unique within the variation if provided.'
  },
  required: false
    }
  },
  { _id: false }
);
 
// Main Product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId,ref:"product_category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId,ref:"product_category" },
    baseImage: { type: String },
    variations: {
      type: [VariationSchema],
      validate: {
        validator: function(variations) {
          return variations && variations.length > 0;
        },
        message: 'Product must have at least one variation.'
      }
    }
  },
  { timestamps: true }
);
 
// Index for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ 'variations.color': 1 });
ProductSchema.index({ 'variations.price': 1 });
ProductSchema.index({ 'variations.sizes.size': 1 });
 
// Export model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
module.exports = Product;