const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Webhook endpoint for SePay (No authentication middleware since SePay calls this directly)
// You may want to integrate API Key validation if SePay provides one in headers later
router.post('/sepay', webhookController.sepayWebhook);

module.exports = router;
