function initializeApp() {
    const bgOptions = document.querySelectorAll('.bg-option');
    bgOptions.forEach(option => {
        option.addEventListener('mouseover', () => {
            const menuSelect = document.getElementById('menu-select');
            if (menuSelect) {
                menuSelect.volume = 0.2;
                menuSelect.currentTime = 0;
                menuSelect.play();
            }
        });
    });

    const cardStyleOptions = document.querySelectorAll('.card-style-option');
    cardStyleOptions.forEach(option => {
        option.addEventListener('mouseover', () => {
            const menuSelect = document.getElementById('menu-select');
            if (menuSelect) {
                menuSelect.volume = 0.2;
                menuSelect.currentTime = 0;
                menuSelect.play();
            }
        });
    });

    window.addEventListener('DOMContentLoaded', () => {
        const storedCardStyle = localStorage.getItem('cardstyle');
        if (storedCardStyle) {
            updateCardStyle(storedCardStyle);
        }

        const storedBackground = localStorage.getItem('background');
        if (storedBackground) {
            updateBg(storedBackground);
        }
        loadCustomBgs();
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);

