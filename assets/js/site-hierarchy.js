/* Native disclosure menus: no dependency on commerce or application state. */
(function () {
    const menus = Array.from(document.querySelectorAll('.ia-dropdown'));
    menus.forEach(function (menu) {
        menu.addEventListener('toggle', function () {
            if (!menu.open) return;
            menus.forEach(function (other) { if (other !== menu) other.open = false; });
        });
    });
    document.addEventListener('click', function (event) {
        menus.forEach(function (menu) { if (!menu.contains(event.target)) menu.open = false; });
    });
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        menus.forEach(function (menu) {
            if (!menu.open) return;
            menu.open = false;
            if (!menu.closest('#mobile-menu')) menu.querySelector('summary').focus();
        });
    });
    const mobile = document.getElementById('mobile-menu');
    if (mobile) mobile.querySelectorAll('.ia-primary-list a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (mobile.classList.contains('open') && typeof window.toggleMobileMenu === 'function') {
                window.toggleMobileMenu();
                mobile.setAttribute('aria-hidden', 'true');
                const trigger = document.querySelector('button[onclick*="toggleMobileMenu"]');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}());
