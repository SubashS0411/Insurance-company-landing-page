// RTL Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const rtlToggleBtns = document.querySelectorAll('[id^="rtl-toggle"]');
    const htmlSelect = document.documentElement;

    // Check saved preference
    const currentDir = localStorage.getItem('dir') || 'ltr';
    applyDir(currentDir);

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newDir = htmlSelect.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
            applyDir(newDir);
        });
    });

    function applyDir(dir) {
        htmlSelect.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);

        // Update button style state
        rtlToggleBtns.forEach(btn => {
            if (dir === 'rtl') {
                btn.classList.add('bg-indigo-100', 'dark:bg-indigo-900', 'text-primary');
            } else {
                btn.classList.remove('bg-indigo-100', 'dark:bg-indigo-900', 'text-primary');
            }
        });
    }
});
