import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './store/cart';
import { UiProvider, useUi } from './store/ui';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Home from './pages/Home';

// La home entra en el paquete inicial; el resto se carga bajo demanda.
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CategoryIndex = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryIndex })),
);
const OffersPage = lazy(() => import('./pages/OffersPage'));
const About = lazy(() => import('./pages/About'));
const Help = lazy(() => import('./pages/Help'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Los paneles (menú, carrito, buscador) arrastran framer-motion. Se cargan la
// primera vez que se abre alguno y ya quedan montados, para que la animación de
// salida siga funcionando.
const MobileMenu = lazy(() => import('./components/MobileMenu'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const SearchOverlay = lazy(() => import('./components/SearchOverlay'));

function Panels() {
  const { hasOpened } = useUi();
  if (!hasOpened) return null;
  return (
    <Suspense fallback={null}>
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
    </Suspense>
  );
}

/** Sube al inicio en cada navegación; respeta los anclajes (#faq, #vision…). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);
  return null;
}

function RouteFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-live="polite">
      <span className="sr-only">Cargando</span>
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-hair border-t-electric"
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <UiProvider>
        <Preloader />
        <ScrollManager />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-electric focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />

        <main id="contenido">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/producto/:slug" element={<ProductDetail />} />
              <Route path="/categorias" element={<CategoryIndex />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/ofertas" element={<OffersPage />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/ayuda" element={<Help />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <Panels />
        <WhatsAppFab />
      </UiProvider>
    </CartProvider>
  );
}
