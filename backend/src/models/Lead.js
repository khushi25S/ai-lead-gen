// src/models/Lead.js
const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  type: { type: String }, // e.g., "email_sent", "email_open", "clicked"
  timestamp: { type: Date, default: Date.now },
  meta: mongoose.Schema.Types.Mixed
}, { _id: false });

const LeadSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  source: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  score: { type: Number, default: 0 },
  classification: { type: String, default: '' },
  tags: { type: [String], default: [] },
  interactions: { type: [InteractionSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
