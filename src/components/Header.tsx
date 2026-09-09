import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useScrolled } from '../lib/hooks';
import { useCart } from '../store/cart';
import { useUi } from '../store/ui';
import { Logo } from './Primitives';
import { IconCart, IconMenu, IconSearch } from './Icons';

export const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/categorias', label: 'Categorías' },
  { to: '/productos', label: 'Productos' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const scrolled = useScrolled(20);
  const { count } = useCart();
  const { open, close } = useUi();
  const { pathname } = useLocation();

  // cada navegación cierra cualquier panel abierto
  useEffect(() => close(), [pathname, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'h-16 border-b border-hair bg-void/80 shadow-[0_10px_40px_-24px_rgba(11,132,255,.75)] backdrop-blur-xl'
          : 'h-20 bg-gradient-to-b from-void/85 to-transparent backdrop-blur-[2px]'
      }`}
    >
      <div className="container-x flex h-full items-center gap-4">
        <Link to="/" aria-label="DYNASTIC — Inicio" className="shrink-0">
          <Logo
            variant="full"
            width={160}
            className={`w-auto transition-[height] duration-300 ${scrolled ? 'h-6' : 'h-7 sm:h-8'}`}
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-silver-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-electric transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-3">
          <button
            type="button"
            onClick={() => open('search')}
            aria-label="Buscar productos"
            className="grid h-10 w-10 place-items-center rounded-full text-silver-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconSearch />
          </button>

          <button
            type="button"
            onClick={() => open('cart')}
            aria-label={`Abrir carrito${count ? ` (${count} productos)` : ''}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-silver-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconCart />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-electric px-1 text-[10px] font-bold text-white shadow-glow-sm">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => open('menu')}
            aria-label="Abrir menú"
            className="grid h-10 w-10 place-items-center rounded-full text-silver-200 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            <IconMenu />
          </button>
        </div>
      </div>
    </header>
  );
}
