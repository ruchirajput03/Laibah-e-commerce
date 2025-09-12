const express = require('express');
const route = express.Router();
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const LocalModel = require("../models/user");
const {authUser} = require('../middlewares/authMiddleware');
const authController = require("../controllers/authController");



route.use((req,res,next)=>{
    console.log(req.path,'-----------------')
    next()
})
route.post("/signup",authController.registerUser);
route.post("/login",authController.login);
route.post('/forgetPass', authController.forgotPassword);
route.post('/verifyOTP', authController.verifyOTP);
route.get("/fetchuser", authUser,authController.fetchuser);

route.post('/resetPassword', authController.resetPassword);
route.post('/logout', authController.logout);




module.exports = route;
