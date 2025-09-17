const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getPaymentStatus,
  refundPayment
} = require('../controllers/paymentController');

router.post('/create-intent', createPaymentIntent);
router.get('/status/:paymentIntentId', getPaymentStatus);
router.post('/refund', refundPayment);

module.exports = router;