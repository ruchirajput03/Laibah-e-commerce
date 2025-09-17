const express = require('express');
const router = express.Router();
const {
  getOrdersByEmail,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  getOrderStats,
  cancelOrder
} = require('../controllers/orderController');

router.get('/customer/:email', getOrdersByEmail);
router.get('/lookup/:orderId', getOrderById);
router.get('/number/:orderNumber', getOrderByNumber);
router.put('/cancel/:orderId', cancelOrder);


router.put('/admin/:orderId/status', updateOrderStatus);
router.get('/admin/stats', getOrderStats);

module.exports = router;