document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const themes = ['theme-hacker', 'theme-light', 'theme-dark'];
    let currentThemeIndex = 0;

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0; // Fallback
    }

    themeSwitcher.addEventListener('click', () => {
        // Cycle to the next theme
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const nextTheme = themes[currentThemeIndex];
        
        // Apply new theme and save to local storage
        body.className = nextTheme;
        localStorage.setItem('theme', nextTheme);
    });
}); 