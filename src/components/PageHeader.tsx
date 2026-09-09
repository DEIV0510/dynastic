import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { GlowBackdrop, Reveal } from './Primitives';
import { IconChevron } from './Icons';

export interface Crumb {
  to?: string;
  label: string;
}

export default function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hair pb-12 pt-28 sm:pb-16 sm:pt-36">
      <GlowBackdrop className="-z-10" />
      <div className="container-x">
        {crumbs.length > 0 && (
          <nav aria-label="Miga de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-silver-500">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Inicio
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <IconChevron className="h-3 w-3 text-silver-600" aria-hidden />
                  {c.to ? (
                    <Link to={c.to} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-silver-300">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-display mt-4 text-[clamp(2.1rem,6.4vw,4rem)]">{title}</h1>
          {lead && (
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-silver-400">{lead}</p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
