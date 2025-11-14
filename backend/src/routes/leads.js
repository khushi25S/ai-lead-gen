// src/routes/leads.js
const express = require('express');
const router = express.Router();
const { upsertLead, listLeads, getLead, sendTestEmail } = require('../controllers/leadController');

router.post('/', upsertLead);
router.get('/', listLeads);
router.get('/:id', getLead);
router.post('/:id/send-test-email', sendTestEmail);

module.exports = router;
