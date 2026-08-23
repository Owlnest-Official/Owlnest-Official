import './_group.css';

const notes = [
  ['Ordinary warm light', 'Designed to look warm.', "Usually made for general lighting or ambience—not specifically for the body’s nighttime signal."],
  ['Owlnest Lume', 'Designed from the spectrum up for sleep.', 'A specially tuned sleep spectrum. Light specially tuned for nighttime.'],
];

function LogoMark() {
  return <span className="on-logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function Lamp() {
  return (
    <div className="on-lamp" aria-label="Owlnest Lume lamp illustration" role="img">
      <div className="on-lamp-glow" />
      <div className="on-lamp-dome" />
      <div className="on-lamp-neck" />
      <div className="on-lamp-base" />
    </div>
  );
}

export function Current() {
  return (
    <div className="on-current">
      <header className="on-header">
        <a className="on-brand" href="#top" aria-label="Go to Owlnest homepage"><LogoMark /><span>OWLNEST</span></a>
        <nav className="on-nav" aria-label="Primary navigation">
          <a className="is-current" href="#top">Home</a><a href="#object">Products</a><a href="#science">Lab</a>
          <a href="#program">21-Day Program</a><a href="#about">About Us</a><a href="#contact">Contact Us</a>
        </nav>
        <div className="on-header-actions"><span className="on-account" aria-label="Member Center">◯</span><span className="on-language">◎&nbsp; EN⌄</span><a className="on-buy" href="#purchase">Buy Lume</a></div>
      </header>

      <main>
        <section className="on-hero" id="top">
          <div className="on-sky" /><div className="on-hero-scrim" /><div className="on-handoff" />
          <div className="on-hero-inner">
            <p className="on-running-head"><span><LogoMark /> Owlnest · After Hours</span><b>Dusk to Dark</b></p>
            <div className="on-hero-content">
              <div><p className="on-kicker">Owlnest Lume</p><h1>Your room knows it’s night.<em>Your light doesn’t.</em></h1></div>
              <div className="on-hero-aside"><p>Lume is a sleep-spectrum lamp, specially tuned for after dark.</p><div className="on-actions"><a className="on-button" href="#object">Explore Lume</a><a className="on-button on-button-ghost" href="#purchase">Buy Lume</a></div><small><b>01</b><span>Keep scrolling. The sky hands its last light to the lamp.</span></small></div>
            </div>
          </div>
        </section>

        <section className="on-band on-paper" id="object">
          <div className="on-shell"><p className="on-slug"><span>Folio 01 — The Object</span><span>Owlnest Lume</span></p>
            <div className="on-grid on-object-grid"><div><figure className="on-plate"><Lamp /></figure><p className="on-caption"><b>Plate I</b><span>The real Lume, shown unlit so its form and materials stay visible.</span></p></div>
              <div className="on-copy-block"><span className="on-folio">01</span><p className="on-kicker">Lume · Sleep-spectrum lamp</p><h2>Night deserves its own light.</h2><p className="on-pull">Day and night shouldn’t have to share the same light.</p><p>Lume is a sleep-spectrum lamp, specially tuned for after dark.</p><p>Light specially tuned for nighttime.</p><div className="on-actions"><a className="on-button on-button-ghost" href="#purchase">Explore Lume</a></div></div>
            </div></div>
        </section>

        <section className="on-band on-night"><div className="on-shell"><p className="on-slug"><span>Folio 02 — The Comparison</span><span>Ordinary warm light vs Lume</span></p><div className="on-grid"><div><span className="on-folio">02</span><p className="on-kicker">Ordinary warm light vs Lume</p><h2>Warm is how light looks.<em>Spectrum is what the light contains.</em></h2></div><div className="on-margin"><p>Ordinary warm light only looks warm. Lume is designed from the spectrum up for sleep.</p><ol className="on-notes">{notes.map(([label, title, copy]) => <li key={label}><div><b>{label}</b><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></div></div></section>

        <section className="on-band on-paper" id="science"><div className="on-shell"><p className="on-slug"><span>Folio 03 — Why Light Matters</span><span>Owlnest Science</span></p><div className="on-grid"><div><span className="on-folio">03</span><p className="on-kicker">Why light matters</p><h2>Your body uses light to tell time.</h2><p className="on-lede">Daytime-like light can tell your body the day is still going. Lume gives your room light specially tuned for nighttime.</p></div><div className="on-margin"><ol className="on-notes"><li><div><b>Evidence status</b><p>Research informs the design. Lume-specific SPD and a same-condition warm-lamp comparison remain pending.</p></div></li></ol></div></div></div></section>

        <section className="on-band on-night on-ritual" id="program"><div className="on-shell"><p className="on-slug"><span>Folio 04 — The Ritual</span><span>Nighttime living</span></p><div className="on-grid"><div><span className="on-folio">04</span><p className="on-kicker">A quieter kind of evening</p><h2>Make room for night.</h2></div><div className="on-margin"><p>As the day comes to a close, give your space a signal that it can too. Lume is made for reading, winding down, and the small rituals that happen after dark.</p><div className="on-rule" /><a className="on-button" href="#purchase">Discover the 21-Day Program</a></div></div></div></section>

        <section className="on-band on-paper" id="purchase"><div className="on-shell"><p className="on-slug"><span>Folio 05 — Bring Lume Home</span><span>Owlnest Lume</span></p><div className="on-purchase"><div><p className="on-kicker">Sleep-spectrum lamp</p><h2>Light specially tuned for nighttime.</h2><p className="on-lede">A gentle companion for your room after dark.</p></div><div className="on-purchase-card"><Lamp /><div><span>Owlnest Lume</span><strong>$129</strong><a className="on-button" href="#top">Buy Lume</a></div></div></div></div></section>
      </main>
      <footer id="about"><div><a className="on-brand" href="#top"><LogoMark /><span>OWLNEST</span></a><p>Nighttime living, thoughtfully made.</p></div><div id="contact">© Owlnest Official · Contact Us · Privacy</div></footer>
    </div>
  );
}