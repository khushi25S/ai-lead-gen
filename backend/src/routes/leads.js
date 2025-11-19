// src/routes/leads.js
const express = require('express');
const router = express.Router();

const { 
  upsertLead, 
  listLeads, 
  getLead, 
  sendTestEmail 
} = require('../controllers/leadController');

// Create or update lead
router.post('/', upsertLead);

// Get all leads
router.get('/', listLeads);

// Get one lead by ID
router.get('/:id', getLead);

// Send a test email
router.post('/:id/send-test-email', sendTestEmail);

module.exports = router;
