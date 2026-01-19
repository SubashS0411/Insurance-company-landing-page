
// NexGen Global Logic
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLE LOGIC ---
    const themeToggleBtns = document.querySelectorAll('[id^="theme-toggle"]');
    const htmlEl = document.documentElement;

    // Check local storage or system pref
    if (localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });

    // --- 2. RTL TOGGLE LOGIC ---
    const rtlToggleBtns = document.querySelectorAll('[id^="rtl-toggle"]');

    // Function to apply direction and update UI
    function applyDirection(dir) {
        htmlEl.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);

        // Update Toggle Button UI (Visual Feedback for Active State)
        rtlToggleBtns.forEach(btn => {
            if (dir === 'rtl') {
                btn.classList.add('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
                btn.classList.remove('text-slate-600', 'dark:text-slate-400');
            } else {
                btn.classList.remove('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
                btn.classList.add('text-slate-600', 'dark:text-slate-400');
            }
        });
    }

    // Check saved preference or default to ltr
    const savedDir = localStorage.getItem('dir') || 'ltr';
    applyDirection(savedDir);

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = htmlEl.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            applyDirection(newDir);

            // Close mobile menu if open to reset transform (and prevent visual glitches)
            closeMobileMenu();
        });
    });

    // --- 3. MOBILE DRAWER LOGIC ---
    const menuBtns = document.querySelectorAll('[id^="mobile-menu-btn"]');
    const closeMenuBtns = document.querySelectorAll('[id^="close-menu-btn"]');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function openMobileMenu() {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.remove('mobile-drawer-closed');
        mobileDrawer.classList.add('mobile-drawer-open');
        mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }

    function closeMobileMenu() {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.remove('mobile-drawer-open');
        mobileDrawer.classList.add('mobile-drawer-closed');
        mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
    }

    menuBtns.forEach(btn => btn.addEventListener('click', openMobileMenu));
    closeMenuBtns.forEach(btn => btn.addEventListener('click', closeMobileMenu));

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Escape Key Close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // --- 4. SCROLL REVEAL (Simple) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 5. INITIALIZE LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
