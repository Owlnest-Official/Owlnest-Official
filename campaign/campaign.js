document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/campaign/campaign.json');
        if (!response.ok) throw new Error('Failed to load campaign data');

        const data = await response.json();
        renderPage(data);
    } catch (error) {
        console.error('Error loading campaign page:', error);
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center px-4 text-center bg-[#faefcf] text-[#455169]">
                <div>
                    <div class="text-2xl font-serif mb-3">Unable to load campaign data</div>
                    <p class="text-sm text-[#455169]/70">Please try again later.</p>
                </div>
            </div>
        `;
    }
});

function renderPage(data) {
    document.title = `${data.title} | Owlnest Campaign`;

    const liveSection = document.getElementById('live-content');
    const endedSection = document.getElementById('ended-content');

    const isPrelaunch = data.status === 'prelaunch';
    const isLive = data.status === 'live';
    const isEnded = data.status === 'ended';
    const showPreviewPricing = isPrelaunch && data.pricingPreviewEnabled === true;
    const canShowTierPrices = isLive || showPreviewPricing;

    if (isEnded || (data.active === false && !isPrelaunch && !isLive)) {
        liveSection.classList.add('hidden');
        endedSection.classList.remove('hidden');
        return;
    }

    renderHero(data, isPrelaunch, isLive);
    renderStats(data, isPrelaunch);
    renderTiers(data, isPrelaunch, canShowTierPrices);
    renderTimeline(data);
    renderFaq(data);
}

function renderHero(data, isPrelaunch, isLive) {
    setText('hero-title', data.title);
    setText('hero-subtitle', data.subtitle);
    setText('hero-desc', data.description);

    const badgeText = document.getElementById('hero-badge-text');
    const badgeDot = document.getElementById('hero-badge-dot');

    badgeDot.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-gray-400');

    if (isPrelaunch) {
        badgeText.textContent = 'Launching Soon';
        badgeDot.classList.add('bg-yellow-500');
    } else if (isLive) {
        badgeText.textContent = 'Live on Indiegogo';
        badgeDot.classList.add('bg-red-500');
    } else {
        badgeText.textContent = 'Campaign Update';
        badgeDot.classList.add('bg-gray-400');
    }

    const mainCta = document.getElementById('hero-cta-main');
    const secondaryCta = document.getElementById('hero-cta-sec');

    mainCta.textContent = data.platformCta?.label || 'Learn More';
    mainCta.href = data.platformCta?.href || '#';
    toggleLinkState(mainCta, !data.platformCta?.href || data.platformCta.href === '#');

    secondaryCta.textContent = data.secondaryCta?.label || 'Community Access';
    secondaryCta.href = data.secondaryCta?.href || '#discord-access';

    renderHeroNotice(data.notice);
    renderHeroPricing(data, isPrelaunch, isLive);
    renderHeroHighlights(data.heroHighlights);
}

function renderHeroNotice(notice) {
    const slot = document.getElementById('hero-notice-slot');
    if (!slot) return;

    if (!notice) {
        slot.innerHTML = '';
        return;
    }

    slot.innerHTML = `
        <p class="mt-6 text-xs text-[#D4AF37] italic border-l-2 border-[#D4AF37] pl-3 text-left">
            ${escapeHtml(notice)}
        </p>
    `;
}

function renderHeroPricing(data, isPrelaunch, isLive) {
    const eyebrowEl = document.getElementById('hero-price-eyebrow');
    const mainEl = document.getElementById('hero-price-main');
    const subtextEl = document.getElementById('hero-price-subtext');

    const prices = (data.tiers || [])
        .map(t => Number(t.price))
        .filter(n => Number.isFinite(n));

    const retailPrices = (data.tiers || [])
        .map(t => Number(t.retailPrice))
        .filter(n => Number.isFinite(n));

    const lowestPrice = prices.length ? Math.min(...prices) : null;
    const highestRetail = retailPrices.length ? Math.max(...retailPrices) : null;
    const maxDiscountPct = (lowestPrice !== null && highestRetail !== null && highestRetail > 0)
        ? Math.round(((highestRetail - lowestPrice) / highestRetail) * 100)
        : null;

    const heroPricing = data.heroPricing || {};

    const eyebrow = heroPricing.eyebrow
        || (isLive ? 'Live on Indiegogo' : isPrelaunch ? 'Launch Pricing Preview' : 'Campaign Pricing');

    const main = heroPricing.main
        || (lowestPrice !== null ? `From $${lowestPrice}` : isPrelaunch ? 'Pricing TBA' : '');

    const subtext = heroPricing.subtext
        || (
            lowestPrice !== null && highestRetail !== null && maxDiscountPct !== null
                ? `Up to ${maxDiscountPct}% off • Regular Price $${highestRetail}`
                : highestRetail !== null
                    ? `Regular Price $${highestRetail}`
                    : ''
        );

    eyebrowEl.textContent = eyebrow;
    mainEl.textContent = main;
    subtextEl.textContent = subtext;
}

function renderHeroHighlights(items) {
    const container = document.getElementById('hero-highlights');
    if (!container) return;

    if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="rounded-2xl border border-[#455169]/10 bg-white/55 p-4">
            <div class="text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-2">
                ${escapeHtml(item.title || '')}
            </div>
            <div class="text-sm text-[#455169]/80 leading-relaxed">
                ${escapeHtml(item.text || '')}
            </div>
        </div>
    `).join('');
}

