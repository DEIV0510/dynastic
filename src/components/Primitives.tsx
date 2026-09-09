import { Link } from 'react-router-dom';
import type { ElementType, ReactNode } from 'react';
import { imgDims, imgSrc, imgSrcSet } from '../lib/img';
import { useReveal } from '../lib/hooks';
import { site } from '../data/site';

/* ── Logo ──────────────────────────────────────────────────────────────── */

export function Logo({
  variant = 'full',
  className = '',
  width,
}: {
  variant?: 'full' | 'symbol';
  className?: string;
  width?: number;
}) {
  const name = variant === 'full' ? 'logo-full' : 'symbol';
  const d = imgDims(name);
  return (
    <img
      src={imgSrc(name)}
      srcSet={imgSrcSet(name)}
      sizes={width ? `${width}px` : '200px'}
      width={d.width}
      height={d.height}
      alt={`${site.name} — ${site.tagline}`}
      className={className}
      decoding="async"
    />
  );
}

/* ── Imagen de producto ────────────────────────────────────────────────── */

export function ProductImage({
  name,
  alt,
  sizes,
  className = '',
  priority = false,
}: {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const d = imgDims(name);
  return (
    <img
      src={imgSrc(name)}
      srcSet={imgSrcSet(name)}
      sizes={sizes}
      width={d.width}
      height={d.height}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      decoding="async"
      draggable={false}
    />
  );
}

/* ── Reveal ────────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'header' | 'article';
  className?: string;
}) {
  const { ref, shown } = useReveal();
  const El = Tag as ElementType;
  return (
    <El
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-700 ease-out will-change-transform ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[6px]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </El>
  );
}

/* ── Encabezado de sección ─────────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  lead,
  to,
  toLabel = 'Ver todo',
  align = 'left',
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  to?: string;
  toLabel?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:mb-10 ${
        align === 'center'
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <Reveal className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="h-display text-[clamp(1.9rem,5.4vw,3.4rem)]">{title}</h2>
        {lead && <p className="mt-4 text-[15px] leading-relaxed text-silver-400">{lead}</p>}
      </Reveal>
      {to && (
        <Reveal delay={80}>
          <Link to={to} className="btn-ghost btn-sm shrink-0">
            {toLabel}
          </Link>
        </Reveal>
      )}
    </div>
  );
}

/* ── Fondo compartido: rejilla + halo azul ─────────────────────────────── */

export function GlowBackdrop({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-grid [background-size:64px_64px] opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_72%)]" />
      <div className="animate-pulseGlow absolute left-1/2 top-0 h-[520px] w-[820px] max-w-[130vw] -translate-x-1/2 -translate-y-1/3 rounded-full bg-electric/20 blur-[120px]" />
    </div>
  );
}
