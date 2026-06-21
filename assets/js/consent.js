(function () {
    'use strict';

    var STORAGE_KEY = 'owlnest_consent_v1';
    var CONSENT_GRANTED = 'granted';
    var CONSENT_DENIED = 'denied';

    function getSavedConsent() {
        try {
            var raw = window.localStorage && window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            return parsed && parsed.version === 1 ? parsed : null;
        } catch (error) {
            return null;
        }
    }

    function saveConsent(consent) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        } catch (error) {
            // Storage can be unavailable in private modes. Consent still updates in-memory.
        }
    }

    function ensureDataLayer() {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
    }

    function consentFromChoices(analyticsEnabled, marketingEnabled) {
        return {
            analytics_storage: analyticsEnabled ? CONSENT_GRANTED : CONSENT_DENIED,
            ad_storage: marketingEnabled ? CONSENT_GRANTED : CONSENT_DENIED,
            ad_user_data: marketingEnabled ? CONSENT_GRANTED : CONSENT_DENIED,
            ad_personalization: marketingEnabled ? CONSENT_GRANTED : CONSENT_DENIED,
            updated_at: new Date().toISOString(),
            version: 1
        };
    }

    function pushUpdate(consent, action) {
        ensureDataLayer();
        window.gtag('consent', 'update', {
            analytics_storage: consent.analytics_storage,
            ad_storage: consent.ad_storage,
            ad_user_data: consent.ad_user_data,
            ad_personalization: consent.ad_personalization
        });
        window.dataLayer.push({
            event: 'owlnest_consent_update',
            owlnest_consent_analytics: consent.analytics_storage,
            owlnest_consent_ads: consent.ad_storage,
            owlnest_consent_action: action
        });
    }

    function removeExistingUi() {
        document.getElementById('owlnest-cookie-banner')?.remove();
        document.getElementById('owlnest-cookie-panel')?.remove();
    }

    function closePanel() {
        var panel = document.getElementById('owlnest-cookie-panel');
        if (panel) panel.hidden = true;
    }

    function hideAll() {
        var banner = document.getElementById('owlnest-cookie-banner');
        if (banner) banner.hidden = true;
        closePanel();
    }

    function openPanel() {
        var panel = document.getElementById('owlnest-cookie-panel');
        if (!panel) return;
        var saved = getSavedConsent();
        var analyticsToggle = panel.querySelector('[data-consent-toggle="analytics"]');
        var marketingToggle = panel.querySelector('[data-consent-toggle="marketing"]');
        if (analyticsToggle) analyticsToggle.checked = saved ? saved.analytics_storage === CONSENT_GRANTED : false;
        if (marketingToggle) marketingToggle.checked = saved ? saved.ad_storage === CONSENT_GRANTED : false;
        panel.hidden = false;
        panel.querySelector('[data-consent-close]')?.focus();
    }

    function applyConsent(consent, action) {
        saveConsent(consent);
        pushUpdate(consent, action);
        hideAll();
    }

    function acceptAll() {
        applyConsent(consentFromChoices(true, true), 'accept_all');
    }

    function rejectNonEssential() {
        applyConsent(consentFromChoices(false, false), 'reject_non_essential');
    }

    function savePreferences() {
        var panel = document.getElementById('owlnest-cookie-panel');
        if (!panel) return;
        var analyticsEnabled = Boolean(panel.querySelector('[data-consent-toggle="analytics"]')?.checked);
        var marketingEnabled = Boolean(panel.querySelector('[data-consent-toggle="marketing"]')?.checked);
        applyConsent(consentFromChoices(analyticsEnabled, marketingEnabled), 'save_preferences');
    }

    function createUi() {
        removeExistingUi();
        var isZhTw = document.documentElement.lang && document.documentElement.lang.toLowerCase().indexOf('zh') === 0;
        var labels = isZhTw ? {
            bannerLabel: 'Cookie 同意設定',
            privacyTitle: '你的隱私選擇',
            privacyCopy: '我們使用 Cookie 了解網站成效並改善廣告體驗。必要 Cookie 會保持啟用。你可以全部接受、拒絕非必要 Cookie，或管理偏好設定。',
            acceptAll: '全部接受',
            rejectNonEssential: '拒絕非必要 Cookie',
            manageSettings: '管理設定',
            preferencesLabel: 'Cookie 設定',
            preferencesTitle: 'Cookie 設定',
            preferencesCopy: '選擇 Owlnest 在本站使用非必要 Cookie 的方式。',
            closePreferences: '關閉 Cookie 設定',
            essentialTitle: '必要 Cookie',
            essentialCopy: '必要 Cookie 會保持啟用，以確保網站正常運作。',
            alwaysOn: '一律啟用',
            analyticsTitle: '分析 Cookie',
            analyticsCopy: '幫助我們了解訪客如何使用網站，以改善整體體驗。',
            marketingTitle: '行銷 Cookie',
            marketingCopy: '幫助我們衡量並改善廣告成效。',
            savePreferences: '儲存設定'
        } : {
            bannerLabel: 'Cookie consent',
            privacyTitle: 'Your privacy choices',
            privacyCopy: 'We use cookies to understand site performance and improve advertising. Essential cookies are always on. You can accept all cookies, reject non-essential cookies, or manage your preferences.',
            acceptAll: 'Accept all',
            rejectNonEssential: 'Reject non-essential',
            manageSettings: 'Manage settings',
            preferencesLabel: 'Cookie preferences',
            preferencesTitle: 'Cookie preferences',
            preferencesCopy: 'Choose how Owlnest may use non-essential cookies on this site.',
            closePreferences: 'Close cookie preferences',
            essentialTitle: 'Essential cookies',
            essentialCopy: 'Essential cookies are always on because they help the website function properly.',
            alwaysOn: 'Always on',
            analyticsTitle: 'Analytics cookies',
            analyticsCopy: 'Help us understand how visitors use the site so we can improve the experience.',
            marketingTitle: 'Marketing cookies',
            marketingCopy: 'Help us measure and improve advertising performance.',
            savePreferences: 'Save preferences'
        };

        var banner = document.createElement('section');
        banner.id = 'owlnest-cookie-banner';
        banner.className = 'owlnest-cookie-banner';
        banner.setAttribute('aria-label', labels.bannerLabel);
        banner.hidden = Boolean(getSavedConsent());
        banner.innerHTML = [
            '<div class="owlnest-cookie-banner__inner">',
            '<div>',
            '<h2 class="owlnest-cookie-banner__title">' + labels.privacyTitle + '</h2>',
            '<p class="owlnest-cookie-banner__copy">' + labels.privacyCopy + '</p>',
            '</div>',
            '<div class="owlnest-cookie-actions">',
            '<button type="button" class="owlnest-cookie-button owlnest-cookie-button--primary" data-consent-action="accept_all">' + labels.acceptAll + '</button>',
            '<button type="button" class="owlnest-cookie-button" data-consent-action="reject_non_essential">' + labels.rejectNonEssential + '</button>',
            '<button type="button" class="owlnest-cookie-button" data-consent-action="manage_settings">' + labels.manageSettings + '</button>',
            '</div>',
            '</div>'
        ].join('');

        var panel = document.createElement('section');
        panel.id = 'owlnest-cookie-panel';
        panel.className = 'owlnest-cookie-panel';
        panel.hidden = true;
        panel.setAttribute('aria-label', labels.preferencesLabel);
        panel.innerHTML = [
            '<div class="owlnest-cookie-panel__dialog" role="dialog" aria-modal="true" aria-labelledby="owlnest-cookie-title">',
            '<div class="owlnest-cookie-panel__header">',
            '<div>',
            '<h2 id="owlnest-cookie-title" class="owlnest-cookie-panel__title">' + labels.preferencesTitle + '</h2>',
            '<p class="owlnest-cookie-panel__copy">' + labels.preferencesCopy + '</p>',
            '</div>',
            '<button type="button" class="owlnest-cookie-close" aria-label="' + labels.closePreferences + '" data-consent-close>&times;</button>',
            '</div>',
            '<div class="owlnest-cookie-panel__body">',
            '<div class="owlnest-cookie-choice">',
            '<div><h3>' + labels.essentialTitle + '</h3><p class="owlnest-cookie-panel__copy">' + labels.essentialCopy + '</p></div>',
            '<span class="owlnest-cookie-panel__copy">' + labels.alwaysOn + '</span>',
            '</div>',
            '<div class="owlnest-cookie-choice">',
            '<div><h3>' + labels.analyticsTitle + '</h3><p class="owlnest-cookie-panel__copy">' + labels.analyticsCopy + '</p></div>',
            '<label class="owlnest-cookie-toggle"><input type="checkbox" data-consent-toggle="analytics"><span class="owlnest-cookie-slider"></span></label>',
            '</div>',
            '<div class="owlnest-cookie-choice">',
            '<div><h3>' + labels.marketingTitle + '</h3><p class="owlnest-cookie-panel__copy">' + labels.marketingCopy + '</p></div>',
            '<label class="owlnest-cookie-toggle"><input type="checkbox" data-consent-toggle="marketing"><span class="owlnest-cookie-slider"></span></label>',
            '</div>',
            '</div>',
            '<div class="owlnest-cookie-panel__footer">',
            '<button type="button" class="owlnest-cookie-button owlnest-cookie-button--primary" data-consent-action="save_preferences">' + labels.savePreferences + '</button>',
            '<button type="button" class="owlnest-cookie-button" data-consent-action="accept_all">' + labels.acceptAll + '</button>',
            '<button type="button" class="owlnest-cookie-button" data-consent-action="reject_non_essential">' + labels.rejectNonEssential + '</button>',
            '</div>',
            '</div>'
        ].join('');

        document.body.appendChild(banner);
        document.body.appendChild(panel);
    }

    document.addEventListener('click', function (event) {
        var actionButton = event.target.closest('[data-consent-action]');
        if (actionButton) {
            var action = actionButton.getAttribute('data-consent-action');
            if (action === 'accept_all') acceptAll();
            if (action === 'reject_non_essential') rejectNonEssential();
            if (action === 'manage_settings') openPanel();
            if (action === 'save_preferences') savePreferences();
            return;
        }

        if (event.target.closest('[data-cookie-settings]')) {
            event.preventDefault();
            openPanel();
            return;
        }

        if (event.target.closest('[data-consent-close]')) {
            closePanel();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closePanel();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUi);
    } else {
        createUi();
    }
})();
