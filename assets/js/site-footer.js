(function () {
    'use strict';

    var mobileQuery = window.matchMedia('(max-width: 767px)');

    function setGroupState(trigger, expanded) {
        var icon = trigger.querySelector('.footer-accordion-icon');

        trigger.setAttribute('aria-expanded', String(expanded));
        if (icon) icon.textContent = expanded ? '\u2212' : '+';
    }

    function initializeFooter(footer) {
        var triggers = Array.prototype.slice.call(footer.querySelectorAll('.footer-accordion-trigger'));
        var wasMobile = null;
        if (!triggers.length) return;

        function syncLayout() {
            var isMobile = mobileQuery.matches;

            if (isMobile && wasMobile !== true) {
                triggers.forEach(function (trigger) { setGroupState(trigger, false); });
            }

            wasMobile = isMobile;
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                if (!mobileQuery.matches) return;
                setGroupState(trigger, trigger.getAttribute('aria-expanded') !== 'true');
            });
        });

        footer.classList.add('footer-accordion-ready');
        syncLayout();

        if (typeof mobileQuery.addEventListener === 'function') {
            mobileQuery.addEventListener('change', syncLayout);
        } else {
            mobileQuery.addListener(syncLayout);
        }
        window.addEventListener('resize', syncLayout, { passive: true });
    }

    function initialize() {
        document.querySelectorAll('.batch-b-footer').forEach(initializeFooter);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
}());
