const axios = require("axios");
const Lead = require("../models/Lead");
const { scoreLead } = require("../services/aiService");
const { sendEmail } = require("../services/emailService");


/* ----------------------------------------------------
   CREATE or UPDATE LEAD
------------------------------------------------------*/
async function upsertLead(req, res) {
  try {
    const data = req.body;

    if (!data.email) {
      return res.status(400).json({ ok: false, error: "Email is required" });
    }

    let lead = await Lead.findOne({ email: data.email });

    if (!lead) {
      // Create new lead
      lead = new Lead({
        name: data.name || "",
        email: data.email,
        phone: data.phone || "",
        source: data.source || "",
        role: data.role || "",
        metadata: data.metadata || {}
      });
    } else {
      // Update existing lead
      lead.name = data.name || lead.name;
      lead.phone = data.phone || lead.phone;
      lead.source = data.source || lead.source;
      lead.role = data.role || lead.role;
      lead.metadata = { ...(lead.metadata || {}), ...(data.metadata || {}) };
    }

    // AI SCORING
    const scored = await scoreLead(lead);
    lead.score = scored.score;
    lead.classification = scored.classification;

    await lead.save();

    // 🔔 Auto-trigger webhook to n8n
    try {
      await axios.post("http://localhost:5678/webhook/lead-added", {
        name: lead.name,
        email: lead.email,
        score: lead.score
      });
    } catch (webhookErr) {
      console.error("Webhook Error:", webhookErr.message);
    }

    return res.json({ ok: true, lead });

  } catch (err) {
    console.error("Upsert Lead Error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}


/* ----------------------------------------------------
   LIST ALL LEADS
------------------------------------------------------*/
async function listLeads(req, res) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.json({ ok: true, leads });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


/* ----------------------------------------------------
   GET SINGLE LEAD BY ID
------------------------------------------------------*/
async function getLead(req, res) {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ ok: false, error: "Lead not found" });
    }
    return res.json({ ok: true, lead });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


/* ----------------------------------------------------
   SEND TEST EMAIL (for debugging)
------------------------------------------------------*/
async function sendTestEmail(req, res) {
  try {
    await sendEmail(
      "your_email@gmail.com",
      "Test Email",
      "Your email service is working correctly!"
    );

    return res.json({ ok: true, message: "Test email sent successfully!" });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


/* ----------------------------------------------------
   EXPORT ALL FUNCTIONS
------------------------------------------------------*/
module.exports = {
  upsertLead,
  listLeads,
  getLead,
  sendTestEmail
};
