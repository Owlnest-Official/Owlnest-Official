(function () {
    'use strict';

    // Shared application destination for both Program language versions.
    const SLEEP_PROGRAM_APPLICATION_URL = 'https://forms.gle/FqWYNM7kR3hXXZdeA';

    window.OWLNEST_SLEEP_PROGRAM = Object.freeze({
        SLEEP_PROGRAM_APPLICATION_URL
    });

    const applyLinks = document.querySelectorAll('[data-sleep-program-apply]');

    applyLinks.forEach((link) => {
        if (SLEEP_PROGRAM_APPLICATION_URL) {
            link.href = SLEEP_PROGRAM_APPLICATION_URL;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.dataset.applicationStatus = 'open';
            return;
        }

        link.href = '#application-status';
        link.removeAttribute('target');
        link.removeAttribute('rel');
        link.dataset.applicationStatus = 'opening-soon';
    });
})();
