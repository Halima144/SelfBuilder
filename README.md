# SelfBuilder 🚀

**SelfBuilder** is a personal development mobile app built as a Final Year Project, designed to help users build better habits through structured challenges, daily task tracking, streaks, and community-driven motivation.

![Platform](https://img.shields.io/badge/platform-React%20Native-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2F%20Express-339933?logo=node.js)
![Database](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb)
![Status](https://img.shields.io/badge/status-Final%20Year%20Project-ab73d1)

---

## 📱 About the Project

SelfBuilder helps users take control of their personal growth by enrolling in structured **challenges** across multiple categories, completing **daily tasks**, tracking **streaks**, earning **badges**, and competing on a **leaderboard** with other users. The app also supports **premium challenges** with integrated payment options tailored for local users.

This project was developed as a Final Year Project for a Software Engineering degree, covering the full software development lifecycle — from requirements and estimation (COCOMO) to design, implementation, and testing.

---

## ✨ Key Features

- 🎯 **Challenge Enrollment** — Browse and join challenges across multiple categories
- ✅ **Daily Task Tracking** — Log daily progress for each active challenge
- 🔥 **Streak System** — Stay motivated by maintaining consistency streaks
- 🏆 **Leaderboard** — Compete with other users based on progress and points
- 🎖️ **Badges** — Unlock achievement badges as milestones are reached
- 👤 **Profile & Settings** — Manage personal information and preferences
- 💳 **Premium Challenges** — Unlock exclusive challenges via:
  - Easypaisa
  - JazzCash
  - Card Payment
  - Bank Transfer

---

## 🛠️ Tech Stack

**Frontend**
- React Native (CLI, not Expo)
- NativeWind (Tailwind CSS for React Native)
- TypeScript / JavaScript

**Backend**
- Node.js
- Express.js (MVC architecture)
- MongoDB Atlas (Mongoose ODM)

---

## 📂 Project Structure

SelfBuilder/
├── client/          # React Native frontend
│   ├── screens/
│   ├── components/
│   └── ...
├── server/          # Node.js + Express backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── ...
└── README.md

---

## 📸 Screenshots

### Authentication
| Sign In | Create Account |
|---|---|
| ![Login](screenshots/login.png) | ![Signup](screenshots/signup.png) |

### Home & Challenges
| Explore Challenges | My Challenges |
|---|---|
| ![Home](screenshots/home_challenges.png) | ![My Challenges](screenshots/my_challenges.png) |

### Challenge Tracking
| Health Challenge | Productivity Challenge |
|---|---|
| ![Health Challenge](screenshots/challenge_health.png) | ![Productivity Challenge](screenshots/challenge_productivity.png) |

Each challenge screen shows day-by-day progress, current streak, weekly activity, and today's task.

### Leaderboard
![Leaderboard](screenshots/leaderboard.png)

Users are ranked by completed challenges and active streaks, with category-based filters (Productivity, Mindset, Health).

### Profile
| Profile | Edit Profile |
|---|---|
| ![Profile](screenshots/profile.png) | ![Edit Profile](screenshots/edit_profile.png) |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm installed
- React Native development environment set up (Android Studio for Android)
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository
   git clone https://github.com/Halima144/SelfBuilder.git
   cd SelfBuilder

2. Install backend dependencies
   cd server
   npm install

3. Install frontend dependencies
   cd ../client
   npm install

4. Set up environment variables in server/.env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000

5. Run the backend server
   cd server
   npm start

6. Run the React Native app
   cd client
   npx react-native run-android

---

## 🎓 Final Year Project

This project was developed and estimated using industry-standard software engineering practices, including COCOMO effort estimation and Agile development methodology, as part of a Software Engineering degree program.

---

## 👩‍💻 Author

**Halima**
GitHub: [@Halima144](https://github.com/Halima144)

---

## 📄 License

This project is developed for academic purposes as part of a Final Year Project.
