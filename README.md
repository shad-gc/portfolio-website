# PORTFOLIO.OS

A cyberpunk-terminal themed portfolio website built with Node.js and Express,
designed to be deployed to **Google Cloud Run**.

---

## Project structure

```
portfolio/
├── public/             # All static files served to the browser
│   ├── index.html      # Home / About page
│   ├── resume.html     # Resume page
│   ├── projects.html   # Projects page
│   ├── styles.css      # Global CSS — cyberpunk terminal theme
│   └── script.js       # Client-side JS (nav, animations, clock)
├── server.js           # Express server — serves /public, adds /health route
├── package.json        # npm metadata and scripts
├── Dockerfile          # Multi-stage Docker build for Cloud Run
├── .dockerignore       # Files excluded from the Docker image
├── .gitignore          # Files excluded from git
└── README.md           # This file
```

---

## Run locally

**Prerequisites:** Node.js 18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
open http://localhost:8080
```

The server reads `process.env.PORT` — set it if you need a different port:

```bash
PORT=3000 npm start
```

---

## Build and run with Docker

```bash
# Build the image
docker build -t portfolio .

# Run the container (maps container port 8080 → host port 8080)
docker run -p 8080:8080 portfolio

# Open in browser
open http://localhost:8080
```

---

## Deploy to Google Cloud Run

**Prerequisites:** `gcloud` CLI installed and authenticated.

```bash
# 1. Set your project
gcloud config set project YOUR_PROJECT_ID

# 2. Build and push to Google Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/portfolio

# 3. Deploy to Cloud Run
gcloud run deploy portfolio \
  --image gcr.io/YOUR_PROJECT_ID/portfolio \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Cloud Run automatically injects `PORT` into the container environment —
the Express server picks this up via `process.env.PORT`.

---

## Health check

The `/health` endpoint returns HTTP 200 and a JSON timestamp:

```bash
curl http://localhost:8080/health
# {"status":"OK","timestamp":"2026-04-03T00:00:00.000Z"}
```

Cloud Run uses this to confirm the container is healthy after deployment.

---

## Customizing content

All personal content is placeholder text. Update these files:

| File | What to change |
|---|---|
| `public/index.html` | Name, role, bio, links, skills |
| `public/resume.html` | Work history, education, certifications |
| `public/projects.html` | Project cards, GitHub links, tech stacks |
| `public/styles.css` | Colors, fonts, layout tweaks |
