import { useEffect, useRef, useState } from 'react';
import './_ritual.css';

const discoveries = [
  ['The evening signal', 'Light is one of the cues your body uses to read the hour. We design with that quiet conversation in mind.'],
  ['The honest lab', 'We share what informs our work, what we are testing, and where the evidence is still becoming clearer.'],
  ['The small hours', 'A softer room makes space for reading, talking, stretching, and doing very little at all.'],
];

const notebook = [
  ['What does sleep-spectrum mean?', 'Lume is tuned for nighttime use, with a spectrum chosen to feel gentle in the evening. We describe the design plainly, without promising more than the research supports.'],
  ['What are you measuring?', 'We are studying the light output and how it compares with familiar warm household lighting. The work is ongoing and the notes will stay open.'],
  ['Will there be more than Lume?', 'Yes. Lume is our first expression, not our whole vocabulary. Future Owlnest objects will share the same belief: home can help mark the hours.'],
];

export function OwlnestBrandRitual() {
  const [open, setOpen] = useState<number | null>(0);
  const [heroFrame, setHeroFrame] = useState(1);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frameStep = window.innerWidth <= 640 ? 6 : window.innerWidth <= 1024 ? 4 : 3;
    const sampledFrames = Array.from({ length: 96 }, (_, index) => index + 1)
      .filter((frame) => frame === 1 || frame === 96 || (frame - 1) % frameStep === 0);
    const loaded = new Set<number>();
    const preload = (frame: number) => {
      if (loaded.has(frame)) return;
      loaded.add(frame);
      const image = new Image();
      image.src = `${import.meta.env.BASE_URL}sequence/${frame.toString().padStart(3, '0')}.png`;
    };
    const preloadWindow = (frame: number) => {
      const index = sampledFrames.reduce((closest, candidate, candidateIndex) =>
        Math.abs(candidate - frame) < Math.abs(sampledFrames[closest] - frame) ? candidateIndex : closest, 0);
      [sampledFrames[index - 1], sampledFrames[index], sampledFrames[index + 1]].forEach((candidate) => candidate && preload(candidate));
    };
    const updateSequence = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const maxScroll = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / maxScroll));
      const requested = Math.round(progress * 95) + 1;
      const frame = sampledFrames.reduce((closest, candidate) =>
        Math.abs(candidate - requested) < Math.abs(closest - requested) ? candidate : closest, sampledFrames[0]);
      preloadWindow(frame);
      setHeroFrame((current) => current === frame ? current : frame);
    };
    preloadWindow(1);
    updateSequence();
    window.addEventListener('scroll', updateSequence, { passive: true });
    window.addEventListener('resize', updateSequence);
    return () => {
      window.removeEventListener('scroll', updateSequence);
      window.removeEventListener('resize', updateSequence);
    };
  }, []);

  const heroFrameSource = `${import.meta.env.BASE_URL}sequence/${heroFrame.toString().padStart(3, '0')}.png`;

  return (
    <div className="ritual-home">
      <header className="topbar">
        <a className="brand" href="#start" aria-label="Owlnest home"><span className="mark" /> OWLNEST</a>
        <nav className="toplinks mono" aria-label="Main navigation">
          <a href="#why">Why night</a><a href="#lume">First light</a><a href="#lab">The lab</a><a href="#about">About</a>
        </nav>
        <button className="menu" aria-label="Begin the Owlnest story" onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}><span className="mono">Begin</span></button>
      </header>

      <main>
        <section className="hero" id="start" ref={heroRef}>
          <div className="hero-sequence" aria-hidden="true"><img src={heroFrameSource} alt="" /></div>
          <div className="hero-inner wrap">
            <div className="eyebrow mono">For the hours after</div>
            <div className="hero-copy">
              <h1>Choose the <em>evening.</em></h1>
              <div className="hero-aside"><p>Owlnest makes objects and rituals for a gentler relationship with night.</p><a className="primary" href="#why">Enter the evening</a></div>
            </div>
            <div className="scroll-note mono"><span>Owlnest / 001</span><span>Scroll to settle in ↓</span></div>
          </div>
        </section>

        <section className="intro" id="why">
          <div className="wrap manifesto">
            <p className="section-kicker mono">A different kind of home</p>
            <h2>Less day.<br />More <em>you.</em></h2>
            <div className="manifesto-foot"><span className="rule-number">02 <i /></span><p className="big-note">The day leaves a lot behind. Your home can help you put it down.</p><p className="body">Owlnest is a home-lifestyle brand for evenings that feel deliberate, tactile, and entirely your own. We begin with light, and we are only beginning.</p></div>
          </div>
        </section>

        <section className="quiet" id="principles">
          <div className="wrap quiet-head"><p className="section-kicker mono">Our point of view</p><h2>Three notes<br /><em>after dark.</em></h2><p className="quiet-caption">A working vocabulary for a slower room.</p></div>
          <div className="wrap quiet-copy">{discoveries.map(([title, text], index) => <article className="quiet-card" key={title}><strong>0{index + 1}</strong><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>

        <section className="object" id="lume">
          <div className="object-rail mono"><span>First expression</span><span>Lume / 001</span></div>
          <div className="wrap object-layout">
            <div className="object-copy"><p className="eyebrow mono">Our first expression / Lume</p><h2>Light for the <em>small hours.</em></h2><p className="object-desc">A sleep-spectrum lamp made for the part of the day that belongs to you. Thoughtful light, considered materials, no noise.</p><a className="linkline" href="#lab">Discover Lume <span>→</span></a></div>
            <figure className="lamp-stage"><img className="lume-photo" src={`${import.meta.env.BASE_URL}lume-real-photo-on.jpg`} alt="Owlnest Lume glowing on its wooden base" /><figcaption className="mono">A warmer way to end the day</figcaption></figure>
          </div>
        </section>

        <section className="notes" id="lab">
          <div className="wrap notes-layout">
            <div className="notes-index"><p className="section-kicker mono">Open notebook</p><span className="note-glyph">✳</span><h2>Curious,<br />not <em>certain.</em></h2><p>Questions are part of the object.</p></div>
            <div className="accord">{notebook.map(([question, answer], index) => <div key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><span aria-hidden="true">{open === index ? '−' : '+'}</span></button><div className={`answer ${open === index ? 'open' : ''}`}>{answer}</div></div>)}</div>
          </div>
        </section>

        <section className="future" id="about"><div className="wrap future-inner"><p className="section-kicker mono">A growing house</p><h2>Make home feel<br />like <em>home.</em></h2><div className="future-bottom"><p>We are building Owlnest slowly: one useful object, one better question, one evening at a time.</p><a className="outline" href="#start">Meet Owlnest →</a></div></div></section>
      </main>
      <footer><div className="wrap"><div className="footgrid"><div><a className="brand" href="#start"><span className="mark" /> OWLNEST</a><p>Nighttime living, thoughtfully made.</p></div><div className="footlinks mono"><a href="#lab">Notes</a><a href="#lume">Lume</a><a href="mailto:hello@owlnest.home">Contact</a></div></div><div className="copyright mono">© Owlnest <span>Made for the hours after.</span></div></div></footer>
    </div>
  );
}