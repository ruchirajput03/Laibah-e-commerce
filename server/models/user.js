// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true

  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase:true,
   },
   role:{
    type:String,
    enum:["user","admin"],
    default: 'user'
   },
   isBlocked:{
    type:Boolean,
    default:false

   },
   orders:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
   }],
   createdAt:{
    type:Date,
    default:Date.now
  },
  lastLogin:{
type:Date,
  },

  
  password: { 
    type: String, 
    required: true 
  },
  role:{
    type: String, 
    enum: ["user", "admin"],
    required: true

  },
 
  profile:{
    type:String,
  },
 
  resetOTP: String,
  resetOTPExpiry: Date,
  isOTPVerified: { type: Boolean, default: false },
});



const User = mongoose.model("User", userSchema);


module.exports = User;

