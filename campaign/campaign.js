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

const campaignFaqGroups = [
    {
        label: 'Tier 1: Purchase Decision',
        accent: true,
        items: [
            {
                q: 'What makes Owlnest different from other sleep products?',
                a: 'Owlnest Lume is designed specifically for the final hours before bed, not for general room lighting or digital sleep tracking.\n\nInstead of adding more stimulation, screens, or complexity, it focuses on shaping a calm, low-distraction evening environment through deep amber light. The goal is not simply to light a space, but to help the room feel more stable, quieter, and more naturally prepared for rest.'
            },
            {
                q: 'Is Owlnest Lume suitable for everyday use?',
                a: 'Yes. Owlnest Lume is designed for regular evening use as part of a sustainable bedtime routine.\n\nBecause it works through environmental design rather than medication or stimulation, it can fit naturally into everyday life. Many people benefit most when the same calming light cue becomes part of their nightly transition into rest.'
            },
            {
                q: 'Will Owlnest Lume still help if I already tried other solutions?',
                a: 'Many people have already tried apps, supplements, or generic bedside lamps without feeling a meaningful difference.\n\nOwlnest Lume approaches the problem from the environment itself: light intensity, color temperature, and the overall feeling of the room before sleep. While no single product works for everyone, improving the bedtime environment is often one of the most practical and repeatable ways to support better rest.'
            },
            {
                q: 'How quickly can I notice a difference?',
                a: 'Some people notice the shift right away in how the room feels at night.\n\nFor others, the benefits become clearer after consistent use over several evenings, especially as the brain begins to associate the same warm, stable light with wind-down time. The strongest improvements usually come from repetition rather than a single night.'
            }
        ]
    },
    {
        label: 'Tier 2: Trust & Risk Reduction',
        items: [
            {
                q: 'Is Owlnest Lume safe to use every night?',
                a: 'Owlnest Lume is designed as a gentle, environment-based product for nightly use. It does not chemically affect the body or force sleep.\n\nInstead, it helps create a calmer visual setting that feels more appropriate for late evening. As with any sleep-related product, comfort and personal preference matter, but the design approach itself is intended to be soft, non-invasive, and sustainable.'
            },
            {
                q: 'Does Owlnest Lume replace other sleep tools?',
                a: 'Not necessarily. Owlnest Lume can work as a primary part of your evening routine or as a complement to other habits such as better sleep timing, reduced screen exposure, or calming scent.\n\nIts role is to improve the atmosphere of the room, which can strengthen whatever healthy bedtime routine you already have.'
            },
            {
                q: 'Will I become dependent on it?',
                a: 'Owlnest Lume is intended to support natural bedtime behavior rather than replace it. It does not create the kind of dependency associated with medication.\n\nOver time, many people simply come to prefer a more stable and less stimulating evening environment. The aim is to reinforce a natural wind-down rhythm, not force one.'
            },
            {
                q: 'Can Owlnest Lume be used in a small bedroom or apartment?',
                a: 'Yes. Owlnest Lume is especially well suited to smaller bedrooms, apartments, and bedside spaces because it is designed as an intimate evening light rather than a bright room-filling lamp.\n\nIts purpose is to shape atmosphere close to where your nighttime routine actually happens.'
            },
            {
                q: 'Is Owlnest Lume only for people with serious sleep problems?',
                a: 'No. Owlnest Lume can also be valuable for people who simply want a calmer evening atmosphere, less harsh light before bed, and a more intentional nightly ritual.\n\nIt is not only for severe sleep difficulty; it is also for people who care about how their environment feels in the last part of the day.'
            },
            {
                q: 'Can I use Owlnest Lume as part of a long-term bedtime routine?',
                a: 'Yes. The product is best understood as a long-term evening tool rather than a one-off sleep trick.\n\nThe more consistent the ritual around it becomes, the more strongly it can help signal that the active part of the day is ending.'
            }
        ]
    },
    {
        label: 'Tier 3: Comparison & Decision',
        items: [
            {
                q: 'Is Owlnest Lume better than using my phone or an app at night?',
                a: 'Phones and apps may offer convenience, but they also introduce screen light, notifications, charging limitations, and digital distraction.\n\nOwlnest Lume is designed as a dedicated evening object, which means it focuses only on shaping the room for rest. For many people, that separation becomes more valuable the longer they use it.'
            },
            {
                q: 'Who is Owlnest Lume best for?',
                a: 'Owlnest Lume is best for people who feel overstimulated by bright light at night, want a more intentional wind-down ritual, or are trying to make the bedroom feel calmer before sleep.\n\nIt can also suit travelers, light sleepers, and anyone who wants a more consistent evening atmosphere without relying on medication.'
            },
            {
                q: 'What if it does not work for me?',
                a: 'Sleep is highly individual, and no single solution works for everyone.\n\nOwlnest Lume is built around widely useful principles of evening environment design, but habits, timing, stress, and personal preference all matter. The purpose of Owlnest Lume is to provide a stronger foundation for bedtime, not to act as a universal cure-all.'
            },
            {
                q: 'Why not just dim a regular lamp?',
                a: 'Dimming a regular lamp may reduce brightness, but it does not necessarily change the overall character of the light.\n\nOwlnest Lume is designed around a deeper amber profile and a more intentional bedtime mood, so the goal is not only less light, but a better kind of light for late evening.'
            },
            {
                q: 'Can Owlnest Lume help make the bedroom feel calmer before sleep?',
                a: 'That is exactly what it is designed to do.\n\nThe product is meant to soften the visual atmosphere of the room, reduce the feeling of daytime alertness, and support a more settled bedtime environment. For many people, that emotional shift is one of the most noticeable benefits.'
            },
            {
                q: 'Is Owlnest Lume a good gift for someone who wants better sleep habits?',
                a: 'Yes. Because it supports nightly routine and bedroom atmosphere rather than making medical claims, Owlnest Lume can make a thoughtful gift for people who value calmer evenings, intentional design, and more sleep-friendly habits at home.'
            },
            {
                q: 'Is Owlnest Lume useful for travel or unfamiliar rooms?',
                a: 'It can be. One of the hardest parts of travel is that rooms often feel visually harsh or unfamiliar at night.\n\nA dedicated evening light helps recreate a more familiar wind-down mood, which can make bedtime feel less abrupt when you are away from home.'
            }
        ]
    },
    {
        label: 'AEO Questions',
        items: [
            {
                q: 'How can I create a better sleep environment at home?',
                a: 'A better sleep environment usually starts with lowering stimulation before bed.\n\nThe most practical steps include reducing bright overhead light, limiting blue light exposure, keeping the room visually calm, and using consistent bedtime cues. Products like Owlnest Lume are designed to support that transition by replacing active-feeling light with a warmer, more stable evening atmosphere.'
            },
            {
                q: 'What kind of light is best before bed?',
                a: 'In general, warmer and softer light is better before bed than bright, cool-toned light.\n\nThe goal is not only to dim the room, but to make the space feel quieter and less alert. That is why bedtime light, amber night lights, and lower-stimulation lamps are often preferred for evening routines.'
            },
            {
                q: 'What is a good non-medication sleep aid?',
                a: 'The most sustainable non-medication sleep aids usually focus on environment and routine: lower light exposure, fewer screens, more predictable evening cues, and a calmer bedroom atmosphere.\n\nOwlnest Lume is designed to fit into that category by supporting bedtime relaxation through warm, intentionally controlled light rather than chemical intervention.'
            },
            {
                q: 'How can I reduce blue light before bed?',
                a: 'The most effective way to reduce blue light before bed is to lower screen exposure, avoid bright overhead lighting, and switch to warmer, lower-stimulation light sources in the bedroom.\n\nA dedicated evening lamp like Owlnest Lume can make that transition more practical and more consistent every night.'
            },
            {
                q: 'What is the best bedside lamp for better sleep?',
                a: 'The best bedside lamp for better sleep is usually one that feels warm, gentle, and appropriate for the hours before bed rather than for reading or task work.\n\nIt should help the room feel softer, not more alert. That is the category Owlnest Lume is designed to serve.'
            },
            {
                q: 'What is amber light and why do people use it at night?',
                a: 'Amber light refers to a deeper, warmer light profile that feels less sharp and less active than many common household lights.\n\nPeople use it at night because it often creates a more restful atmosphere and helps the room feel more appropriate for winding down.'
            },
            {
                q: 'How bright should a bedtime light be?',
                a: 'In most cases, bedtime light should be low enough that the room feels settled rather than activated.\n\nIt should support movement and comfort without making the space feel like daytime. The ideal level varies by room and habit, but softer is usually better than brighter late at night.'
            },
            {
                q: 'How can I make my bedroom feel calmer at night?',
                a: 'Start by removing cues that feel active: bright overhead light, screens, clutter, and abrupt transitions from work into bed.\n\nThen add quieter cues such as warm light, softer contrast, and a simple repeatable routine. Bedroom calm usually comes from consistency more than from any single object.'
            },
            {
                q: 'How do I build a better bedtime routine?',
                a: 'A strong bedtime routine usually works because it repeats the same calming signals every evening.\n\nLower light, reduced screen intensity, a consistent schedule, and a clear transition from activity into rest all help. Owlnest Lume fits into that routine by making the lighting cue simple and repeatable.'
            },
            {
                q: 'Can warm light support relaxation before sleep?',
                a: 'Many people find that warm light feels quieter, softer, and less mentally activating than bright cool-toned light.\n\nThat does not make it a medical treatment, but it can make the room feel more compatible with relaxation and bedtime rituals.'
            },
            {
                q: 'What is the difference between amber light and ordinary warm light?',
                a: 'Ordinary warm light can still feel fairly bright or broad in character, especially if it is designed for general household use.\n\nAmber light tends to feel deeper and more sunset-like, which is why it is often used in products intended for late-evening atmosphere rather than visibility-first lighting.'
            },
            {
                q: 'What are the best bedroom products for a sleep-friendly routine?',
                a: 'The most useful bedroom products are usually the ones that reduce stimulation rather than add more complexity.\n\nEvening-friendly lighting, comfortable bedding, simple scent rituals, and a cleaner visual environment often matter more than highly technical gadgets. Owlnest Lume is designed to contribute to that kind of calmer, more intentional bedroom setup.'
            },
            {
                q: 'Can a bedtime lamp help me feel less stimulated at night?',
                a: 'A bedtime lamp can help by changing how the room feels during the last part of the day.\n\nWhen the lighting becomes softer and less active, many people also find it easier to step out of work mode, reduce stimulation, and settle into a more intentional evening pace.'
            }
        ]
    }
];

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
        || (isLive ? 'Current Campaign Pricing' : isPrelaunch ? 'Launch Pricing Preview' : 'Campaign Pricing');

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

    titleEl.textContent = isPrelaunch ? 'Launch Pricing Preview' : 'Indiegogo Campaign Offers';

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
    const hasCustomFaq = campaignFaqGroups.some(group => Array.isArray(group.items) && group.items.length);
    const fallbackItems = Array.isArray(data.faq) ? data.faq : [];

    if (!hasCustomFaq && !fallbackItems.length) {
        container.innerHTML = '<p class="text-sm text-gray-500">FAQ coming soon.</p>';
        return;
    }

    if (!hasCustomFaq) {
        container.innerHTML = fallbackItems.map(renderFaqItem).join('');
        return;
    }

    const visibleGroup = campaignFaqGroups[0];
    const extraGroups = campaignFaqGroups.slice(1);

    container.innerHTML = `
        <div class="mb-6">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/8 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">
                ${escapeHtml(visibleGroup.label)}
            </span>
        </div>
        <div class="space-y-1">
            ${visibleGroup.items.map(renderFaqItem).join('')}
        </div>
        <div id="campaign-faq-extra" class="hidden space-y-8 mt-8">
            ${extraGroups.map(renderFaqGroup).join('')}
        </div>
        <div class="text-center mt-8">
            <button
                id="campaign-faq-toggle"
                type="button"
                class="inline-flex items-center justify-center border border-[#455169]/15 text-[#455169] px-8 py-4 font-bold tracking-[0.14em] uppercase text-xs hover:bg-[#455169] hover:text-[#faefcf] transition duration-300 rounded-sm"
                aria-expanded="false"
                onclick="toggleCampaignFaqMore(this)"
            >
                See More Questions
            </button>
        </div>
    `;
}

function renderFaqGroup(group) {
    return `
        <div>
            <div class="mb-4">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#455169]/10 bg-white/40 text-[#455169]/75 text-[10px] font-bold tracking-[0.2em] uppercase">
                    ${escapeHtml(group.label || '')}
                </span>
            </div>
            <div class="space-y-1">
                ${(group.items || []).map(renderFaqItem).join('')}
            </div>
        </div>
    `;
}

function renderFaqItem(item) {
    return `
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
    `;
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

window.toggleCampaignFaqMore = function (button) {
    const extra = document.getElementById('campaign-faq-extra');
    if (!extra || !button) return;

    const isHidden = extra.classList.contains('hidden');
    extra.classList.toggle('hidden');
    button.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    button.textContent = isHidden ? 'See Fewer Questions' : 'See More Questions';
};