function renderStats(data, isPrelaunch) {
    const goalEl = document.getElementById('stat-goal');
    const raisedEl = document.getElementById('stat-raised');
    const backersEl = document.getElementById('stat-backers');
    const daysEl = document.getElementById('stat-days');
    const daysLabelEl = document.getElementById('stat-days-label');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    if (isPrelaunch) {
        raisedEl.textContent = 'TBA';
        goalEl.textContent = 'TBA';
        backersEl.textContent = '-';
        daysEl.textContent = 'Soon';
        daysLabelEl.textContent = 'launch';
        progressContainer.classList.add('opacity-20');
        progressBar.style.width = '0%';
        return;
    }

    const raised = Number(data.stats?.raised);
    const goal = Number(data.stats?.goal);
    const backers = Number(data.stats?.backers);
    const daysLeft = data.stats?.daysLeft;

    raisedEl.textContent = Number.isFinite(raised) ? formatCurrency(raised) : 'TBA';
    goalEl.textContent = Number.isFinite(goal) ? formatCurrency(goal) : 'TBA';
    backersEl.textContent = Number.isFinite(backers) ? backers.toLocaleString() : '-';
    daysEl.textContent = daysLeft ?? '-';
    daysLabelEl.textContent = 'days left';
    progressContainer.classList.remove('opacity-20');

    if (Number.isFinite(raised) && Number.isFinite(goal) && goal > 0) {
        const progress = Math.min((raised / goal) * 100, 100);
        progressBar.style.width = `${progress}%`;
    } else {
        progressBar.style.width = '0%';
    }
}

