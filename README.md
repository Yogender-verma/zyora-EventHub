# EventHub 🎉 — College Fest Web App

A modern, responsive, and data-driven college festival website built for the **ZyoraByte Frontend Internship**.

## 📌 Project Overview

EventHub is an interactive web application for an annual college festival. It gives students and attendees a complete digital experience to explore live announcements, search festival schedules, bookmark sessions, discover guest speakers, and register for events.

---

## 🚀 Key Features & Development Progress (Build Day 5)

### 1. 🌐 Live Data Layer (`fetch()` API)
- **Home Page Live Announcements**: Dynamically fetches the latest festival updates and news feed from `./assets/data/announcements.json`.
- **Schedule Live Events**: Dynamically fetches all 3 days of festival events from `./assets/data/schedule.json`.
- **Robust 3-State Handling**:
  - ⏳ **Loading State**: Animated spinner and loading feedback while fetching data.
  - ✅ **Success State**: Renders rich interactive cards for announcements and schedule sessions.
  - ⚠️ **Error State**: Displays clear offline / network failure warnings with a **"🔄 Retry"** button (wifi off test compliant).

### 2. 💾 Data Persistence (`localStorage`)
- **Bookmarked Schedule Sessions**: Users can bookmark sessions (⭐ Bookmark). Bookmarked items persist across refreshes under `eventhub-bookmarked-sessions`.
- **"⭐ My Bookmarks" Filter**: Dedicated schedule filter showing user's saved festival itinerary.
- **Form Registrations**: Registrations submitted on `register.html` are saved locally under `eventhub-registrations` and dynamically update the live attendee counter on the home page.
- **Speaker Favorites & Theme Settings**: Persisted in `localStorage`.

### 3. 📱 Mid-Project Quality & Checklist
- **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop using CSS Grid, Flexbox, and Media Queries.
- **Form Validation**: Real-time accessible field validation for `register.html`.
- **Consistent UI**: Unified color system, smooth micro-animations, glassmorphism headers, and keyboard accessibility.

---

## 👥 Team Responsibilities

### Shivani
- Home Page Structure & Hero Section
- Festival Launch Countdown Timer
- Schedule Page Layout & Day Filters

### Yogender Verma
- **Home & Schedule Data Layer** (`fetch()` integration with loading, success & error states)
- **Data Persistence** (`localStorage` for schedule bookmarks, attendee stats, theme & registrations)
- Speaker Cards & Search Filter
- Registration Form Validation & Error Handling
- Mid-Project Checkpoint & Documentation

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties & Animations), Vanilla JavaScript (ES6+)
- **Data & APIs**: Fetch API, Async/Await, JSON Data Store
- **Persistence**: Web Storage API (`localStorage`)
- **Version Control**: Git & GitHub

---

## 📁 Project Structure

```
zyora-EventHub/
│── index.html / home.html    # Home Page with Live Announcements & Countdown
│── schedule.html             # Live Schedule Page with Search & Bookmarks
│── speakers.html             # Guest Speakers Page
│── register.html             # Event Registration Form with Validation
│── css/
│   ├── style.css             # Design System, Components & State Styles
│   └── responsive.css        # Mobile & Tablet Breakpoints
│── js/
│   ├── script.js             # Main App Logic, Fetch API & LocalStorage
│   └── register.js           # Registration Validation & Storage
│── assets/
│   └── data/
│       ├── announcements.json # Live Announcements Data
│       └── schedule.json      # Festival Schedule Data
└── README.md                 # Documentation
```

---

## 📅 Status Checklist (4 Days to Demo Day)

- [x] Day 1: Project Setup & Structure
- [x] Day 2: Responsive HTML/CSS Layouts
- [x] Day 3: Interactive Components & Countdown Timer
- [x] Day 4: Form Validation & Speaker Interactions
- [x] **Day 5: Live Data Fetching, Persistence & 3-State Error Handling**
- [ ] Day 6: Final Polish, Micro-Interactions & Cross-Browser Testing
- [ ] Demo Day Prep 🎉

---

Built with ❤️ as part of the ZyoraByte Frontend Internship.