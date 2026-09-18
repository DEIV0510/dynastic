# DYNASTIC — Tecnología e Innovación

Presencia digital de DYNASTIC (La Virginia, Risaralda). Venta online con cierre
por WhatsApp y preventa, construida para crecer hacia un e-commerce completo.

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + React Router
- **WhatsApp:** `+57 310 421 8808` · **Instagram:** [@dinasticvibe](https://instagram.com/dinasticvibe)

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # sitemap + typecheck + build de producción
npm test         # pruebas del algoritmo de ranking (también corren en cada build)
npm run e2e      # pruebas funcionales (carrito, buscador, menú, orden, WhatsApp)
npm run audit    # capturas de todas las páginas + auditoría (desktop y móvil)
```

---

## Cómo se cargan los datos

Todo el contenido comercial vive en **`src/data/`**. Nada está escrito a mano
dentro de los componentes.

| Archivo | Qué contiene |
| --- | --- |
| `site.ts` | Marca, WhatsApp, Instagram, ubicación, dominio, moneda, IDs de analítica |
| `catalog.ts` | Categorías y productos (la fuente de verdad del catálogo) |
| `types.ts` | Forma de un producto: precio, stock, variantes, colores, reseñas… |
| `images.json` | Generado: qué anchos existen de cada imagen (para el `srcset`) |

### Regla del catálogo: nada inventado

Cada ficha se escribió **sólo con lo que se lee o se ve en la foto oficial** del
producto. Los campos sin confirmar quedan en `null` y **la interfaz los oculta
sola**:

| Campo en `null` | Qué hace la web |
| --- | --- |
| `price` | Muestra «Precio por WhatsApp» y el CTA pasa a ser WhatsApp |
| `priceBefore` | No hay badge de descuento |
| `brand` | La tarjeta muestra «DYNASTIC» |
| `reference` | No se muestra la referencia |
| `stock` | No aparece el filtro de disponibilidad |
| `rating` / `reviews` | No aparecen estrellas |
| `colors` / `variants` (vacíos) | No aparecen esos selectores |

### Publicar precios

Basta con rellenar `price` (y `priceBefore` si hay descuento) en `catalog.ts`.
Se activan **solos**: el botón «Comprar», el carrito con subtotal, el filtro de
precio del catálogo, el badge `-XX%`, la sección **Ofertas** con
ANTES / AHORA / -XX%, y el `price` del Schema.org de la ficha.

```ts
{
  slug: 'parlante-havit-rgb',
  price: 189000,        // COP
  priceBefore: 239000,  // opcional
  stock: 4,             // opcional
}
```

### Añadir un producto

1. Deja la foto en `C:/Users/Lenovo/Desktop/DYNASTIC/` (o donde apunte
   `SRC_RAW` en los scripts).
2. Si la foto trae el **damero pintado** de las webs de stock, recórtala:
   `npm run assets:cut` (detecta el damero y lo convierte en transparencia real).
3. Registra el slug en `scripts/build-assets.mjs` y ejecuta `npm run assets:build`
   (genera WebP a 320/640/960 px y actualiza `images.json`).
4. Añade la ficha en `catalog.ts` con `image: '<slug>'`.

---

## Orden del catálogo (ranking)

El catálogo se ordena como una plataforma: **primero lo destacado y lo más
vendido**. Todo lo que muestra productos —catálogo, categorías, «Elegidos para
ti» de la home, ofertas, relacionados y el buscador— usa el mismo criterio.

**Cómo decide el orden «Relevancia»** (`src/lib/ranking.ts`):

1. **Fijados a mano** (`pin`), en el número que les pongas.
2. **Todo lo disponible**, por una puntuación de 0 a 1:

   | Señal | Peso | De dónde sale |
   | --- | --- | --- |
   | Ventas totales | 30 % | `sold` (escala logarítmica: el líder no aplasta al resto) |
   | Tendencia | 20 % | `sold30`, ventas de los últimos 30 días |
   | Destacado | 20 % | `featured` en `catalog.ts` |
   | Reseñas | 10 % | `rating`/`reviews` (promedio bayesiano) |
   | Descuento | 8 % | `price` vs `priceBefore` |
   | Novedad | 7 % | `addedAt`, decae en 45 días |
   | Comprable ya | 5 % | tiene `price` |

3. **Lo agotado**, siempre al final: nunca ocupa un primer puesto.

A igual puntuación manda el orden en que aparecen en `catalog.ts`.

**Cargar ventas** — en `src/data/merchandising.ts`, con números reales:

```ts
'parlante-havit-rgb': { sold: 42, sold30: 9 },
'proyector-wanbo-fhd': { pin: 1 },            // siempre primero
'smartwatch-deportivo': { addedAt: '2026-09-15', label: 'Recomendado' },
```

Con eso se activan solos: el orden por ventas, la opción **«Más vendidos»** del
catálogo, las insignias **«Más vendido»** (top 3) y **«Tendencia»** (top 2 de
los 30 días), y la home pasa a titular «Lo más vendido». **Mientras el archivo
esté vacío no se muestra ninguna insignia de popularidad**: ordena la selección
editorial. Los pesos se ajustan en el mismo archivo (`rankingWeights`).

`npm test` comprueba el algoritmo con datos de ejemplo y valida los datos
reales (slugs que existan, números enteros, `sold30 ≤ sold`, fechas válidas).

---

## Superficies claras y oscuras

La página **alterna zonas**, no es una sola pared negra: oscuro para los momentos
de impacto (hero, producto destacado, cierre) y claro para las zonas donde el
visitante lee y elige (categorías, catálogo, ofertas, ficha de producto).

El color no está escrito en los componentes: son **tokens CSS** (`src/index.css`)
que `tailwind.config.js` expone como `bg-void`, `text-heading`, `border-hair`,
`text-silver-*`… Envolver un bloque en `<Surface tone="light">` redefine esos
tokens y todo lo que hay dentro —tarjetas, textos, bordes, sombras, el lecho de
los productos— se adapta solo.

```tsx
<Surface tone="light">
  <Categories />
  <Featured />
</Surface>
```

El azul de marca y los botones sólidos (primario, WhatsApp) son fijos en las dos
superficies. Los paneles (carrito, buscador, menú) son siempre oscuros.

## Arquitectura

```
src/
  data/        catálogo, marca, tipos, manifiesto de imágenes
  lib/         WhatsApp, formato de precios, srcset, hooks (tilt, reveal, parallax)
  store/       carrito (localStorage con guardia de hidratación) y estado de paneles
  components/  header, footer, carrito, buscador, menú, tarjeta, SEO, iconos
  sections/    bloques de la home: hero, categorías, destacados, ofertas…
  pages/       rutas
scripts/       utilidades de imagen, sitemap, auditoría y pruebas
```

### Rutas

`/` · `/productos` · `/producto/:slug` · `/categorias` · `/categoria/:slug` ·
`/ofertas` · `/nosotros` · `/ayuda` · `/contacto` · 404

### WhatsApp

Todos los enlaces se arman en `src/lib/whatsapp.ts` con el mensaje ya escrito
(producto, cantidad, precio si existe, o el pedido completo del carrito).
Cambiar el número en `site.ts` los actualiza todos.

---

## Preparado para crecer

Ya está la estructura, sin implementar todavía:

- **Pagos en línea** — el carrito calcula subtotal y hoy cierra por WhatsApp;
  `CartDrawer` es el único punto a cambiar.
- **Inventario / stock** — el campo existe y activa el filtro de disponibilidad
  y el estado «Agotado».
- **Variantes y colores** — tipados en `types.ts` y ya renderizados si se llenan.
- **Reseñas** — `rating` / `reviews` en la ficha y en el Schema.org.
- **Analítica (Meta Pixel, GA4)** — `analytics` en `site.ts`, sin IDs todavía.
- **Nuevas categorías** — se agregan en `categories`; el menú, el buscador,
  los filtros y el sitemap las recogen solas.

---

## SEO

Título, descripción, canónica, Open Graph, Twitter Card y JSON-LD por página
(`src/components/Seo.tsx`): `Organization` y `WebSite` en la home, `Product` con
`Offer` en cada ficha y `FAQPage` en ayuda. `sitemap.xml` se regenera en cada
build desde el catálogo.

## Despliegue

Vercel, con `vercel.json` ya configurado (reescritura SPA + caché inmutable de
`/assets` y `/img`). Antes de publicar, ajusta `site.url` en `src/data/site.ts`
al dominio real: de ahí salen la canónica, el Open Graph y el sitemap.

---

## Notas de las imágenes

Las fotos originales llegaron con el **damero de transparencia pintado en los
píxeles** (no tenían canal alfa). `scripts/cutout.mjs` lo detecta midiendo, en
una ventana alrededor de cada píxel, si conviven los dos tonos del damero; así
distingue el fondo de los cuerpos blancos de la cámara y el cargador, que un
recorte por color se comía. `scripts/clean.mjs` elimina después los fragmentos
sueltos. Los recortes resultantes se sirven en WebP con alfa real.
