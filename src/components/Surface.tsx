import type { ReactNode } from 'react';

/**
 * Zona de la página con su propia superficie. `light` redefine los tokens de
 * color (ver src/index.css) y todo el contenido —tarjetas, textos, bordes,
 * sombras— se adapta sin tocar sus clases.
 *
 * La página alterna: oscuro para los momentos de impacto (hero, producto
 * destacado, cierre) y claro para las zonas de lectura y compra.
 */
export default function Surface({
  tone = 'dark',
  className = '',
  id,
  children,
}: {
  tone?: 'dark' | 'light';
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} data-surface={tone} className={`relative bg-void text-silver-300 ${className}`}>
      {children}
    </div>
  );
}
