# SnapURL 🔗

A URL shortener with analytics, custom aliases, and QR codes.

## Live Demo
[snapurlapp.vercel.app](https://snapurlapp.vercel.app)

## Features
-  URL Shortening with custom aliases
-  Click analytics (browser, device, OS)
-  QR code generation
-  Enable/disable links
-  JWT authentication
-  Rate limiting & security

## Tech Stack
**Frontend:** React, Vite, Axios, React Router
**Backend:** Node.js, Express, MongoDB, Mongoose
**Auth:** JWT, Bcrypt
**Security:** Helmet, CORS, Rate Limiting, Zod

## Run Locally
\`\`\`bash
# Backend
cd server && npm install && node index.js

# Frontend  
cd client && npm install && npm run dev
\`\`\`