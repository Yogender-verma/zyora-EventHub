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
