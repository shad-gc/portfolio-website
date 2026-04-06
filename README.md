# PORTFOLIO.OS

A cyberpunk-terminal themed portfolio website built with Node.js and Express, deployed on Google Cloud Run with a fully automated CI/CD pipeline.

This project focuses on modern cloud engineering practices including containerization, automated deployment, and secure authentication between GitHub and Google Cloud.


## Overview

The application is containerized with Docker, deployed on Google Cloud Run, and automatically updated via a CI/CD pipeline using GitHub Actions.

The frontend UI was generated using Claude Code to accelerate iteration, while the primary focus of this project was on infrastructure, deployment workflows, and automation.

## Live Site

[View Live Portfolio](https://portfolio-site-598222654730.us-east1.run.app/)

Automatically deployed via CI/CD on every push to `main`.


## Tech Stack

- **Cloud Platform:** Google Cloud Platform (Cloud Run, Artifact Registry)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Tooling:** gcloud CLI, Docker Buildx


## Architecture

1. Code is pushed to GitHub  
2. GitHub Actions builds a Docker image (linux/amd64)  
3. Image is pushed to Google Artifact Registry  
4. Cloud Run deploys the latest container revision  
5. Traffic is routed to the updated service

This follows a standard build → store → deploy workflow for containerized applications.  

## Features

- Fully containerized application  
- Automated deployments via CI/CD  
- Serverless hosting with Cloud Run  
- Health check endpoint (`/health`)  
- Custom cyberpunk UI/UX  


## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Start server
npm start
```
Open:
http://localhost:8080

## Docker (Local)

```bash
# Build image
docker build -t portfolio-site .

# Run container
docker run -p 8080:8080 portfolio-site
```

## Deployment

Deployment is handled automatically via GitHub Actions.

Any push to the `main` branch triggers:

- Docker image build (via buildx)
- Push to Artifact Registry
- Deployment to Cloud Run
- Live site update

## Notes
- Cloud Run pulls container images from Artifact Registry at deploy time
- Authentication between GitHub and GCP is handled via Workload Identity Federation (no service account keys)
- The project follows a build → store → deploy workflow

## Author

Rashad Hussain\
Cloud & DevOps | Systems Engineering