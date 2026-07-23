// DOM Elements
const elements = {
    clockTime: document.getElementById('clockTime'),
    clockDate: document.getElementById('clockDate'),
    searchInput: document.getElementById('searchInput'),
    noResults: document.getElementById('noResults'),
    cards: document.querySelectorAll('.card')
};

// Simple Clock
function updateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    if (elements.clockTime) elements.clockTime.textContent = timeStr;
    if (elements.clockDate) elements.clockDate.textContent = dateStr;
}

// Global Search Functionality
function setupSearch() {
    if (!elements.searchInput) return;

    elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        let anyCardVisible = false;

        elements.cards.forEach(card => {
            const links = card.querySelectorAll('a');
            let hasMatch = false;

            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(query)) {
                    link.parentElement.style.display = 'block';
                    hasMatch = true;
                } else {
                    link.parentElement.style.display = 'none';
                }
            });

            const cardTitle = card.querySelector('h2').textContent.toLowerCase();
            const cardVisible = cardTitle.includes(query) || hasMatch;
            card.style.display = cardVisible ? 'block' : 'none';
            if (cardVisible) anyCardVisible = true;
        });

        if (elements.noResults) {
            elements.noResults.style.display = anyCardVisible ? 'none' : 'block';
        }
    });
}

// Open external links safely
function setupSafeLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.rel = 'noopener noreferrer';
    });
}

// Eased "buttery" smooth scroll (replaces native scroll-behavior, which is
// too abrupt/short to feel smooth). Trails the wheel input with a lerp.
function setupSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ease = 0.18; // lower = smoother & slower, higher = snappier
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let animating = false;

    function maxScroll() {
        return document.documentElement.scrollHeight - window.innerHeight;
    }

    function animate() {
        currentY += (targetY - currentY) * ease;

        if (Math.abs(targetY - currentY) < 0.5) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            animating = false;
            return;
        }

        window.scrollTo(0, currentY);
        requestAnimationFrame(animate);
    }

    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetY = Math.max(0, Math.min(targetY + e.deltaY, maxScroll()));

        if (!animating) {
            animating = true;
            requestAnimationFrame(animate);
        }
    }, { passive: false });

    // Keep in sync with non-wheel scrolling (keyboard, scrollbar drag, touch)
    window.addEventListener('scroll', () => {
        if (!animating) {
            currentY = window.scrollY;
            targetY = window.scrollY;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        targetY = Math.max(0, Math.min(targetY, maxScroll()));
    });
}

// Initialization
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    setupSearch();
    setupSafeLinks();
    setupSmoothScroll();

    // Auto-focus search on load for maximum efficiency
    if (elements.searchInput) {
        elements.searchInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', init);