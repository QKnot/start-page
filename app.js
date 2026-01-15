// DOM Elements
const elements = {
    clockTime: document.getElementById('clockTime'),
    clockDate: document.getElementById('clockDate'),
    searchInput: document.getElementById('searchInput'),
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
            if (cardTitle.includes(query) || hasMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialization
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    setupSearch();

    // Auto-focus search on load for maximum efficiency
    if (elements.searchInput) {
        elements.searchInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', init);