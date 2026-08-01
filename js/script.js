// EventHub - Main Application Script with Live Data & Fail-Safe Fallbacks
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

const THEME_KEY = "eventhub-theme";
const BOOKMARKS_KEY = "eventhub-bookmarked-sessions";
const REGISTRATIONS_KEY = "eventhub-registrations";

/* Default Announcements Data Fallback */
const DEFAULT_ANNOUNCEMENTS = [
    {
        "id": "ann-1",
        "title": "🎉 Hackathon Registration Extended!",
        "category": "Competition",
        "time": "10 mins ago",
        "content": "Due to overwhelming demand, registration for the 24-Hour AI Hackathon has been extended to Oct 12th. Form your teams now!",
        "badge": "Urgent"
    },
    {
        "id": "ann-2",
        "title": "🎵 Keynote Speaker & Concert Lineup Revealed",
        "category": "Concert",
        "time": "1 hour ago",
        "content": "We are thrilled to announce our celebrity musical guest for the Day 1 Opening Night Concert! Check out the schedule page.",
        "badge": "New"
    },
    {
        "id": "ann-3",
        "title": "🤖 Workshop Seats Allocation Update",
        "category": "Workshop",
        "time": "3 hours ago",
        "content": "Hands-on seats for the Design & AI Workshop in Innovation Lab are filling up fast. Registered participants get priority entry.",
        "badge": "Info"
    }
];

/* Default Schedule Data Fallback */
const DEFAULT_SCHEDULE = [
    {
        "id": "evt-101",
        "day": "day-1",
        "time": "09:00 AM",
        "title": "Inauguration Ceremony",
        "venue": "Main Auditorium",
        "speaker": "Fest Committee & Special Guests",
        "description": "Welcome remarks, cultural performances, and the official opening of EventHub 2026.",
        "tag": "Ceremony"
    },
    {
        "id": "evt-102",
        "day": "day-1",
        "time": "11:30 AM",
        "title": "Innovation Expo & Tech Showcase",
        "venue": "Exhibition Hall A",
        "speaker": "Student Innovators & Startups",
        "description": "Explore student projects, startup booths, interactive tech displays, and prototype demos.",
        "tag": "Exhibition"
    },
    {
        "id": "evt-103",
        "day": "day-1",
        "time": "02:00 PM",
        "title": "From Idea to Impact – Building a Student Startup",
        "venue": "Seminar Hall 1",
        "speaker": "Sindhu J (Founder, WellNest)",
        "description": "Learn how to transform your campus project into a venture-backed startup.",
        "tag": "Keynote"
    },
    {
        "id": "evt-104",
        "day": "day-1",
        "time": "07:00 PM",
        "title": "Opening Night Concert",
        "venue": "Open Air Stage",
        "speaker": "Campus Beats & Guest Bands",
        "description": "Kick off the fest with live music, DJ sets, and a spectacular campus celebration under the stars.",
        "tag": "Concert"
    },
    {
        "id": "evt-201",
        "day": "day-2",
        "time": "10:00 AM",
        "title": "Design and AI Workshop",
        "venue": "Innovation Lab",
        "speaker": "Shivani A (CTO, WellNest)",
        "description": "A hands-on session on building smarter products with AI tools and modern design thinking.",
        "tag": "Workshop"
    },
    {
        "id": "evt-202",
        "day": "day-2",
        "time": "01:30 PM",
        "title": "Panel Discussion: The Future of Work & AI",
        "venue": "Conference Room 2",
        "speaker": "Industry Mentors & Alumni",
        "description": "Industry experts discuss emerging tech skills, remote collaboration, and career readiness.",
        "tag": "Panel"
    },
    {
        "id": "evt-203",
        "day": "day-2",
        "time": "04:00 PM",
        "title": "UI/UX Design Challenge Sprint",
        "venue": "Design Studio B",
        "speaker": "Design Club Mentors",
        "description": "Rapid prototyping contest for student designers solving real campus accessibility challenges.",
        "tag": "Competition"
    },
    {
        "id": "evt-204",
        "day": "day-2",
        "time": "08:00 PM",
        "title": "Grand Cultural Night",
        "venue": "Amphitheatre",
        "speaker": "Cultural Society & Performing Arts",
        "description": "Dance, drama, and music performances showcasing student talent from across colleges.",
        "tag": "Culture"
    },
    {
        "id": "evt-301",
        "day": "day-3",
        "time": "09:30 AM",
        "title": "24-Hour Hackathon Finale Demos",
        "venue": "Tech Block",
        "speaker": "Hackathon Finalist Teams",
        "description": "Top 10 finalist teams present their live software/hardware solutions to judges.",
        "tag": "Hackathon"
    },
    {
        "id": "evt-302",
        "day": "day-3",
        "time": "01:00 PM",
        "title": "Leading Innovation with Purpose",
        "venue": "Main Auditorium",
        "speaker": "Vismaya S M (CEO, WellNest)",
        "description": "An inspiring talk on empathetic leadership and driving sustainable impact in tech.",
        "tag": "Keynote"
    },
    {
        "id": "evt-303",
        "day": "day-3",
        "time": "03:30 PM",
        "title": "Awards and Closing Ceremony",
        "venue": "Main Auditorium",
        "speaker": "Fest Organizing Committee",
        "description": "Recognize winners, award prize trophies, celebrate participants, and officially close the festival.",
        "tag": "Ceremony"
    },
    {
        "id": "evt-304",
        "day": "day-3",
        "time": "06:30 PM",
        "title": "Farewell Sunset Jam & Acoustic Night",
        "venue": "Rooftop Garden",
        "speaker": "Acoustic Band & Open Mic",
        "description": "A relaxed evening of indie music, networking, coffee, and final memories with friends.",
        "tag": "Concert"
    }
];

