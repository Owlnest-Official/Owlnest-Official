import React from "react";
import "./OwlnestDawnEdition.css";

export function OwlnestDawnEdition() {
  return (
    <main className="od">
      <header className="od-mast">
        <a className="od-brand" href="#top" aria-label="Owlnest home"><span className="od-brand-mark">o</span><span>OWLNEST</span></a>
        <nav className="od-nav" aria-label="Primary navigation"><a href="#lume">Lume</a><a href="#why">Why night light</a><a href="#details">Details</a></nav>
        <a className="od-meta" href="#details">Dawn edition / 2025</a>
      </header>
      <section className="od-hero" id="top">
        <div className="od-sun" aria-hidden="true" />
        <div className="od-lamp" aria-label="Lume lamp illustration"><div className="od-lamp-glow" /><div className="od-lamp-shade" /><div className="od-lamp-base" /></div>
        <div className="od-hero-copy">
          <p className="od-kicker">Owlnest Lume / After hours</p>
          <h1>Your room knows it’s night.<em>Your light doesn’t.</em></h1>
          <p className="od-dek">A sleep-spectrum lamp, tuned for the hours when the day should finally go quiet.</p>
          <a className="od-btn" href="#details">Explore Lume <span aria-hidden="true">↗</span></a>
        </div>
        <p className="od-hero-note"><b>00:47 / DUSK TO DARK</b>The last warm band in the sky, held a little longer.</p>
      </section>
      <section className="od-paper" id="lume">
        <div className="od-paper-head"><span>Folio 01 — The object</span><span>Night deserves its own light</span></div>
        <div className="od-story"><h2>Day and night shouldn’t have to share the <em>same light.</em></h2><div className="od-caption"><strong>Plate I / Lume</strong><p>A small, tactile lamp for the rituals that happen after the sun leaves. Warm in presence. Considered in spectrum.</p><div className="od-rule" /></div></div>
      </section>
      <section className="od-statband" id="why">
        <div className="od-stat"><b>14–15 cm</b><span>quiet scale / bedside</span></div><div className="od-stat"><b>USB-C</b><span>rechargeable / ready at dusk</span></div><div className="od-stat"><b>$119</b><span>single Lume / shipping included</span></div>
      </section>
      <section className="od-paper od-paper--last" id="details">
        <div className="od-paper-head"><span>Folio 02 — The ritual</span><span>Light, after dark</span></div>
        <div className="od-story"><h2>Let the day <em>recede.</em></h2><div className="od-caption"><strong>02 / A softer handoff</strong><p>Keep one small pool of light nearby — for a page, a glass of water, a midnight thought.</p><a className="od-btn" href="#top">Buy Lume <span aria-hidden="true">→</span></a></div></div>
      </section>
    </main>
  );
}

export default OwlnestDawnEdition;