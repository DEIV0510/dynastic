import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUi } from '../store/ui';
import { useEscape, useLockBody } from '../lib/hooks';
import { categories } from '../data/catalog';
import { site } from '../data/site';
import { waGeneral } from '../lib/whatsapp';
import { NAV } from './Header';
import { Logo } from './Primitives';
import { IconClose, IconInstagram, IconWhatsApp } from './Icons';

export default function MobileMenu() {
  const { panel, close } = useUi();
  const isOpen = panel === 'menu';
  useLockBody(isOpen);
  useEscape(isOpen, close);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-label="Cerrar menú"
          />
          <motion.div
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-hair bg-ink"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.34 }}
          >
            <div className="flex items-center justify-between border-b border-hair px-5 py-4">
              <Logo variant="full" width={140} className="h-6 w-auto" />
              <button
                onClick={close}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full text-silver-300 hover:bg-white/5 hover:text-white"
              >
                <IconClose />
              </button>
            </div>

            <nav className="no-scrollbar flex-1 overflow-y-auto px-5 py-6" aria-label="Menú móvil">
              <ul className="space-y-1">
                {NAV.map((n, i) => (
                  <motion.li
                    key={n.to}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.035, duration: 0.3 }}
                  >
                    <Link
                      to={n.to}
                      onClick={close}
                      className="block rounded-xl px-3 py-3 font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/5"
                    >
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <p className="eyebrow mt-8">Categorías</p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/categoria/${c.slug}`}
                      onClick={close}
                      className="block rounded-lg border border-hair bg-white/[0.03] px-3 py-2.5 text-[13px] text-silver-300 transition-colors hover:border-electric/40 hover:text-white"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-hair p-5">
              <a
                href={waGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa btn-md w-full"
              >
                <IconWhatsApp className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[13px] text-silver-400 transition-colors hover:text-white"
              >
                <IconInstagram className="h-4 w-4" />@{site.instagram}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