function initApp() {
    initTheme();
    initNavMenu();
    initCountdown();
    initReveal();
    setActiveNav();
    updateLiveAttendeeCount();

    if (document.getElementById("announcements-feed")) {
        initAnnouncements();
    }

    if (document.getElementById("schedule-grid")) {
        initSchedule();
    }

    window.addEventListener("scroll", setActiveNav);
    window.addEventListener("resize", setActiveNav);
}

/* Local Storage Registrations Counter */
function updateLiveAttendeeCount() {
    const counterEl = document.getElementById("live-registration-count");
    if (!counterEl) return;
    try {
        const stored = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || [];
        const baseCount = 420;
        counterEl.textContent = baseCount + stored.length;
    } catch {
        counterEl.textContent = "420";
    }
}

/* Active Nav Bar Link */
function setActiveNav() {
    const current = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === current || (current === "" && href === "index.html") || (current === "home.html" && href === "index.html")) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}

/* Mobile Nav Toggle */
function initNavMenu() {
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (!menu || !nav) return;

    menu.addEventListener("click", () => {
        nav.classList.toggle("open");
        menu.setAttribute("aria-expanded", nav.classList.contains("open"));
    });

    document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !menu.contains(e.target)) {
            nav.classList.remove("open");
            menu.setAttribute("aria-expanded", "false");
        }
    });
}

/* Theme Toggle Support */
function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
}

