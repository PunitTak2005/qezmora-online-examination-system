# 🟢 Qezmora — Smart Exams. Simplified.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-cyan.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)

A modern MERN Stack online examination platform designed for educational institutions, training centers, and organizations conducting secure online assessments.

---

## 📌 Project Overview

**Qezmora** is a full-stack online examination platform built with the MERN Stack (MongoDB, Express.js, React.js, Node.js). It provides secure online assessments through fullscreen exam mode, anti-cheating detection, automated grading, real-time leaderboards, detailed analytics, and role-based dashboards for students, teachers, and administrators.

---

## ✨ Features

- **🛡️ Secure Exam Mode**: Fullscreen enforcement, tab-switch monitoring, window blur detection, and automated integrity violation logging.
- **🔐 Role-Based Access**: JWT-based authentication with distinct Student, Teacher, and Admin dashboards and protected API routing.
- **📚 500+ Question Bank**: 26 published assessment modules containing 530+ MCQs across Mathematics, Science, Programming, Aptitude, English, and Quantum Computing.
- **🏆 Global Leaderboard**: Weekly, Monthly, and All-Time student rankings with animated podiums, accuracy metrics, and rank trend indicators.
- **📊 Real-Time Analytics**: Visual performance trends, pass/fail ratios, average attempt durations, and automated scoring reports.
- **📨 Integrated Contact System**: Inquiry form with MongoDB storage and dedicated Admin Message Management dashboard.
- **🌙 Dark/Light Theme**: Native theme switcher supporting Forest Green (`#1B365D`) and Academic Gold design system.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Axios, Lucide React Icons
- **Backend**: Node.js, Express.js, JWT Authentication, Multer (Avatar Uploads), Express Rate Limit, Helmet Security
- **Database**: MongoDB Atlas with Mongoose ODM
- **Deployment**: Vercel (Frontend SPA), Render (Backend Node API), MongoDB Atlas (Cloud Database)

---

## 📁 Project Structure

```text
qezmora-online-examination-system/
├── client/
│   ├── public/
│   │   └── logo/
│   ├── src/
│   │   ├── api/          # Axios instance & HTTP interceptors
│   │   ├── components/   # Navbar, Sidebar, Modal, Timer, ExamCard, StatCard
│   │   ├── context/      # AuthContext & ThemeContext
│   │   └── pages/        # Public, Student, Teacher, and Admin views
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vercel.json       # Vercel SPA routing rewrites
│   └── package.json
│
├── server/
│   ├── config/           # Database configuration
│   ├── controllers/      # Auth, Exam, Question, Attempt, User, Leaderboard
│   ├── middleware/       # JWT Auth, RoleCheck, ErrorHandler, Upload
│   ├── models/           # User, Exam, Question, Attempt, Category, Violation
│   ├── routes/           # RESTful API Express routers
│   ├── scripts/          # Seeder & audit scripts
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (`mongodb://localhost:27017/onlineexam`) or MongoDB Atlas URI
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/PunitTak2005/qezmora-online-examination-system.git
cd qezmora-online-examination-system
```

### 2. Install Dependencies

#### Backend Dependencies:
```bash
cd server
npm install
```

#### Frontend Dependencies:
```bash
cd ../client
npm install
```

---

## ⚙️ Environment Variables

### Backend Setup (`server/.env`)
```env
NODE_ENV=development
PORT=9004
MONGO_URI=mongodb://localhost:27017/onlineexam
JWT_SECRET=supersecretjwtkey2026onlineexamsystem
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3255
```

### Frontend Setup (`client/.env`)
```env
VITE_API_URL=http://localhost:9004/api
```

---

## ⚡ Running the Project

1. **Start Express Backend**:
   ```bash
   cd server
   npm run dev
   ```
   *(Server starts on `http://localhost:9004`)*

2. **Start React Vite Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   *(Frontend starts on `http://localhost:3255`)*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user details |
| `GET` | `/api/exams/all` | Public/Student | Fetch all published exam modules |
| `POST` | `/api/attempts/start` | Student | Initialize or resume secure exam attempt |
| `POST` | `/api/attempts/submit` | Student | Auto-grade and submit exam attempt |
| `GET` | `/api/leaderboard` | Public | Retrieve Weekly, Monthly, and All-Time rankings |
| `GET` | `/api/users/dashboard-stats` | Admin | Fetch overall platform metrics & performance |
| `POST` | `/api/contact` | Public | Submit user contact/support inquiry |

---

## 🔒 Security & Anti-Cheating Protections

- **Secure Fullscreen Enforcement**: Requires active browser fullscreen mode before question rendering.
- **Tab & Window Blur Detection**: Records integrity violations when students switch tabs or unfocus the browser window.
- **Safe Exit Flow**: Provides confirmation modal, progress saving, and graceful fullscreen cleanup.
- **JWT Protection**: Secured HTTP endpoints with token expiration and role-based permissions (`student`, `teacher`, `admin`).
- **Input Sanitization**: MongoDB query sanitization and error masking.

---

## 👨‍💻 Author

**Punit Tak**
- GitHub: [@PunitTak2005](https://github.com/PunitTak2005)
- Repository: [qezmora-online-examination-system](https://github.com/PunitTak2005/qezmora-online-examination-system)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
