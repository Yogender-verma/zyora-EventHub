/**
 * EventHub - Main Application Script
 * Live Data Fetch (3 States: Loading, Success, Error) & LocalStorage Persistence
 * ZyoraByte Frontend Internship - Day 5
 */

const KEYS = {
  REGISTRATIONS: 'eventhub-registrations',
  BOOKMARKS: 'eventhub-bookmarked-sessions',
  FAVORITES: 'eventhub-favorites',
  THEME: 'eventhub-theme'
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTheme();
  initReveal();

  const page = document.body.dataset.page;
  if (page === 'home') {
    initHomeExperience();
  } else if (page === 'schedule') {
    initScheduleExperience();
  }

  // Common initializers for pages with speaker lists or countdowns
  if (document.getElementById('speakerList')) {
    initSpeakersExperience();
  }
  if (document.getElementById('countdown')) {
    initCountdown();
  }
});

/* ==========================================================================
   Navigation & Theme Utilities
   ========================================================================== */

function initNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'home.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPath = href.split('/').pop() || 'home.html';
    const isActive =
      linkPath === currentPath ||
      ((currentPath === 'home.html' || currentPath === 'index.html' || currentPath === '') &&
        (linkPath === 'home.html' || linkPath === 'index.html'));
    link.classList.toggle('active', isActive);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(KEYS.THEME);
  if (savedTheme) {
    document.body.dataset.theme = savedTheme;
  }
}

/* ==========================================================================
   Home Page: Live Announcements (fetch with 3 states) + LocalStorage Stats
   ========================================================================== */

function initHomeExperience() {
  updateLiveAttendeeCount();
  fetchAnnouncements();

  const refreshBtn = document.getElementById('refresh-announcements-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => fetchAnnouncements());
  }

  const retryBtn = document.getElementById('retry-announcements-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => fetchAnnouncements());
  }
}

function updateLiveAttendeeCount() {
  const countEl = document.getElementById('live-registration-count');
  if (!countEl) return;

  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.REGISTRATIONS)) || [];
    // Default base count + local stored registrations
    const totalCount = 120 + stored.length;
    countEl.textContent = totalCount.toLocaleString();
  } catch (e) {
    countEl.textContent = '120';
  }
}

/**
 * Fetch Announcements from API/Local JSON
 * Handles Loading, Success, and Error states
 */
async function fetchAnnouncements() {
  const loadingState = document.getElementById('announcements-loading');
  const errorState = document.getElementById('announcements-error');
  const errorMsg = document.getElementById('announcements-error-msg');
  const feedContainer = document.getElementById('announcements-feed');

  if (!feedContainer) return;

  // 1. Show Loading State
  loadingState.hidden = false;
  errorState.hidden = true;
  feedContainer.hidden = true;

  try {
    // Artificial delay to demonstrate loading spinner smoothly (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const response = await fetch('./assets/data/announcements.json');
    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();

    // 2. Success State: Render announcements
    renderAnnouncements(data, feedContainer);

    loadingState.hidden = true;
    errorState.hidden = true;
    feedContainer.hidden = false;
  } catch (error) {
    // 3. Error State: Show user-friendly error message & Retry option
    console.error('Announcements fetch error:', error);
    if (errorMsg) {
      errorMsg.textContent = !navigator.onLine
        ? 'You appear to be offline. Turn on your Wi-Fi/Internet connection and retry.'
        : `Could not fetch live updates (${error.message}). Please try again.`;
    }

    loadingState.hidden = true;
    feedContainer.hidden = true;
    errorState.hidden = false;
  }
}

function renderAnnouncements(announcements, container) {
  if (!announcements || announcements.length === 0) {
    container.innerHTML = '<p class="empty-state">No live announcements at the moment.</p>';
    return;
  }

  container.innerHTML = announcements
    .map(
      (item) => `
    <article class="announcement-card reveal is-visible" data-id="${item.id}">
      <div class="announcement-header">
        <span class="badge-pill ${item.badge ? item.badge.toLowerCase() : ''}">${item.badge || item.category}</span>
        <span class="announcement-time">⏱️ ${item.time}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.content)}</p>
    </article>
  `
    )
    .join('');
}

/* ==========================================================================
   Schedule Page: Live Schedule Fetch (3 States) + LocalStorage Bookmarks
   ========================================================================== */

let loadedScheduleData = [];
let activeScheduleFilter = 'all';

function initScheduleExperience() {
  fetchScheduleData();

  const searchInput = document.getElementById('event-search');
  if (searchInput) {
    searchInput.addEventListener('input', applyScheduleFilters);
  }

  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeScheduleFilter = chip.dataset.filter || 'all';
      applyScheduleFilters();
    });
  });

  const retryBtn = document.getElementById('retry-schedule-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => fetchScheduleData());
  }

  updateBookmarkBadgeCount();
}

/**
 * Fetch Schedule Data with 3 States (Loading, Success, Error)
 */
async function fetchScheduleData() {
  const loadingState = document.getElementById('schedule-loading');
  const errorState = document.getElementById('schedule-error');
  const errorMsg = document.getElementById('schedule-error-msg');
  const gridContainer = document.getElementById('schedule-grid');
  const emptyState = document.getElementById('schedule-empty');

  if (!gridContainer) return;

  // 1. Loading State
  loadingState.hidden = false;
  errorState.hidden = true;
  gridContainer.hidden = true;
  if (emptyState) emptyState.hidden = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const response = await fetch('./assets/data/schedule.json');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    loadedScheduleData = await response.json();

    // 2. Success State: render & apply filters
    loadingState.hidden = true;
    errorState.hidden = true;
    gridContainer.hidden = false;

    applyScheduleFilters();
  } catch (error) {
    // 3. Error State
    console.error('Schedule fetch error:', error);
    if (errorMsg) {
      errorMsg.textContent = !navigator.onLine
        ? 'You are offline. Reconnect to the internet and try again.'
        : `Failed to load schedule data (${error.message}).`;
    }

    loadingState.hidden = true;
    gridContainer.hidden = true;
    errorState.hidden = false;
  }
}

function getStoredBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.BOOKMARKS)) || [];
  } catch (e) {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  updateBookmarkBadgeCount();
}

function updateBookmarkBadgeCount() {
  const badge = document.getElementById('bookmark-count');
  if (badge) {
    const bookmarks = getStoredBookmarks();
    badge.textContent = bookmarks.length;
  }
}

function toggleBookmark(eventId) {
  const bookmarks = getStoredBookmarks();
  const index = bookmarks.indexOf(eventId);
  let updated;

  if (index >= 0) {
    updated = bookmarks.filter((id) => id !== eventId);
  } else {
    updated = [...bookmarks, eventId];
  }

  saveBookmarks(updated);
  applyScheduleFilters();
}

function applyScheduleFilters() {
  const gridContainer = document.getElementById('schedule-grid');
  const emptyState = document.getElementById('schedule-empty');
  const searchInput = document.getElementById('event-search');

  if (!gridContainer || !loadedScheduleData.length) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const bookmarkedIds = getStoredBookmarks();

  // Filter events based on activeFilter and search query
  const filteredEvents = loadedScheduleData.filter((item) => {
    // Filter by day or bookmarks
    let filterMatch = false;
    if (activeScheduleFilter === 'all') {
      filterMatch = true;
    } else if (activeScheduleFilter === 'bookmarks') {
      filterMatch = bookmarkedIds.includes(item.id);
    } else {
      filterMatch = item.day === activeScheduleFilter;
    }

    // Filter by search query
    const textToMatch = `${item.title} ${item.speaker} ${item.venue} ${item.description} ${item.tag}`.toLowerCase();
    const searchMatch = !query || textToMatch.includes(query);

    return filterMatch && searchMatch;
  });

  if (filteredEvents.length === 0) {
    gridContainer.innerHTML = '';
    gridContainer.hidden = true;
    if (emptyState) {
      emptyState.hidden = false;
      emptyState.textContent =
        activeScheduleFilter === 'bookmarks' && bookmarkedIds.length === 0
          ? 'You haven’t bookmarked any sessions yet. Click the "⭐ Bookmark" button on any session!'
          : 'No events found matching your filter/search criteria.';
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;
  gridContainer.hidden = false;

  // Group filtered events by Day for clean visual display
  const daysMap = {
    'day-1': { label: 'Day 1', title: 'Opening Day', events: [] },
    'day-2': { label: 'Day 2', title: 'Creativity & Learning', events: [] },
    'day-3': { label: 'Day 3', title: 'Grand Finale', events: [] }
  };

  filteredEvents.forEach((evt) => {
    if (daysMap[evt.day]) {
      daysMap[evt.day].events.push(evt);
    }
  });

  let html = '';
  Object.keys(daysMap).forEach((dayKey) => {
    const dayGroup = daysMap[dayKey];
    if (dayGroup.events.length > 0) {
      html += `
        <section class="schedule-day-card" data-day="${dayKey}">
          <h2><span class="day-pill">${dayGroup.label}</span> ${dayGroup.title}</h2>
          <div class="events-list">
            ${dayGroup.events.map((evt) => renderScheduleEventCard(evt, bookmarkedIds)).join('')}
          </div>
        </section>
      `;
    }
  });

  gridContainer.innerHTML = html;

  // Attach event listeners to Bookmark buttons
  gridContainer.querySelectorAll('.bookmark-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const eventId = e.currentTarget.dataset.id;
      toggleBookmark(eventId);
    });
  });
}

function renderScheduleEventCard(evt, bookmarkedIds) {
  const isBookmarked = bookmarkedIds.includes(evt.id);
  return `
    <article class="schedule-event" data-id="${evt.id}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
        <div>
          <p class="schedule-time">⏰ ${escapeHtml(evt.time)}</p>
          <h3>${escapeHtml(evt.title)}</h3>
        </div>
        <button type="button" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${evt.id}" aria-label="Bookmark session">
          ${isBookmarked ? '★ Bookmarked' : '⭐ Bookmark'}
        </button>
      </div>
      <p class="schedule-meta">
        <span class="venue-badge">📍 ${escapeHtml(evt.venue)}</span>
        <span class="badge-pill">👤 ${escapeHtml(evt.speaker)}</span>
      </p>
      <p>${escapeHtml(evt.description)}</p>
    </article>
  `;
}

/* ==========================================================================
   Countdown & Speakers Utilities
   ========================================================================== */

function initCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  const targetStr = container.dataset.targetDate || '2026-10-15T09:00:00';
  const targetTime = new Date(targetStr).getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  const update = () => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      container.innerHTML = '<p class="form-message success">🎉 Fest is Live Now!</p>';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  };

  update();
  setInterval(update, 1000);
}

function initSpeakersExperience() {
  const searchInput = document.getElementById('speakerSearch');
  const cards = document.querySelectorAll('.speaker-card');

  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach((card) => {
      const text = (card.dataset.search || card.textContent).toLowerCase();
      card.classList.toggle('is-hidden', !text.includes(q));
    });
  });
}

function initReveal() {
  const elements = document.querySelectorAll('main > section, main article, .feature-card, .speaker-card, .schedule-event');
  elements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
