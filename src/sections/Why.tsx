import { Reveal, SectionHead } from '../components/Primitives';
import { IconChat, IconShield, IconSpark, IconTrend } from '../components/Icons';

const PILLARS = [
  {
    icon: IconShield,
    title: 'Tecnología seleccionada',
    text: 'Productos elegidos pensando en calidad y funcionalidad.',
  },
  {
    icon: IconChat,
    title: 'Compra fácil',
    text: 'Consulta y compra directamente desde WhatsApp.',
  },
  {
    icon: IconSpark,
    title: 'Atención personalizada',
    text: 'Te ayudamos a elegir lo que realmente necesitas.',
  },
  {
    icon: IconTrend,
    title: 'Una marca que evoluciona',
    text: 'DYNASTIC está construyendo una nueva forma de comprar tecnología.',
  },
];

export default function Why() {
  return (
    <section className="relative border-t border-hair py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="¿Por qué DYNASTIC?"
          title={
            <>
              Más razones para <span className="text-silver-sheen">quedarte</span>
            </>
          }
          align="center"
        />

        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70} className="h-full">
              <div className="card glow-ring group h-full p-6 transition-colors duration-300 hover:border-electric/40">
                <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-hair bg-electric/[0.08] text-electric-300 transition-colors duration-300 group-hover:bg-electric/[0.16]">
                  <p.icon className="h-6 w-6" />
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-xl bg-electric/25 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
                  />
                </span>
                <h3 className="mt-5 font-display text-[15px] font-bold uppercase tracking-wide text-white">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-silver-400">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
