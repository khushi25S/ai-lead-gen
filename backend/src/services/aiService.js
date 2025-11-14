// src/services/aiService.js
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function scoreLead(lead) {
  // prompt को आसानी से बदलें — lightweight JSON response मांगें
  const prompt = `You are an assistant that reads a lead's details and returns a JSON with numeric score (0-100), classification and short rationale.
Lead: ${JSON.stringify({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    metadata: lead.metadata
  })}

Return STRICT JSON like:
{"score": NUMBER, "classification":"TEXT", "rationale":"SHORT"}
`;

  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',            // change model if required
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.0
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = res.data.choices?.[0]?.message?.content || '';
    // Try parse JSON from response
    try {
      const parsed = JSON.parse(content);
      return {
        score: Number(parsed.score ?? 50),
        classification: parsed.classification ?? 'unknown',
        rationale: parsed.rationale ?? ''
      };
    } catch (e) {
      // Fallback: attempt to extract numbers/strings
      const scoreMatch = content.match(/"score"\s*:\s*([0-9]{1,3})/);
      const score = scoreMatch ? Number(scoreMatch[1]) : 50;
      const classMatch = content.match(/"classification"\s*:\s*"([^"]+)"/);
      const classification = classMatch ? classMatch[1] : 'unknown';
      return { score, classification, rationale: content.slice(0, 240) };
    }
  } catch (err) {
    console.error('AI scoring failed', err?.response?.data || err.message);
    return { score: 50, classification: 'unknown', rationale: 'scoring_failed' };
  }
}

module.exports = { scoreLead };
