const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authUser = async(req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded,'///////')
    if (!decoded) {
      return res.status(403).json({ message: 'un-autherized user ' });
    }
    const existingUser = await User.findOne({ email:decoded.email }).select("name email profile role ")
console.log(existingUser,'-------')
    req.user = existingUser; 
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'Invalid or expired token' });
  } 
};

const authenticateToken=(req,res,next)=>{
  const authHeader=req.headers['authorization'];
  const token=authHeader&&authHeader.split(" ")[1];

  if(!token){
    return res.status(401).json({message:'Token missing'});

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
      if(err) return res.status(403).json({ message: "Invalid token" });

      req.user = user; // Attach user data from token
      next();
    });
  }
}

module.exports = { authUser,authenticateToken };
