# PORTFOLIO.OS

A cyberpunk-terminal themed portfolio site built with Node.js and Express, deployed on Google Cloud Run with a fully automated CI/CD pipeline.

This project is a hands-on exercise in modern cloud engineering: containerization, automated deployment, and keyless auth between GitHub and Google Cloud.

## Overview

The application is containerized with Docker, stored in Google Artifact Registry, and served by Google Cloud Run. Every push to `main` triggers a GitHub Actions pipeline that builds a new image, pushes it to Artifact Registry, and tells Cloud Run to deploy it. Auth between GitHub and GCP uses Workload Identity Federation — no service account keys.

The frontend UI was generated using Claude Code to accelerate iteration, while the primary focus of this project was on infrastructure, deployment workflows, and automation.

## Live Site

[View Live Portfolio](https://portfolio.rashadhussain.com)

Custom domain mapped to Cloud Run with Google-managed HTTPS.

## Tech Stack

- **Cloud Platform:** Google Cloud Platform (Cloud Run, Artifact Registry, IAM / Workload Identity Federation)
- **Containerization:** Docker (multi-stage, digest-pinned `node:20-alpine`, non-root runtime)
- **CI/CD:** GitHub Actions
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js 20, Express, Helmet
- **Tooling:** gcloud CLI, Docker Buildx

## Architecture

How a code change reaches the live site:

1. Commit pushed to `main` on GitHub
2. GitHub Actions authenticates to GCP via Workload Identity Federation (no keys)
3. Docker Buildx builds a `linux/amd64` image from a digest-pinned base
4. Image is pushed to Artifact Registry, tagged with the commit SHA
5. Cloud Run pulls that image from Artifact Registry and deploys a new revision
6. Traffic shifts to the new revision; the custom domain serves it over managed HTTPS

Artifact Registry sits between the build and the deploy because Cloud Run only runs images, it doesn't build them. The image has to live somewhere Cloud Run can pull from.

## Features

- Fully containerized application
- Automated deployments via CI/CD on push to `main`
- Serverless hosting with Cloud Run
- Health check endpoint at `/health`
- Custom cyberpunk UI/UX

## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Start server
npm start
```

Open: http://localhost:8080

## Docker (Local)

```bash
# Build image
docker build -t portfolio-site .

# Run container
docker run -p 8080:8080 portfolio-site
```

## Deployment

Deployment is automated. Any push to `main` triggers a build, a push to Artifact Registry, and a Cloud Run deploy.

## Author

Rashad H.\
Cloud & DevOps | Systems Engineering
