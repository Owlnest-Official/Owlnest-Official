/* Progressive header disclosures; no dependency on commerce or application state. */
(function () {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const hover = window.matchMedia('(hover: hover)');
    let keyboardInput = false;
    document.addEventListener('pointerdown', function () { keyboardInput = false; }, true);
    document.addEventListener('keydown', function () { keyboardInput = true; }, true);
    const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
    const groups = [
        {
            path: zh ? '/zh-tw/products/' : '/products',
            links: zh ? [['Lume', '/zh-tw/products/'], ['認識 Lume', '/zh-tw/what-is-owlnest-lume/'], ['使用說明', '/zh-tw/manual/']]
                : [['Lume', '/products'], ['What Is Lume', '/what-is-owlnest-lume/'], ['Manual', '/manual']]
        },
        {
            path: zh ? '/zh-tw/lab/' : '/lab/',
            links: zh ? [['Sleep Lab', '/zh-tw/lab/'], ['科學', '/zh-tw/science/'], ['研究依據', '/zh-tw/evidence/']]
                : [['Sleep Lab', '/lab/'], ['Science', '/science'], ['Evidence', '/evidence/']]
        }
    ];
    const menus = [];
    const normalize = function (path) { return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, ''); };
    document.querySelectorAll('#main-header .ia-primary-list, #mobile-menu .ia-primary-list').forEach(function (list, listIndex) {
        groups.forEach(function (group, groupIndex) {
            const link = Array.from(list.querySelectorAll(':scope > li > a')).find(function (a) {
                return normalize(a.pathname) === normalize(group.path);
            });
            if (!link) return;
            const item = link.parentElement;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ia-nav-trigger';
            button.setAttribute('aria-label', zh ? '展開' + link.textContent.trim() + '子選單' : 'Toggle ' + link.textContent.trim() + ' submenu');
            button.setAttribute('aria-expanded', 'false');
            const panel = document.createElement('ul');
            panel.id = 'header-submenu-' + listIndex + '-' + groupIndex;
            panel.className = 'ia-nav-submenu';
            panel.hidden = true;
            button.setAttribute('aria-controls', panel.id);
            group.links.forEach(function (entry) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = entry[0];
                a.href = entry[1];
                if (normalize(location.pathname) === normalize(entry[1])) {
                    a.setAttribute('aria-current', 'page');
                    button.classList.add('is-current-section');
                }
                li.appendChild(a);
                panel.appendChild(li);
            });
            item.classList.add('ia-nav-group');
            const row = document.createElement('div');
            row.className = 'ia-nav-row';
            link.replaceWith(row);
            row.appendChild(link);
            row.appendChild(button);
            item.appendChild(panel);
            const menu = { item: item, button: button, panel: panel };
            menus.push(menu);
            button.addEventListener('click', function () { setOpen(menu, panel.hidden); });
            item.addEventListener('pointerenter', function (event) {
                if (desktop.matches && hover.matches && event.pointerType === 'mouse') setOpen(menu, true);
            });
            item.addEventListener('pointerleave', function (event) {
                // Touch emits pointerleave at finger-up, before its synthetic click.
                if (desktop.matches && event.pointerType === 'mouse' && !(keyboardInput && item.contains(document.activeElement))) setOpen(menu, false);
            });
            // Touch focus must not open the panel before the same tap toggles it.
            item.addEventListener('focusin', function (event) {
                if (desktop.matches && keyboardInput && event.target === link) setOpen(menu, true);
            });
            row.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                setOpen(menu, true);
                panel.querySelector('a').focus();
            });
            item.addEventListener('focusout', function (event) {
                if (desktop.matches && !item.contains(event.relatedTarget)) setOpen(menu, false);
            });
        });
    });

    function setOpen(menu, open) {
        if (open && desktop.matches) menus.forEach(function (other) { if (other !== menu) setOpen(other, false); });
        menu.button.setAttribute('aria-expanded', String(open));
        menu.panel.hidden = !open;
    }

    document.addEventListener('click', function (event) {
        menus.forEach(function (menu) { if (!menu.item.contains(event.target)) setOpen(menu, false); });
    });
    // Handle a submenu before existing page-level Escape handlers close the mobile drawer.
    window.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        const openMenus = menus.filter(function (menu) { return !menu.panel.hidden; });
        if (!openMenus.length) return;
        const focused = openMenus.find(function (menu) { return menu.item.contains(document.activeElement); });
        if (focused) focused.button.focus();
        openMenus.forEach(function (menu) { setOpen(menu, false); });
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
    desktop.addEventListener('change', function () {
        menus.forEach(function (menu) { setOpen(menu, false); });
        if (desktop.matches) closeMobileMenu();
    });
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            menus.forEach(function (menu) { setOpen(menu, false); });
            closeMobileMenu();
        }
    });
    function closeMobileMenu() {
        const drawer = document.getElementById('mobile-menu');
        if (!drawer || !drawer.classList.contains('open') || typeof window.toggleMobileMenu !== 'function') return;
        window.toggleMobileMenu();
        drawer.setAttribute('aria-hidden', 'true');
        const trigger = document.querySelector('button[onclick*="toggleMobileMenu"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
    document.querySelectorAll('button[onclick*="toggleMobileMenu"]').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            menus.forEach(function (menu) { setOpen(menu, false); });
        });
    });
    const mobile = document.getElementById('mobile-menu');
    // Keep the existing Account destination reachable in compact legacy headers.
    const account = document.querySelector('#main-header a[href="/account/"]');
    if (mobile && account && !mobile.querySelector('a[href="/account/"]')) {
        const mobileAccount = account.cloneNode(true);
        mobileAccount.removeAttribute('id');
        mobileAccount.className = 'ia-mobile-account';
        mobile.querySelector('nav').appendChild(mobileAccount);
    }
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
