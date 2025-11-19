// src/server.js

const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const cors = require('cors'); // import cors
const http = require('http');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/leadgen';

async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      dbName: 'leadgen',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Enable CORS for all origins (allow requests from frontend)
    app.use(cors());

    // Listen on all network interfaces (0.0.0.0) so LAN IP is reachable
    const server = http.createServer(app);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`Access via LAN: http://<YOUR-LAN-IP>:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
