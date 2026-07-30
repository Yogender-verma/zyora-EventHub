document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();

  if (document.body.dataset.page === 'schedule') {
    initScheduleExperience();
  }
});

function setActiveNav() {
  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isActive = href === `${currentPage}.html` || (currentPage === 'home' && href === 'home.html');
    link.classList.toggle('active', isActive);
  });
}

function initScheduleExperience() {
  const searchInput = document.getElementById('event-search');
  const chips = Array.from(document.querySelectorAll('.filter-chip'));
  const cards = Array.from(document.querySelectorAll('.schedule-day-card'));
  const emptyState = document.getElementById('schedule-empty');

  if (!searchInput || !cards.length) {
    return;
  }

  let activeFilter = 'all';

  const applyFilter = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const dayMatch = activeFilter === 'all' || card.dataset.day === activeFilter;
      const textMatch = card.textContent.toLowerCase().includes(query);
      const isVisible = dayMatch && textMatch;
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) {
const THEME_KEY = 'eventhub-theme';
const FAVORITES_KEY = 'eventhub-favorites';

function getStoredFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function applyTheme(theme) {
  if (!document.body) {
    return;
  }

  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.dataset.theme = theme;
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme = savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferredTheme);
}

function initFavorites() {
  const favoriteItems = getStoredFavorites();
  const cards = document.querySelectorAll('.speaker-card');

  cards.forEach((card) => {
    const speakerName = card.querySelector('h3')?.textContent?.trim() || '';
    if (favoriteItems.includes(speakerName)) {
      card.classList.add('is-favorite');
      card.setAttribute('aria-pressed', 'true');
    }
  });
}

function initNavMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  if (!menuToggle || !nav) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

function setActiveNavLink() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname.split('/').pop() || 'home.html';
  const scrollPosition = window.scrollY + 140;

  let hasActiveHashLink = false;

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isHashLink = href.startsWith('#');

    link.classList.remove('active');
    link.removeAttribute('aria-current');

    if (isHashLink) {
      const target = document.querySelector(href);
      const section = target ? target.closest('main section') : null;
      const sectionTop = section ? section.offsetTop : target ? target.offsetTop : 0;
      const sectionBottom = section ? sectionTop + section.offsetHeight : target ? target.offsetTop + target.offsetHeight : 0;

      if (!hasActiveHashLink && scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        hasActiveHashLink = true;
      }
    } else {
      const linkPath = href.split('/').pop() || 'home.html';
      const isCurrentPage = linkPath === currentPath || (currentPath === 'home.html' && (linkPath === 'home.html' || linkPath === 'index.html'));

      if (isCurrentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
  });
}

function initCountdown() {
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) {
    return;
  }

  const targetDate = new Date(countdownContainer.dataset.targetDate).getTime();
  const valueElements = countdownContainer.querySelectorAll('.countdown-value');
  const countdownCard = countdownContainer.closest('.countdown-card');

  if (!countdownCard) {
    return;
  }

  const updateCountdown = () => {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdownCard.classList.add('finished');
      countdownCard.classList.remove('urgent');
      countdownContainer.innerHTML = '<p class="countdown-status">🎉 Event Started!</p>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const values = [days, hours, minutes, seconds].map((value) => String(value).padStart(2, '0'));

    valueElements.forEach((element, index) => {
      element.textContent = values[index];
    });

    countdownCard.classList.toggle('urgent', distance < 24 * 60 * 60 * 1000);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function initTabs() {
  const tabs = document.querySelectorAll('.schedule-tab');
  const panels = document.querySelectorAll('.schedule-panel');

  if (!tabs.length || !panels.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      tabs.forEach((button) => {
        const isActive = button === tab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        const isActivePanel = panel.id === `${targetId}-panel`;
        panel.classList.toggle('active', isActivePanel);
      });
    });
  });
}

function initSpeakerSearch() {
  const searchInput = document.getElementById('speakerSearch');
  const speakerCards = document.querySelectorAll('.speaker-card');
  const speakerList = document.getElementById('speakerList');

  if (!searchInput || !speakerCards.length || !speakerList) {
    return;
  }

  const showNoResults = () => {
    const existingMessage = speakerList.querySelector('.no-results');
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement('p');
    message.className = 'no-results';
    message.textContent = 'No results found';
    speakerList.appendChild(message);
  };

  const hideNoResults = () => {
    const existingMessage = speakerList.querySelector('.no-results');
    if (existingMessage) {
      existingMessage.remove();
    }
  };

  speakerCards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', card.classList.contains('is-favorite') ? 'true' : 'false');

    const toggleFavorite = () => {
      const speakerName = card.querySelector('h3')?.textContent?.trim() || '';
      const favorites = getStoredFavorites();
      const exists = favorites.includes(speakerName);
      const updatedFavorites = exists
        ? favorites.filter((item) => item !== speakerName)
        : [...favorites, speakerName];

      saveFavorites(updatedFavorites);
      card.classList.toggle('is-favorite', !exists);
      card.setAttribute('aria-pressed', String(!exists));
      card.classList.add('is-loading');
      window.setTimeout(() => card.classList.remove('is-loading'), 250);
    };

    card.addEventListener('click', toggleFavorite);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFavorite();
      }
    });
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    speakerCards.forEach((card) => {
      const searchableText = card.dataset.search.toLowerCase();
      const matches = searchableText.includes(query);
      card.classList.toggle('is-hidden', !matches);
      if (matches) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
      emptyState.textContent = query
        ? `No results found for "${searchInput.value.trim()}".`
        : 'No events match the selected day.';
    }
  };

  searchInput.addEventListener('input', applyFilter);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter || 'all';
      chips.forEach((item) => item.classList.toggle('active', item === chip));
      applyFilter();
    });
  });

  applyFilter();
}
    if (visibleCount === 0) {
      showNoResults();
    } else {
      hideNoResults();
    }
  });
}

function initReveal() {
  const elements = document.querySelectorAll('main > section, main article, .speaker-card, .countdown-card, .schedule-tab, form');

  elements.forEach((element) => {
    element.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
  });

  elements.forEach((element) => observer.observe(element));
}

function initApp() {
  initTheme();
  initFavorites();
  initNavMenu();
  initCountdown();
  initTabs();
  initSpeakerSearch();
  initReveal();
  setActiveNavLink();

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  window.addEventListener('resize', setActiveNavLink);

  if (document.documentElement.style.scrollBehavior !== 'smooth') {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
}

document.addEventListener('DOMContentLoaded', initApp);
