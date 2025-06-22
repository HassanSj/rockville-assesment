# Movie App (Next.js + NestJS)

## 🔧 Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: NestJS
- **Auth**: JWT (token stored in `localStorage` + `cookies`)
- **Docs**: Swagger (`http://localhost:4000/api`)
- **Microservice**: NestJS (`http://localhost:5001`)
---

## 🚀 Getting Started

### ✅ 1. Clone the Repository
```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
npm install
npm run dev
# Runs on: http://localhost:3000

Start backend (in /backend)
cd backend
npm install
npm run start:dev
# Runs on: http://localhost:4000
```

## API Docs (Swagger)
Open in browser:
👉 http://localhost:4000/api

## Microservice
Runs separately at:
👉 http://localhost:5001

## 🔐 Auth Notes
Token stored in both localStorage and cookies
Navbar & protected pages (like /dashboard, /profile) depend on token
Middleware guards routes and handles redirection based on token

## 🧪 Test the Flow
Sign up / login to receive token
Access /dashboard or /profile to test protected routes
Try removing token from localStorage and test redirection