function renderTiers(data, isPrelaunch, canShowTierPrices) {
    const container = document.getElementById('tiers-container');
    const titleEl = document.getElementById('tiers-title');

    titleEl.textContent = isPrelaunch ? 'Launch Pricing Preview' : 'Exclusive Rewards';

    if (!Array.isArray(data.tiers) || data.tiers.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center text-sm text-gray-500">
                Reward tiers will be announced soon.
            </div>
        `;
        return;
    }

    container.innerHTML = data.tiers.map((tier) => {
        const hasPrice = Number.isFinite(Number(tier.price));
        const hasRetail = Number.isFinite(Number(tier.retailPrice));
        const price = Number(tier.price);
        const retailPrice = Number(tier.retailPrice);

        const priceDisplay = canShowTierPrices && hasPrice ? `$${price}` : 'TBA';
        const retailDisplay = canShowTierPrices && hasRetail ? `Regular Price $${retailPrice}` : 'Regular Price TBA';

        const savingsAmount = hasPrice && hasRetail ? retailPrice - price : null;
        const savingsPct = savingsAmount && retailPrice > 0
            ? Math.round((savingsAmount / retailPrice) * 100)
            : null;

        const savingsHtml = canShowTierPrices && savingsAmount > 0
            ? `<div class="text-xs uppercase tracking-[0.18em] text-brand-dark/50 mb-5">Save $${savingsAmount} • ${savingsPct}% off</div>`
            : `<div class="h-5 mb-5"></div>`;

        const tierBadgeHtml = tier.badge
            ? `<div class="absolute top-5 right-5 inline-flex items-center px-3 py-1 rounded-full bg-[#D4AF37]/12 text-[#455169] text-[10px] font-bold tracking-[0.18em] uppercase border border-[#D4AF37]/25">${escapeHtml(tier.badge)}</div>`
            : '';

        const tierBullets = Array.isArray(tier.bullets)
            ? tier.bullets.map(b => `
                <li class="flex items-start text-sm text-gray-600 leading-relaxed">
                    <i class="fas fa-check text-[#D4AF37] mt-1 mr-3 flex-shrink-0"></i>
                    <span>${escapeHtml(b)}</span>
                </li>
            `).join('')
            : '';

        const isClickable = !!tier.ctaHref && tier.ctaHref !== '#';
        const buttonDisabled = !isClickable;
        const buttonClass = buttonDisabled
            ? 'bg-gray-300 text-white cursor-not-allowed'
            : 'bg-[#455169] text-[#faefcf] hover:bg-[#D4AF37] hover:text-[#455169]';

        return `
            <div class="relative w-full h-full rounded-3xl border border-[#455169]/10 bg-[#fff8ea] p-6 md:p-7 shadow-sm transition duration-300 hover:border-[#D4AF37]/35 hover:-translate-y-1 ${tier.featured ? 'ring-1 ring-[#D4AF37]/35' : ''}">
                ${tierBadgeHtml}
                <div class="pr-20">
                    <h3 class="text-xl md:text-2xl font-serif font-bold text-[#455169] mb-3">${escapeHtml(tier.name)}</h3>
                </div>

                <div class="flex flex-wrap items-end gap-2 mb-2">
                    <span class="text-3xl md:text-4xl font-serif font-bold text-[#D4AF37]">${priceDisplay}</span>
                    <span class="text-sm text-gray-400 line-through mb-1">${retailDisplay}</span>
                </div>

                ${savingsHtml}

                <ul class="space-y-3 mb-8 min-h-[120px]">
                    ${tierBullets}
                </ul>

                <a
                    href="${buttonDisabled ? '#' : tier.ctaHref}"
                    ${buttonDisabled ? 'aria-disabled="true"' : 'target="_blank" rel="noopener"'}
                    class="mt-auto block w-full py-3 text-center font-bold tracking-widest uppercase text-xs transition duration-300 rounded-sm ${buttonClass}"
                    ${buttonDisabled ? 'onclick="return false;"' : ''}
                >
                    ${escapeHtml(tier.ctaLabel || 'Learn More')}
                </a>
            </div>
        `;
    }).join('');
}

function renderTimeline(data) {
    const container = document.getElementById('timeline-container');

    if (!Array.isArray(data.timeline) || data.timeline.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">Timeline coming soon.</p>';
        return;
    }

    container.innerHTML = data.timeline.map((item) => `
        <div class="relative pl-8 pb-10 border-l border-[#D4AF37] last:border-0 last:pb-0">
            <div class="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
            <div class="text-xs font-bold text-[#D4AF37] mb-1 tracking-widest uppercase">${escapeHtml(item.date || '')}</div>
            <h4 class="text-lg font-bold text-[#455169] mb-1">${escapeHtml(item.title || '')}</h4>
            <p class="text-sm text-gray-500 leading-relaxed">${escapeHtml(item.text || '')}</p>
        </div>
    `).join('');
}

function renderFaq(data) {
    const container = document.getElementById('faq-container');

    if (!Array.isArray(data.faq) || data.faq.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">FAQ coming soon.</p>';
        return;
    }

    container.innerHTML = data.faq.map((item) => `
        <div class="border-b border-[#455169]/10">
            <button class="w-full py-5 flex items-start justify-between text-left group gap-4" onclick="toggleFaq(this)">
                <span class="font-bold text-[#455169] group-hover:text-[#D4AF37] transition text-sm md:text-base leading-snug pr-2">
                    ${escapeHtml(item.q || '')}
                </span>
                <i class="fas fa-plus text-[#D4AF37]/70 text-sm transition-transform duration-300 mt-1 flex-shrink-0"></i>
            </button>
            <div class="hidden pb-5 text-gray-600 text-sm leading-relaxed pr-4 pl-1">
                ${formatMultilineText(item.a || '')}
            </div>
        </div>
    `).join('');
}

function toggleLinkState(linkEl, disabled) {
    if (!linkEl) return;

    if (disabled) {
        linkEl.classList.add('opacity-60', 'cursor-not-allowed');
        linkEl.style.pointerEvents = 'none';
        linkEl.removeAttribute('target');
        linkEl.removeAttribute('rel');
    } else {
        linkEl.classList.remove('opacity-60', 'cursor-not-allowed');
        linkEl.style.pointerEvents = '';
        linkEl.setAttribute('target', '_blank');
        linkEl.setAttribute('rel', 'noopener');
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? '';
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(num);
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

function formatMultilineText(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
}

window.toggleFaq = function (button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');

    content.classList.toggle('hidden');

    if (content.classList.contains('hidden')) {
        icon.classList.remove('rotate-45');
        icon.classList.add('fa-plus');
        icon.classList.remove('fa-minus');
    } else {
        icon.classList.add('rotate-45');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
};
