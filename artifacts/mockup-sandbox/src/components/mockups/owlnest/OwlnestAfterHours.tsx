import React from "react";
import "./OwlnestAfterHours.css";

export function OwlnestAfterHours() {
  return (
    <main className="oa">
      <header className="oa-mast">
        <a className="oa-brand" href="#top" aria-label="Owlnest home">
          <span className="oa-brand-mark">o</span><span>OWLNEST</span>
        </a>
        <nav className="oa-nav" aria-label="Primary navigation">
          <a href="#lume">Lume</a><a href="#why">Why night light</a><a href="#details">Details</a>
        </nav>
        <a className="oa-meta" href="#details">Issue 01 / 2025</a>
      </header>

      <section className="oa-hero" id="top">
        <div className="oa-orbit" aria-hidden="true" />
        <div className="oa-lamp" aria-label="Lume lamp illustration">
          <div className="oa-lamp-glow" /><div className="oa-lamp-shade" /><div className="oa-lamp-base" />
        </div>
        <div className="oa-hero-copy">
          <p className="oa-kicker">Owlnest Lume / After hours</p>
          <h1>Your room knows it’s night.<br /><em>Your light doesn’t.</em></h1>
          <p className="oa-dek">A sleep-spectrum lamp, tuned for the hours when the day should finally go quiet.</p>
          <a className="oa-btn" href="#details">Explore Lume <span aria-hidden="true">↗</span></a>
        </div>
        <p className="oa-hero-note"><b>00:47 / DUSK TO DARK</b>The last warm band in the sky, held a little longer.</p>
      </section>

      <section className="oa-paper" id="lume">
        <div className="oa-paper-head"><span>Folio 01 — The object</span><span>Night deserves its own light</span></div>
        <div className="oa-story">
          <h2>Day and night shouldn’t have to share the <em>same light.</em></h2>
          <div className="oa-caption"><strong>Plate I / Lume</strong><p>A small, tactile lamp for the rituals that happen after the sun leaves. Warm in presence. Considered in spectrum.</p><div className="oa-rule" /></div>
        </div>
      </section>

      <section className="oa-statband" id="why">
        <div className="oa-stat"><b>14–15 cm</b><span>quiet scale / bedside</span></div>
        <div className="oa-stat"><b>USB-C</b><span>rechargeable / ready at dusk</span></div>
        <div className="oa-stat"><b>$119</b><span>single Lume / shipping included</span></div>
      </section>

      <section className="oa-paper" id="details">
        <div className="oa-paper-head"><span>Folio 02 — The ritual</span><span>Light, after dark</span></div>
        <div className="oa-story">
          <h2>Let the day <em>recede.</em></h2>
          <div className="oa-caption"><strong>02 / A softer handoff</strong><p>Keep one small pool of light nearby — for a page, a glass of water, a midnight thought.</p><a className="oa-btn" href="#top">Buy Lume <span aria-hidden="true">→</span></a></div>
        </div>
      </section>
    </main>
  );
}

export default OwlnestAfterHours;