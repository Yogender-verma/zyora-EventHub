# EventHub 🎉 — College Fest Web App

A modern, responsive, and data-driven college festival website built for the **ZyoraByte Frontend Internship**.

---

## 📌 Project Overview

**EventHub 2026** is an interactive web application for an annual college festival hosted at **Google Office, Hyderabad**. It gives students, creators, and attendees a complete digital experience to explore live announcements, search festival schedules, bookmark sessions, discover guest speakers from **WellNest**, and register for events.

---

## 🚀 Key Features & Development Highlights

### 1. 🌐 Live & Fail-Safe Data Layer
- **Home Page Announcements**: Dynamically fetches festival updates from `./assets/data/announcements.json` with embedded offline fallback.
- **Schedule Live Events**: Dynamically fetches 3 days of festival events from `./assets/data/schedule.json`.
- **Speakers Profiles**: Dynamically fetches guest speaker profiles from `./assets/data/speakers.json` with SVG avatar fallbacks (`onerror`).
- **Fail-Safe 3-State Architecture**:
  - ⏳ **Loading State**: Animated spinner during initial data fetch.
  - ✅ **Success State**: Renders rich interactive cards for announcements, schedule sessions, and speakers.
  - 🛡️ **Offline & `file://` Fallback**: Zero-failure fallback layer ensuring the app renders 100% reliably even when opened directly via local file explorer or offline mode.

### 2. 🎨 Dark Glassmorphism Design System
- **Section Box Architecture**: Every page section is enclosed in a frosted glass box (`backdrop-filter: blur(18px)`) with glowing borders and icon headers.
- **Full-Width Schedule Timeline**: Spacious horizontal timeline cards with time badges, category tags, and bookmark toggles.
- **Responsive Speaker Grid**: 4-column grid layout for guest speakers with rectangular photo containers, role badges, and favorite toggles.
- **Registration Form**: 2-column responsive form grid with real-time field validation, benefit pills, and localStorage registration persistence.

### 3. 💾 Data Persistence (`localStorage`)
- **Bookmarked Sessions**: Saved locally under `eventhub-bookmarked-sessions`.
- **"⭐ My Bookmarks" Filter**: Dedicated schedule filter showing saved festival itinerary.
- **Speaker Favorites**: Saved under `eventhub-favorites`.
- **Live Registrations**: Saved under `eventhub-registrations`, dynamically updating the live attendee counter (420+).

---

## 📁 Project Structure

```
zyora-EventHub/
│── index.html / home.html    # Home Page with Section Boxes, Countdown & Live Feed
│── schedule.html             # Full-Width Timeline Schedule with Search & Bookmarks
│── speakers.html             # Guest Speakers Page with Favorite Toggles & Search
│── register.html             # Grid Event Registration Form with Validation
│── css/
│   ├── style.css             # Glassmorphism Design System & Responsive Styles
│   └── responsive.css        # Mobile & Tablet Breakpoints
│── js/
│   ├── script.js             # Main App Logic, Schedule, Announcements & LocalStorage
│   ├── speakers.js           # Speakers Search, Filter & Image Fallback Module
│   └── register.js           # Form Validation, Real-Time Alerts & Storage
│── assets/
│   ├── images/               # Speaker Photos (Sindhu, Athira, Vismaya, Shivani)
│   └── data/
│       ├── announcements.json # Live Announcements Data
│       ├── schedule.json      # Festival Schedule Data
│       └── speakers.json      # Guest Speakers Data
└── README.md                 # Project Documentation
```

---

## 🏃‍♂️ How to Run Locally

Since this project uses vanilla HTML, CSS, and JavaScript with the Fetch API, you need a local web server to run it correctly and avoid CORS issues when fetching the local JSON files.

### Using VS Code (Recommended)
1. Install the **Live Server** extension by Ritwick Dey.
2. Open this project folder in VS Code.
3. Right-click on `index.html` and select **Open with Live Server**.
4. The app will launch in your default browser at `http://localhost:5500`.

### Using Python
If you have Python installed, you can easily start a local server:
1. Open your terminal in the project directory.
2. Run `python -m http.server 8000` (or `python3 -m http.server 8000`).
3. Open your browser and navigate to `http://localhost:8000`.

### Using Node.js
If you have Node.js installed, you can use `http-server` or `serve`:
1. Open your terminal in the project directory.
2. Run `npx serve .` or `npx http-server`.
3. Follow the output link to view the app in your browser.

---

## 👥 Team Responsibilities

### Shivani
- **Speakers Page**: Complete UI/UX design, page structure, layout, styles, speaker cards, search filter, and favorite interactions
- **Registration Page**: Complete UI/UX design, form structure, layout, styles, field validation, and registration storage
- **Documentation**: Initial README setup and project documentation

### Yogender Verma
- **Home Page**: Complete UI/UX design, structure, hero section, launch countdown timer, live announcements, sponsors, and contact sections
- **Schedule Page**: Complete UI/UX design, full-width event timeline, day filtering, and local schedule bookmarks
- **Data & Persistence Layer**: Live `fetch()` API with fail-safe fallbacks, 3-state data handling, and `localStorage` integration

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism Animations), Vanilla JavaScript (ES6+, Async/Await)
- **Data & APIs**: Fetch API, Local JSON Data Stores, SVG Data Fallbacks
- **Persistence**: Web Storage API (`localStorage`)
- **Version Control**: Git & GitHub

---

## 📅 Status Checklist

- [x] Day 1: Project Setup & Structure
- [x] Day 2: Responsive HTML/CSS Layouts
- [x] Day 3: Interactive Components & Countdown Timer
- [x] Day 4: Form Validation & Speaker Interactions
- [x] Day 5: Live Data Fetching, Persistence & 3-State Error Handling
- [x] Day 6: UI Glassmorphism Redesign, Section Box Card Architecture & Mobile Polish
- [x] Demo Day Prep 🎉

---

Built with ❤️ for the **ZyoraByte Frontend Internship**.