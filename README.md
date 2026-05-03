# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

A full-stack web platform that connects local micro-entrepreneurs (cobblers, potters, tailors, artisans, small vendors) with customers for services and handmade product sales.

## ✨ Features
- Customer registration/login
- Browse entrepreneurs by category, location, and price
- Service requests and product orders
- Ratings and reviews
- Entrepreneur dashboard for listings, availability, and earnings
- Admin approval and analytics

## 🧰 Tech Stack
- **Frontend:** React.js + Tailwind CSS (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB

---

## ✅ Getting Started

### 1) Clone and install
```bash
git clone https://github.com/Anish-1205/Digital_Marketplace.git
cd Digital_Marketplace
npm install
```

### 2) Configure environment
Create a `.env` file in `server/` using `.env.example` as reference.

### 3) Run locally
```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

---

## 📁 Project Structure
```
Digital_Marketplace/
  client/   # React frontend
  server/   # Express backend
```

---

## 🔐 Admin Access
Create an admin user by setting role to `admin` in MongoDB or using a seeded script.

---

## 🧪 API Overview
Base URL: `/api`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /entrepreneurs`
- `POST /entrepreneurs`
- `POST /products`
- `POST /service-requests`
- `POST /orders`
- `POST /reviews`
- `GET /admin/metrics`

---

## 📌 Notes
- This is a deployment-ready MVP. You can extend it with payments, logistics, or mobile apps.
