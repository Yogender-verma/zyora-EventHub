// EventHub - Speakers Module with Fail-Safe Progressive Enhancement
document.addEventListener("DOMContentLoaded", () => {
    initSpeakersModule();
});

const FAVORITES_KEY = "eventhub-favorites";

function getStoredFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getInitialsAvatar(name) {
    const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
            <linearGradient id="grad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3B82F6" />
                <stop offset="100%" stop-color="#8B5CF6" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad-${initials})" />
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="36" font-weight="700">${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DEFAULT_SPEAKERS = [
    {
        "id": "speaker-1",
        "name": "Sindhu J",
        "role": "Founder, WellNest",
        "session": "From Idea to Impact – Building a Student Startup",
        "topic": "Startup & Innovation",
        "image": "assets/images/Sindhu.jpeg",
        "bio": "Passionate student entrepreneur driving campus innovation and youth wellness platforms."
    },
    {
        "id": "speaker-2",
        "name": "Athira",
        "role": "Co-Founder, WellNest",
        "session": "Turning Student Challenges into Real Solutions",
        "topic": "Product Strategy",
        "image": "assets/images/Athira.jpeg",
        "bio": "Tech strategist specializing in user-centric solutions and campus community empowerment."
    },
    {
        "id": "speaker-3",
        "name": "Vismaya S M",
        "role": "Chief Executive Officer (CEO), WellNest",
        "session": "Leading Innovation with Purpose",
        "topic": "Leadership",
        "image": "assets/images/Vismaya.jpeg",
        "bio": "Visionary executive bridging technology, student leadership, and high-impact design."
    },
    {
        "id": "speaker-4",
        "name": "Shivani A",
        "role": "Chief Technology Officer (CTO), WellNest",
        "session": "Building AI Solutions for Student Mental Well-being",
        "topic": "AI & Engineering",
        "image": "assets/images/Shivani.jpeg",
        "bio": "AI engineer & researcher crafting intelligent web interfaces and wellness algorithms."
    }
];

async function initSpeakersModule() {
    const speakerList = document.getElementById("speakerList");
    const searchInput = document.getElementById("speakerSearch");
    const filterChips = document.querySelectorAll(".speaker-topic-chip");

    if (!speakerList) return;

    // Attach favorites & event listeners to existing cards
    function bindExistingCards() {
        const favorites = getStoredFavorites();
        const cards = speakerList.querySelectorAll(".speaker-card");

        cards.forEach(card => {
            const nameEl = card.querySelector(".speaker-name");
            if (!nameEl) return;
            const name = nameEl.textContent.trim();
            const isFav = favorites.includes(name);

            if (isFav) card.classList.add("is-favorite");

            const favBtn = card.querySelector(".favorite-toggle-btn");
            if (favBtn) {
                if (isFav) {
                    favBtn.classList.add("active");
                    favBtn.textContent = "★";
                }
                favBtn.replaceWith(favBtn.cloneNode(true));
                const newBtn = card.querySelector(".favorite-toggle-btn");
                newBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    toggleFavorite(name, card, newBtn);
                });
            }
        });
    }

    function toggleFavorite(name, card, btn) {
        let favorites = getStoredFavorites();
        if (favorites.includes(name)) {
            favorites = favorites.filter(item => item !== name);
            card.classList.remove("is-favorite");
            btn.classList.remove("active");
            btn.textContent = "☆";
        } else {
            favorites.push(name);
            card.classList.add("is-favorite");
            btn.classList.add("active");
            btn.textContent = "★";
        }
        saveFavorites(favorites);
    }

    function attachSearchAndFilterListeners() {
        let activeTopic = "all";

        function filterCards() {
            const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
            const cards = speakerList.querySelectorAll(".speaker-card");
            let visibleCount = 0;

            cards.forEach(card => {
                const searchText = (card.dataset.search || card.textContent || "").toLowerCase();
                const cardTopic = (card.dataset.topic || "").toLowerCase();

                const matchesSearch = !query || searchText.includes(query);
                const matchesTopic = activeTopic === "all" || 
                                     cardTopic.includes(activeTopic.toLowerCase()) || 
                                     (activeTopic === "favorites" && card.classList.contains("is-favorite"));

                if (matchesSearch && matchesTopic) {
                    card.classList.remove("is-hidden");
                    visibleCount++;
                } else {
                    card.classList.add("is-hidden");
                }
            });

            let noResultsMsg = speakerList.querySelector(".no-results-card");
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement("div");
                    noResultsMsg.className = "no-results-card";
                    noResultsMsg.innerHTML = `
                        <div class="no-results-icon">🔍</div>
                        <h3>No speakers match your criteria</h3>
                        <p>Try searching for a different keyword or select another topic filter.</p>
                    `;
                    speakerList.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", filterCards);
        }

        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                activeTopic = chip.dataset.filter || "all";
                filterCards();
            });
        });
    }

    bindExistingCards();
    attachSearchAndFilterListeners();
}