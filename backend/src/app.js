// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const leadRoutes = require('./routes/leads');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ ok: true, service: 'ai-leadgen-backend' }));

app.use('/api/leads', leadRoutes);

module.exports = app;
