(function () {
    const menu = document.getElementById('mobile-menu');
    const trigger = document.querySelector('button[onclick*="toggleMobileMenu"]');

    if (!menu || !trigger) return;

    function syncMobileMenuState() {
        const isOpen = menu.classList.contains('open');
        trigger.setAttribute('aria-controls', 'mobile-menu');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    syncMobileMenuState();

    trigger.addEventListener('click', function () {
        queueMicrotask(syncMobileMenuState);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape' || !menu.classList.contains('open')) return;
        window.toggleMobileMenu();
        syncMobileMenuState();
        trigger.focus();
    }, true);
}());
