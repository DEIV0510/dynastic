import { waGeneral } from '../lib/whatsapp';
import { IconWhatsApp } from './Icons';

/**
 * Botón flotante permanente. En escritorio revela el texto al pasar el cursor;
 * en móvil se queda por encima de la barra inferior de acciones.
 */
export default function WhatsAppFab() {
  return (
    <a
      href={waGeneral()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="¿Tienes alguna pregunta? Escríbenos por WhatsApp"
      className="wa-fab group fixed right-4 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] pl-4 pr-4 text-white shadow-[0_14px_38px_-12px_rgba(34,197,94,.85)] transition-[padding] duration-300 sm:right-6 sm:hover:pr-6"
    >
      <IconWhatsApp className="h-6 w-6 shrink-0" />
      <span className="hidden max-w-0 whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[220px] group-hover:pl-2.5 group-hover:opacity-100 sm:inline">
        ¿Tienes alguna pregunta?
      </span>
      <span
        aria-hidden
        className="animate-pulseGlow absolute inset-0 -z-10 rounded-full bg-[#22C55E] blur-xl"
      />
    </a>
  );
}
