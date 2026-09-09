import { useState } from 'react';
import Seo from '../components/Seo';
import Surface from '../components/Surface';
import PageHeader from '../components/PageHeader';
import { Reveal } from '../components/Primitives';
import { site } from '../data/site';
import { IconInstagram, IconPin, IconWhatsApp } from '../components/Icons';

/**
 * El formulario no envía correo: compone el mensaje y abre WhatsApp, que es el
 * canal real de la operación. Así nada se pierde en una bandeja sin revisar.
 */
export default function Contact() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const text = `Hola ${site.name}, soy ${name || '...'}.${subject ? ` Escribo por: ${subject}.` : ''}${
    message ? `\n\n${message}` : ''
  }`;
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <Seo
        title={`Contacto | ${site.name}`}
        description={`Escríbenos por WhatsApp al ${site.whatsappDisplay} o síguenos en Instagram @${site.instagram}.`}
        path="/contacto"
      />

      <PageHeader
        eyebrow="Contacto"
        title={
          <>
            Hablemos de <span className="text-silver-sheen">tecnología</span>
          </>
        }
        lead="Respondemos rápido. Cuéntanos qué buscas y te ayudamos a elegir."
        crumbs={[{ label: 'Contacto' }]}
      />

      <Surface tone="light">
        <section className="py-10 sm:py-14">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <Reveal>
                <div className="card p-7 sm:p-8">
                  <p className="eyebrow">Canal directo</p>
                  <h2 className="mt-3 font-display text-xl font-bold text-heading">WhatsApp</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-silver-400">
                    Es donde cerramos los pedidos y resolvemos dudas al momento.
                  </p>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa btn-md mt-6 w-full"
                  >
                    <IconWhatsApp className="h-4 w-4" />
                    {site.whatsappDisplay}
                  </a>

                  <ul className="mt-8 space-y-4 border-t border-hair pt-6 text-[14px]">
                    <li className="flex items-start gap-3 text-silver-400">
                      <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" />
                      <span>
                        <span className="block text-silver-200">Operamos desde</span>
                        {site.location}
                      </span>
                    </li>
                    <li>
                      <a
                        href={site.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 text-silver-400 transition-colors hover:text-heading"
                      >
                        <IconInstagram className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" />
                        <span>
                          <span className="block text-silver-200">Instagram</span>@{site.instagram}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <form
                  className="card p-7 sm:p-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.open(href, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <p className="eyebrow">Escríbenos</p>
                  <h2 className="mt-3 font-display text-xl font-bold text-heading">
                    Arma tu mensaje
                  </h2>
                  <p className="mt-2 text-[13px] text-silver-500">
                    Lo enviamos por WhatsApp para responderte de inmediato.
                  </p>

                  <div className="mt-6 space-y-4">
                    <Field label="Tu nombre" htmlFor="c-name">
                      <input
                        id="c-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        className="input"
                        placeholder="Cómo te llamas"
                      />
                    </Field>

                    <Field label="Motivo" htmlFor="c-subject">
                      <select
                        id="c-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="input"
                      >
                        <option value="">Selecciona una opción</option>
                        <option>Cotizar un producto</option>
                        <option>Consultar disponibilidad</option>
                        <option>Estado de mi pedido</option>
                        <option>Garantía o soporte</option>
                        <option>Venta al por mayor</option>
                        <option>Otro</option>
                      </select>
                    </Field>

                    <Field label="Mensaje" htmlFor="c-message">
                      <textarea
                        id="c-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="input resize-none"
                        placeholder="Cuéntanos qué necesitas"
                      />
                    </Field>
                  </div>

                  <button type="submit" className="btn-wa btn-lg mt-7 w-full">
                    <IconWhatsApp className="h-4 w-4" />
                    Enviar por WhatsApp
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </Surface>
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-silver-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
