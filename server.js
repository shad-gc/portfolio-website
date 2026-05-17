// express server. cloud run hosts it. nothing fancy.

const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// cloud run sets PORT. fall back to 8080 for local.
const PORT = process.env.PORT || 8080;

// helmet defaults are too permissive for a static portfolio.
// lock CSP down to self + the google fonts host. no inline scripts. no inline styles.
// frame-ancestors 'none' = no one embeds this site in an iframe.
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'https:', 'data:'],
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'script-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
  },
  // hsts: 1 year, include subdomains, preload-eligible.
  // note: cloudflare currently overrides this at the edge with its own value
  // (configure at zone -> ssl/tls -> edge certificates -> hsts). this is the
  // origin fallback if cloudflare is ever bypassed.
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// static files out of /public.
app.use(express.static(path.join(__dirname, 'public')));

// health check for cloud run. keep the body boring on purpose —
// no version string, no hostname, no build sha. don't leak deploy details.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// page routes. /about points at index because the home page IS the about page.
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

// catch-all 404. must come last.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Server online → http://localhost:${PORT}`);
  console.log(`[SYSTEM] Health check  → http://localhost:${PORT}/health`);
});
