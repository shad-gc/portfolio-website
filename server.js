// server.js — Entry point for the portfolio Express server

const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Use PORT from environment (required by Cloud Run) or fall back to 8080
const PORT = process.env.PORT || 8080;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'https:', 'data:'],
      // 'unsafe-inline' is required for inline style="..." attributes used in the HTML
      'style-src': ["'self'", "'unsafe-inline'"],
      'script-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Serve everything in the /public directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint — used by Cloud Run; response is intentionally minimal
// (no version, hostname, or build info) to avoid leaking deployment details.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Explicit page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Server online → http://localhost:${PORT}`);
  console.log(`[SYSTEM] Health check  → http://localhost:${PORT}/health`);
});