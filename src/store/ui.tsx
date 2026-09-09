import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Panel = 'none' | 'cart' | 'search' | 'menu';

interface UiApi {
  panel: Panel;
  /** true desde que se abre un panel por primera vez: sirve para cargar su código bajo demanda. */
  hasOpened: boolean;
  open: (p: Exclude<Panel, 'none'>) => void;
  close: () => void;
  toggle: (p: Exclude<Panel, 'none'>) => void;
}

const UiCtx = createContext<UiApi | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>('none');
  const [hasOpened, setHasOpened] = useState(false);

  // Estas tres funciones tienen que ser estables: el Header cierra el panel en
  // un efecto que depende de `close`, y si cambiara de identidad en cada
  // apertura el panel se cerraría solo en el mismo instante en que se abre.
  const open = useCallback((p: Exclude<Panel, 'none'>) => {
    setHasOpened(true);
    setPanel(p);
  }, []);
  const close = useCallback(() => setPanel('none'), []);
  const toggle = useCallback((p: Exclude<Panel, 'none'>) => {
    setHasOpened(true);
    setPanel((cur) => (cur === p ? 'none' : p));
  }, []);

  const value = useMemo<UiApi>(
    () => ({ panel, hasOpened, open, close, toggle }),
    [panel, hasOpened, open, close, toggle],
  );

  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}

export function useUi() {
  const ctx = useContext(UiCtx);
  if (!ctx) throw new Error('useUi debe usarse dentro de <UiProvider>');
  return ctx;
}
