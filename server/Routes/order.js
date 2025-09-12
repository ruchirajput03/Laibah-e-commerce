const express = require("express");
const { createOrder,lookupOrder} = require("../controllers/order");

const router = express.Router();

// POST /api/orders
router.post("/", createOrder);
router.get('/order-lookup', lookupOrder);
module.exports = router;