/* Festival Countdown */
function initCountdown() {
    const countdown = document.getElementById("countdown");
    if (!countdown) return;

    const targetDate = countdown.dataset.targetDate ? new Date(countdown.dataset.targetDate).getTime() : new Date("2026-10-15T09:00:00").getTime();

    function update() {
        const now = new Date().getTime();
        let diff = targetDate - now;

        if (diff <= 0) {
            countdown.innerHTML = "<h3>🎉 Event Started!</h3>";
            return;
        }

        const days = Math.floor(diff / 86400000);
        diff %= 86400000;
        const hours = Math.floor(diff / 3600000);
        diff %= 3600000;
        const minutes = Math.floor(diff / 60000);
        diff %= 60000;
        const seconds = Math.floor(diff / 1000);

        const daysEl = document.getElementById("cd-days");
        const hoursEl = document.getElementById("cd-hours");
        const minsEl = document.getElementById("cd-mins");
        const secsEl = document.getElementById("cd-secs");

        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
}

/* Announcements Live Fetch with Fail-Safe Fallback */
async function initAnnouncements() {
    const feed = document.getElementById("announcements-feed");
    const loadingState = document.getElementById("announcements-loading");
    const errorState = document.getElementById("announcements-error");
    const refreshBtn = document.getElementById("refresh-announcements-btn");
    const retryBtn = document.getElementById("retry-announcements-btn");

    if (!feed) return;

    async function loadData() {
        if (loadingState) loadingState.hidden = false;
        if (errorState) errorState.hidden = true;
        feed.hidden = true;

        let announcements = null;
        const paths = ["assets/data/announcements.json", "data/announcements.json", "./assets/data/announcements.json"];
        for (const p of paths) {
            try {
                const res = await fetch(p);
                if (res.ok) {
                    announcements = await res.json();
                    if (Array.isArray(announcements)) break;
                }
            } catch (e) {
                // Silently fallback if on file:// protocol or network failure
            }
        }

        if (!announcements) announcements = DEFAULT_ANNOUNCEMENTS;

        feed.innerHTML = "";
        announcements.forEach(item => {
            const card = document.createElement("article");
            card.className = "feature-card announcement-card";
            card.innerHTML = `
                <div class="announcement-header">
                    <span class="pill">${item.badge || item.category}</span>
                    <small class="announcement-time">⏱️ ${item.time}</small>
                </div>
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            `;
            feed.appendChild(card);
        });

        if (loadingState) loadingState.hidden = true;
        if (errorState) errorState.hidden = true;
        feed.hidden = false;
    }

    if (refreshBtn) refreshBtn.addEventListener("click", loadData);
    if (retryBtn) retryBtn.addEventListener("click", loadData);

    loadData();
}

/* Schedule Live Fetch & Filtering with LocalStorage Bookmarks */
function getBookmarkedSessions() {
    try {
        return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveBookmarkedSessions(bookmarks) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

async function initSchedule() {
    const grid = document.getElementById("schedule-grid");
    const loadingState = document.getElementById("schedule-loading");
    const errorState = document.getElementById("schedule-error");
    const emptyState = document.getElementById("schedule-empty");
    const retryBtn = document.getElementById("retry-schedule-btn");
    const searchInput = document.getElementById("event-search");
    const filterChips = document.querySelectorAll(".schedule-controls .filter-chip");
    const bookmarkCountEl = document.getElementById("bookmark-count");

    if (!grid) return;

    function updateBookmarkCount() {
        const bookmarks = getBookmarkedSessions();
        if (bookmarkCountEl) bookmarkCountEl.textContent = bookmarks.length;
    }

    async function loadSchedule() {
        if (loadingState) loadingState.hidden = false;
        if (errorState) errorState.hidden = true;
        grid.hidden = true;

        let events = null;
        const paths = ["assets/data/schedule.json", "data/schedule.json", "./assets/data/schedule.json"];
        for (const p of paths) {
            try {
                const res = await fetch(p);
                if (res.ok) {
                    events = await res.json();
                    if (Array.isArray(events)) break;
                }
            } catch (e) {
                // Silently fallback if on file:// protocol
            }
        }

        if (!events) events = DEFAULT_SCHEDULE;

        renderScheduleGrid(events);

        if (loadingState) loadingState.hidden = true;
        if (errorState) errorState.hidden = true;
        grid.hidden = false;
        updateBookmarkCount();
    }

    function renderScheduleGrid(events) {
        const bookmarks = getBookmarkedSessions();
        grid.innerHTML = "";

        const days = [
            { id: "day-1", label: "Day 1 - Kickoff & Innovation" },
            { id: "day-2", label: "Day 2 - Workshops & Culture" },
            { id: "day-3", label: "Day 3 - Hackathon & Keynotes" }
        ];

        days.forEach(d => {
            const dayEvents = events.filter(e => e.day === d.id);
            if (!dayEvents.length) return;

            const dayCard = document.createElement("div");
            dayCard.className = "schedule-day-card";
            dayCard.dataset.day = d.id;

            let eventsHTML = dayEvents.map(evt => {
                const isBookmarked = bookmarks.includes(evt.id);
                return `
                    <div class="schedule-event" data-id="${evt.id}" data-search="${evt.title} ${evt.venue} ${evt.speaker} ${evt.tag}".toLowerCase()>
                        <div class="schedule-event-header" style="display:flex; justify-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                            <span class="schedule-time">⏰ ${evt.time}</span>
                            <span class="venue-badge">${evt.tag || "Session"} &bull; ${evt.venue}</span>
                        </div>
                        <h3 style="margin-top:0.4rem; font-size:1.1rem; color:#FFF;">${evt.title}</h3>
                        <p style="margin-bottom:0.4rem; font-size:0.9rem; color:#60A5FA;"><strong>Speaker:</strong> ${evt.speaker}</p>
                        <p style="font-size:0.88rem; color:#94A3B8;">${evt.description}</p>
                        <button type="button" class="bookmark-btn ${isBookmarked ? "active" : ""}" data-id="${evt.id}" style="margin-top:0.4rem; font-size:0.85rem; padding:0.4rem 0.8rem;">
                            ${isBookmarked ? "★ Bookmarked" : "☆ Bookmark Session"}
                        </button>
                    </div>
                `;
            }).join("");

            dayCard.innerHTML = `
                <h2><span class="day-pill">${d.id.replace("-", " ").toUpperCase()}</span> ${d.label}</h2>
                <div class="events-list">${eventsHTML}</div>
            `;

            grid.appendChild(dayCard);
        });

        attachBookmarkHandlers();
        attachFilterAndSearchHandlers();
    }

    function attachBookmarkHandlers() {
        const buttons = grid.querySelectorAll(".bookmark-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                let bookmarks = getBookmarkedSessions();
                if (bookmarks.includes(id)) {
                    bookmarks = bookmarks.filter(b => b !== id);
                    btn.classList.remove("active");
                    btn.textContent = "☆ Bookmark Session";
                } else {
                    bookmarks.push(id);
                    btn.classList.add("active");
                    btn.textContent = "★ Bookmarked";
                }
                saveBookmarkedSessions(bookmarks);
                updateBookmarkCount();
            });
        });
    }

    function attachFilterAndSearchHandlers() {
        let activeFilter = "all";

        function filterEvents() {
            const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
            const bookmarks = getBookmarkedSessions();
            const dayCards = grid.querySelectorAll(".schedule-day-card");
            let totalVisibleEvents = 0;

            dayCards.forEach(card => {
                const cardDay = card.dataset.day;
                const events = card.querySelectorAll(".schedule-event");
                let visibleInCard = 0;

                events.forEach(evt => {
                    const id = evt.dataset.id;
                    const searchText = (evt.dataset.search || "").toLowerCase();
                    const matchesQuery = !query || searchText.includes(query);

                    let matchesDay = false;
                    if (activeFilter === "all") matchesDay = true;
                    else if (activeFilter === cardDay) matchesDay = true;
                    else if (activeFilter === "bookmarks" && bookmarks.includes(id)) matchesDay = true;

                    if (matchesQuery && matchesDay) {
                        evt.style.display = "block";
                        visibleInCard++;
                        totalVisibleEvents++;
                    } else {
                        evt.style.display = "none";
                    }
                });

                if (visibleInCard > 0) {
                    card.classList.remove("is-hidden");
                } else {
                    card.classList.add("is-hidden");
                }
            });

            if (emptyState) {
                emptyState.hidden = totalVisibleEvents > 0;
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", filterEvents);
        }

        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                activeFilter = chip.dataset.filter || "all";
                filterEvents();
            });
        });
    }

    if (retryBtn) retryBtn.addEventListener("click", loadSchedule);

    loadSchedule();
}

/* Scroll Reveal Animation */
function initReveal() {
    const elements = document.querySelectorAll("main > section, article, .speaker-card, form, .schedule-day-card");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    elements.forEach(el => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

console.log("✅ EventHub Fail-Safe Script Loaded Successfully");