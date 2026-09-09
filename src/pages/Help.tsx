import { useState } from 'react';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import { Reveal } from '../components/Primitives';
import { site } from '../data/site';
import { waGeneral } from '../lib/whatsapp';
import { IconChevron, IconWhatsApp } from '../components/Icons';

/**
 * Respuestas redactadas sobre la operación real: preventa + venta online con
 * cierre por WhatsApp. Lo que depende del proveedor o de la ciudad se confirma
 * en la conversación, no se promete aquí.
 */
const BLOCKS = [
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Cómo compro en DYNASTIC?',
        a: 'Eliges el producto en la web y nos escribes por WhatsApp desde cualquier botón. Ahí confirmamos disponibilidad, precio final y forma de pago, y coordinamos la entrega.',
      },
      {
        q: '¿Tienen tienda física?',
        a:
          'Trabajamos con venta online y atención personalizada por WhatsApp. Operamos desde ' +
          site.location +
          '.',
      },
      {
        q: '¿Qué es la preventa?',
        a: 'Algunos productos se piden bajo pedido para conseguirte el mejor precio. Te confirmamos el tiempo estimado antes de que apartes el tuyo, siempre.',
      },
      {
        q: '¿Por qué algunos productos no muestran precio?',
        a: 'Porque el precio de esa referencia se confirma al momento según disponibilidad. Escríbenos y te lo damos en minutos, sin compromiso.',
      },
      {
        q: '¿Puedo pedir algo que no está en la web?',
        a: 'Sí. Cuéntanos qué buscas por WhatsApp y te decimos si lo podemos conseguir y en cuánto tiempo.',
      },
    ],
  },
  {
    id: 'envios',
    title: 'Envíos',
    items: [
      {
        q: '¿A dónde envían?',
        a: 'Hacemos envíos a todo Colombia.',
      },
      {
        q: '¿Cuánto cuesta y cuánto demora?',
        a: 'Depende de tu ciudad y de la transportadora. Te confirmamos el costo y el tiempo estimado por WhatsApp antes de despachar, para que no haya sorpresas.',
      },
      {
        q: '¿Cómo sigo mi pedido?',
        a: 'Al despachar te compartimos la guía por el mismo chat de WhatsApp donde hiciste el pedido.',
      },
    ],
  },
  {
    id: 'garantias',
    title: 'Garantías',
    items: [
      {
        q: '¿Los productos tienen garantía?',
        a: 'Cada producto cuenta con la garantía de su fabricante o proveedor. Te confirmamos las condiciones exactas de tu referencia antes de que compres.',
      },
      {
        q: '¿Qué hago si llega con una falla?',
        a: 'Escríbenos de inmediato por WhatsApp con fotos o video. Revisamos el caso contigo y te acompañamos en todo el proceso.',
      },
      {
        q: '¿Revisan los productos antes de entregar?',
        a: 'Sí. Verificamos cada equipo antes de despacharlo.',
      },
    ],
  },
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="flex-1 font-display text-[15px] font-semibold text-white">{q}</span>
        <IconChevron
          className={`h-4 w-4 shrink-0 text-electric-300 transition-transform duration-300 ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[14px] leading-relaxed text-silver-400">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Help() {
  return (
    <>
      <Seo
        title={`Ayuda | ${site.name}`}
        description="Preguntas frecuentes, envíos y garantías de DYNASTIC."
        path="/ayuda"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: BLOCKS.flatMap((b) =>
            b.items.map((i) => ({
              '@type': 'Question',
              name: i.q,
              acceptedAnswer: { '@type': 'Answer', text: i.a },
            })),
          ),
        }}
      />

      <PageHeader
        eyebrow="Ayuda"
        title={
          <>
            Resolvemos <span className="text-silver-sheen">tus dudas</span>
          </>
        }
        lead="Y si queda alguna, nos escribes y ya."
        crumbs={[{ label: 'Ayuda' }]}
      />

      <section className="py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          {BLOCKS.map((b) => (
            <div key={b.id} id={b.id} className="mb-14 scroll-mt-28">
              <h2 className="h-display mb-6 text-[clamp(1.4rem,3.6vw,2rem)]">{b.title}</h2>
              <div className="space-y-3">
                {b.items.map((it, i) => (
                  <Reveal key={it.q} delay={i * 45}>
                    <Accordion q={it.q} a={it.a} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <div className="card p-8 text-center">
            <h2 className="font-display text-lg font-bold text-white">¿Sigue sin resolverse?</h2>
            <p className="mt-2 text-[14px] text-silver-400">Te respondemos por WhatsApp.</p>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa btn-md mt-6"
            >
              <IconWhatsApp className="h-4 w-4" />
              Escribir a {site.whatsappDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
