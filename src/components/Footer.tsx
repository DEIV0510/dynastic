import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { waGeneral } from '../lib/whatsapp';
import { Logo } from './Primitives';
import { IconInstagram, IconPin, IconWhatsApp } from './Icons';

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { to: '/productos', label: 'Productos' },
      { to: '/categorias', label: 'Categorías' },
      { to: '/ofertas', label: 'Ofertas' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { to: '/ayuda#faq', label: 'Preguntas frecuentes' },
      { to: '/ayuda#envios', label: 'Envíos' },
      { to: '/ayuda#garantias', label: 'Garantías' },
      { to: '/contacto', label: 'Contacto' },
    ],
  },
  {
    title: 'DYNASTIC',
    links: [
      { to: '/nosotros', label: 'Nosotros' },
      { to: '/nosotros#vision', label: 'Nuestra visión' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hair bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] max-w-[140vw] -translate-x-1/2 rounded-full bg-electric/10 blur-[130px]"
      />
      <div className="container-x relative py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo variant="full" width={200} className="h-9 w-auto" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-silver-400">
              {site.description}
            </p>

            <ul className="mt-6 space-y-3 text-[14px]">
              <li className="flex items-center gap-2.5 text-silver-400">
                <IconPin className="h-4 w-4 shrink-0 text-electric-300" />
                {site.location}
              </li>
              <li>
                <a
                  href={waGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-silver-200 transition-colors hover:text-white"
                >
                  <IconWhatsApp className="h-4 w-4 shrink-0 text-electric-300" />
                  {site.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-silver-200 transition-colors hover:text-white"
                >
                  <IconInstagram className="h-4 w-4 shrink-0 text-electric-300" />@{site.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link
                        to={l.to}
                        className="text-[14px] text-silver-400 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-hair pt-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[12px] text-silver-500">
            © {new Date().getFullYear()} {site.name}. {site.tagline}.
          </p>
          <p className="text-[12px] uppercase tracking-[0.24em] text-silver-600">{site.claim}</p>
        </div>
      </div>
    </footer>
  );
}
