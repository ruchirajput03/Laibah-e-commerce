// routes/webhook.js
const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhookController');

// Webhook route - must use raw body
router.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
