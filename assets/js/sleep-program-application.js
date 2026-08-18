(function () {
    'use strict';

    // TODO: Replace with final 21-Day Sleep Program Google Form URL.
    const SLEEP_PROGRAM_APPLICATION_URL = '';

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
