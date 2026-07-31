document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

const THEME_KEY = "eventhub-theme";
const FAVORITES_KEY = "eventhub-favorites";

function initApp() {
    initTheme();
    initNavMenu();
    initCountdown();
    initTabs();
    initSpeakerSearch();
    initReveal();
    setActiveNav();

    window.addEventListener("scroll", setActiveNav);
    window.addEventListener("resize", setActiveNav);
}

function setActiveNav() {
    const current = window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === current) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }

    });
}

function initNavMenu() {

    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (!menu || !nav) return;

    menu.addEventListener("click", () => {

        nav.classList.toggle("open");

        menu.setAttribute(
            "aria-expanded",
            nav.classList.contains("open")
        );

    });

    document.addEventListener("click", (e) => {

        if (
            !nav.contains(e.target) &&
            !menu.contains(e.target)
        ) {
            nav.classList.remove("open");
            menu.setAttribute("aria-expanded", "false");
        }

    });

}

function applyTheme(theme) {

    document.body.classList.toggle(
        "dark-theme",
        theme === "dark"
    );

    localStorage.setItem(THEME_KEY, theme);

}

function initTheme() {

    const saved = localStorage.getItem(THEME_KEY);

    if (saved) {

        applyTheme(saved);

    }

}

function initCountdown() {

    const countdown = document.getElementById("countdown");

    if (!countdown) return;

    const target = new Date(
        countdown.dataset.targetDate
    ).getTime();

    const values =
        countdown.querySelectorAll(".countdown-value");

    function update() {

        const now = new Date().getTime();

        let diff = target - now;

        if (diff <= 0) {

            countdown.innerHTML =
                "<h3>🎉 Event Started!</h3>";

            return;

        }

        const days = Math.floor(diff / 86400000);
        diff %= 86400000;

        const hours = Math.floor(diff / 3600000);
        diff %= 3600000;

        const minutes = Math.floor(diff / 60000);
        diff %= 60000;

        const seconds = Math.floor(diff / 1000);

        const arr = [
            days,
            hours,
            minutes,
            seconds
        ];

        values.forEach((item, index) => {

            item.textContent =
                String(arr[index]).padStart(2, "0");

        });

    }

    update();

    setInterval(update, 1000);

}

function initTabs() {

    const tabs =
        document.querySelectorAll(".schedule-tab");

    const panels =
        document.querySelectorAll(".schedule-panel");

    if (!tabs.length) return;

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(btn => {

                btn.classList.remove("active");

                btn.setAttribute(
                    "aria-selected",
                    "false"
                );

            });

            panels.forEach(panel => {

                panel.classList.remove("active");

            });

            tab.classList.add("active");

            tab.setAttribute(
                "aria-selected",
                "true"
            );

            const panel = document.getElementById(
                `${tab.dataset.target}-panel`
            );

            if (panel) {

                panel.classList.add("active");

            }

        });

    });

}
function getStoredFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        ) || [];

    } catch {

        return [];

    }

}

function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}

function initSpeakerSearch() {

    const searchInput =
        document.getElementById("speakerSearch");

    const speakerList =
        document.getElementById("speakerList");

    if (!searchInput || !speakerList) return;

    function refreshCards() {

        return speakerList.querySelectorAll(".speaker-card");

    }

    function showNoResults() {

        if (
            speakerList.querySelector(".no-results")
        ) return;

        const p = document.createElement("p");

        p.className = "no-results";

        p.textContent = "No speakers found.";

        speakerList.appendChild(p);

    }

    function hideNoResults() {

        const msg =
            speakerList.querySelector(".no-results");

        if (msg) msg.remove();

    }

    searchInput.addEventListener("input", () => {

        const cards = refreshCards();

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        let visible = 0;

        cards.forEach(card => {

            const text =
                (card.dataset.search || "")
                .toLowerCase();

            const match =
                text.includes(query);

            card.classList.toggle(
                "is-hidden",
                !match
            );

            if (match) visible++;

        });

        if (visible === 0) {

            showNoResults();

        } else {

            hideNoResults();

        }

    });

    const favorites =
        getStoredFavorites();

    refreshCards().forEach(card => {

        const name =
            card.querySelector("h3")
                ?.textContent
                .trim();

        if (
            favorites.includes(name)
        ) {

            card.classList.add(
                "is-favorite"
            );

        }

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.addEventListener(
            "click",
            () => {

                toggleFavorite(card);

            }
        );

        card.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Enter" ||
                    e.key === " "
                ) {

                    e.preventDefault();

                    toggleFavorite(card);

                }

            }
        );

    });

}

function toggleFavorite(card) {

    const name =
        card.querySelector("h3")
            ?.textContent
            .trim();

    let favorites =
        getStoredFavorites();

    if (
        favorites.includes(name)
    ) {

        favorites =
            favorites.filter(
                item => item !== name
            );

        card.classList.remove(
            "is-favorite"
        );

    } else {

        favorites.push(name);

        card.classList.add(
            "is-favorite"
        );

    }

    saveFavorites(favorites);

}

function initReveal() {

    const elements =
        document.querySelectorAll(
            "main > section, article, .speaker-card, form"
        );

    if (
        !("IntersectionObserver" in window)
    ) return;

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    elements.forEach(el => {

        el.classList.add("reveal");

        observer.observe(el);

    });

}
function initRegisterValidation() {

    const forms =
        document.querySelectorAll(".validate-form");

    if (!forms.length) return;

    forms.forEach(form => {

        form.addEventListener("submit", e => {

            const required =
                form.querySelectorAll(
                    "[required]"
                );

            let valid = true;

            required.forEach(field => {

                if (
                    field.value.trim() === ""
                ) {

                    valid = false;

                    field.classList.add(
                        "input-error"
                    );

                } else {

                    field.classList.remove(
                        "input-error"
                    );

                }

            });

            if (!valid) {

                e.preventDefault();

                alert(
                    "Please fill all required fields."
                );

            }

        });

    });

}

window.addEventListener("scroll", () => {

    setActiveNav();

});

window.addEventListener("resize", () => {

    setActiveNav();

});

/* ---------- Page Initializers ---------- */

if (
    document.body.dataset.page ===
    "schedule"
) {

    initTabs();

}

if (
    document.body.dataset.page ===
    "speakers"
) {

    initSpeakerSearch();

}

if (
    document.body.dataset.page ===
    "register"
) {

    initRegisterValidation();

}

/* ---------- Smooth Scroll ---------- */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
        "click",
        function (e) {

            const target =
                document.querySelector(
                    this.getAttribute("href")
                );

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }
    );

});

/* ---------- Reveal fallback ---------- */

document
.querySelectorAll(".reveal")
.forEach(el => {

    if (
        !el.classList.contains(
            "is-visible"
        )
    ) {

        el.classList.add(
            "is-visible"
        );

    }

});

console.log(
    "✅ EventHub Script Loaded Successfully"
);