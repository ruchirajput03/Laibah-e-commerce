const mongoose = require('mongoose');
 
const product_catgeory_Schema = new mongoose.Schema({
    category_description: {
        type: String,
       
    },
    category_name: {
        type: String,
        required: true
    },
    category_image: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true,
        unique: true
    },
    parent_category_id:{
        type:String
    },
    type: {
        type: String,
        enum: ['footwear', 'apparel', 'accessory', 'other'],
        default: 'other'
    }
});
 
const Category = mongoose.model('product_category', product_catgeory_Schema);
module.exports = Category;