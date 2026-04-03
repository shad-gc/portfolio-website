// server.js — Entry point for the portfolio Express server
// Serves static files from /public and provides a /health check endpoint.

const express = require('express');
const path = require('path');

const app = express();

// Use PORT from environment (required by Cloud Run) or fall back to 8080
const PORT = process.env.PORT || 8080;

// Serve everything in the /public directory as static files
// (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint — Cloud Run and load balancers ping this to confirm
// the container is alive. Must return HTTP 200.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all: redirect any unknown route back to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Server online → http://localhost:${PORT}`);
  console.log(`[SYSTEM] Health check  → http://localhost:${PORT}/health`);
});
