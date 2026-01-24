// NexGen Global Logic
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLE LOGIC ---
    const themeToggleBtns = document.querySelectorAll('[id^="theme-toggle"]');
    const htmlEl = document.documentElement;

    // Check local storage or system pref
    if (localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
        htmlEl.style.backgroundColor = 'black'; // Set initial dark mode background
    } else {
        htmlEl.classList.remove('dark');
        htmlEl.style.backgroundColor = ''; // Reset background color
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            htmlEl.style.backgroundColor = isDark ? 'black' : ''; // Toggle background color
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
            // Disable transitions globally
            const style = document.createElement('style');
            style.innerHTML = '*, *::before, *::after { transition: none !important; animation: none !important; }';
            document.head.appendChild(style);

            const currentDir = htmlEl.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            applyDirection(newDir);

            // Close mobile menu if open to reset transform (and prevent visual glitches)
            closeMobileMenu();

            // Re-enable transitions after a short delay (enough for layout repaint)
            setTimeout(() => {
                document.head.removeChild(style);
            }, 50);
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

    // --- 6. COUNTING ANIMATION (Global) ---
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length > 0) {
        const duration = 2000; // 2 seconds
        const animateCounters = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    // Support removing non-digits for parsing
                    const rawTarget = counter.getAttribute('data-target');
                    const target = parseFloat(rawTarget);
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - (1 - progress) * (1 - progress); // Ease out

                        const currentCount = Math.floor(easeProgress * target);

                        const suffix = counter.getAttribute('data-suffix') || '';
                        const prefix = counter.getAttribute('data-prefix') || '';

                        counter.innerText = prefix + currentCount + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = prefix + target + suffix;
                        }
                    };
                    requestAnimationFrame(updateCount);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => animateCounters.observe(c));
    }

    // --- 7. INTERACTIVE MAP (Index Only) ---
    const mapContainer = document.getElementById('map-container');
    const mapTooltip = document.getElementById('map-tooltip');

    if (mapContainer && mapTooltip) {
        mapContainer.addEventListener('click', (e) => {
            const rect = mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Show tooltip at click
            mapTooltip.style.left = `${x}px`;
            mapTooltip.style.top = `${y}px`;
            mapTooltip.classList.remove('opacity-0', 'scale-75'); // Show
            mapTooltip.classList.add('opacity-100', 'scale-100');

            // Simulate "Live" data
            const randomActive = Math.floor(Math.random() * 500) + 100;
            mapTooltip.querySelector('.tooltip-content').innerText = `Active Users: ${randomActive}`;

            // Hide after 2 seconds
            setTimeout(() => {
                mapTooltip.classList.add('opacity-0', 'scale-75');
                mapTooltip.classList.remove('opacity-100', 'scale-100');
            }, 2000);
        });
    }

    // --- 8. NAVBAR ACTIVE INDICATOR ---
    // --- 8. NAVBAR ACTIVE INDICATOR ---
    /* Indicator logic removed as per user request */

    // --- 9. MOBILE ACTIVE STATE ---
    const mobileDrawerLinks = document.querySelectorAll('#mobile-drawer a');
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    mobileDrawerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page ||
            (page === 'index.html' && href === 'index.html') ||
            (page === 'index2.html' && href === 'index2.html') ||
            (page === '' && href === 'index.html')) {
            // Add active class
            link.classList.add('text-indigo-600', 'dark:text-neon-cyan', 'font-bold');
            link.classList.remove('text-slate-800', 'dark:text-slate-200');
        }
        // Dashboard special case (mobile links are exact matches usually)
        if (page.includes('user_dashboard') && href === 'user_dashboard.html') link.classList.add('bg-indigo-50', 'dark:bg-indigo-900/30');
        if (page.includes('admin_dashboard') && href === 'admin_dashboard.html') link.classList.add('bg-indigo-50', 'dark:bg-indigo-900/30');
    });

});
