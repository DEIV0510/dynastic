import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { GlowBackdrop } from '../components/Primitives';
import { site } from '../data/site';
import { waGeneral } from '../lib/whatsapp';
import { IconWhatsApp } from '../components/Icons';

export default function NotFound() {
  return (
    <>
      <Seo
        title={`Página no encontrada | ${site.name}`}
        description="La página que buscas no existe."
        path="/404"
        noindex
      />
      <section className="relative isolate grid min-h-[78vh] place-items-center overflow-hidden px-5 py-32 text-center">
        <GlowBackdrop className="-z-10" />
        <div>
          <p className="font-display text-[clamp(4rem,18vw,10rem)] font-extrabold leading-none text-silver-sheen">
            404
          </p>
          <h1 className="h-display mt-4 text-[clamp(1.5rem,4vw,2.4rem)]">Esta ruta no existe</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-silver-400">
            Pero tu próximo gadget sí. Sigue explorando.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/productos" className="btn-primary btn-lg w-full sm:w-auto">
              Ver productos
            </Link>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost btn-lg w-full sm:w-auto"
            >
              <IconWhatsApp className="h-4 w-4" />
              Escribirnos
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
