// src/controllers/leadController.js
const Lead = require('../models/Lead');
const { scoreLead } = require('../services/aiService');
const { sendEmail } = require('../services/emailService');

async function upsertLead(req, res) {
  try {
    const data = req.body;
    if (!data.email) return res.status(400).json({ ok: false, error: 'email is required' });

    let lead = await Lead.findOne({ email: data.email });
    if (!lead) {
      lead = new Lead({
        name: data.name || '',
        email: data.email,
        phone: data.phone || '',
        source: data.source || '',
        metadata: data.metadata || {}
      });
    } else {
      // update fields (simple merge)
      lead.name = data.name || lead.name;
      lead.phone = data.phone || lead.phone;
      lead.source = data.source || lead.source;
      lead.metadata = { ...(lead.metadata || {}), ...(data.metadata || {}) };
    }

    // Call AI scoring (async) — here we await so client gets scored lead immediately
    const scored = await scoreLead(lead);
    lead.score = scored.score;
    lead.classification = scored.classification;
    lead.interactions = lead.interactions || [];

    await lead.save();

    return res.json({ ok: true, lead });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function listLeads(req, res) {
  try {
    const q = req.query.q || '';
    const filter = {};
    if (q) {
      const rex = new RegExp(q, 'i');
      filter.$or = [{ name: rex }, { email: rex }, { 'metadata.company': rex }];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json({ ok: true, leads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function getLead(req, res) {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ ok: false, error: 'not_found' });
    return res.json({ ok: true, lead });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// Optional endpoint: send test email to lead (useful for n8n to call)
async function sendTestEmail(req, res) {
  try {
    const { leadId, subject, html } = req.body;
    if (!leadId) return res.status(400).json({ ok: false, error: 'leadId required' });
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ ok: false, error: 'lead not found' });

    await sendEmail({ to: lead.email, subject: subject || 'Hello from AI LeadGen', html: html || '<p>Test</p>' });

    lead.interactions.push({ type: 'email_sent', meta: { subject: subject || '' } });
    await lead.save();

    return res.json({ ok: true, msg: 'email_sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { upsertLead, listLeads, getLead, sendTestEmail };
