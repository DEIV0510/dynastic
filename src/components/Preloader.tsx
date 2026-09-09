import { useEffect, useState } from 'react';
import { imgSrc } from '../lib/img';
import { site } from '../data/site';

/**
 * Pantalla de carga: símbolo → glow → wordmark → claim → barrido azul.
 * Se va en cuanto los recursos críticos están listos, con un mínimo de 800 ms
 * para que la animación no se corte, y un tope duro de 1500 ms.
 */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const started = performance.now();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - started;
      const wait = Math.max(0, 800 - elapsed);
      setTimeout(() => {
        setLeaving(true);
        setTimeout(() => setGone(true), 420);
      }, wait);
    };

    // recursos críticos: el logo y la composición del hero
    const critical = [imgSrc('logo-full'), imgSrc('hero-lineup')].filter(Boolean);
    let pending = critical.length;
    if (!pending) finish();
    critical.forEach((src) => {
      const img = new Image();
      const tick = () => {
        pending -= 1;
        if (pending <= 0) finish();
      };
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    const hardStop = setTimeout(finish, 1500);
    return () => clearTimeout(hardStop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] grid place-items-center bg-void transition-opacity duration-[420ms] ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <span
            className="absolute inset-0 -z-10 rounded-full bg-electric/45 blur-3xl"
            style={{ animation: 'pl-glow 900ms ease-out 220ms both' }}
          />
          <img
            src={imgSrc('symbol')}
            alt=""
            width="88"
            height="82"
            className="h-[74px] w-auto"
            style={{ animation: 'pl-mark 620ms cubic-bezier(.2,.8,.2,1) both' }}
          />
        </div>

        <div className="relative mt-6 overflow-hidden">
          <p
            className="font-display text-[26px] font-extrabold uppercase tracking-[0.22em] text-white sm:text-[32px]"
            style={{ animation: 'pl-word 520ms cubic-bezier(.2,.8,.2,1) 300ms both' }}
          >
            {site.name}
          </p>
          <span
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-electric-300/70 to-transparent"
            style={{ animation: 'pl-sweep 900ms cubic-bezier(.4,0,.2,1) 520ms both' }}
          />
        </div>

        <p
          className="mt-3 text-[9px] font-semibold uppercase tracking-[0.42em] text-silver-500 sm:text-[10px]"
          style={{ animation: 'pl-claim 460ms ease-out 620ms both' }}
        >
          {site.claim}
        </p>

        <span
          className="mt-7 block h-px w-40 origin-left bg-gradient-to-r from-transparent via-electric to-transparent"
          style={{ animation: 'pl-line 700ms cubic-bezier(.4,0,.2,1) 700ms both' }}
        />
      </div>
    </div>
  );
}
