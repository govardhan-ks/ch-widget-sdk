import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  apiRequest,
  initPlatform,
  getPlatformElement,
  getContextObservable,
  getThemeObservable,
} from 'widget-sdk-core';

type PlatformState = {
  context: any;
  theme: any;
  element: HTMLElement | null;
};

const PlatformContext = createContext<any>(null);

export function PlatformProvider({
  children,
  element,
}: {
  children: React.ReactNode;
  element?: HTMLElement;
}) {
  const [state, setState] = useState<PlatformState>({
    context: null,
    theme: null,
    element: null,
  });

  useEffect(() => {
    let contextUnsubscribe: (() => void) | null = null;
    let themeUnsubscribe: (() => void) | null = null;

    async function init() {
      try {
        // Initialize platform
        await initPlatform(element ? { element } : undefined);

        // Subscribe to context and theme observables
        const [contextObs, themeObs] = await Promise.all([
          getContextObservable(),
          getThemeObservable(),
        ]);

        // Subscribe to changes
        contextUnsubscribe = contextObs.subscribe((context: any) => {
          setState(prevState => ({ ...prevState, context }));
        });

        themeUnsubscribe = themeObs.subscribe((theme: any) => {
          setState(prevState => ({ ...prevState, theme }));
        });

        // Set platform element
        setState(prevState => ({
          ...prevState,
          element: getPlatformElement(),
        }));
      } catch (error) {}
    }

    init();

    // Cleanup on unmount
    return () => {
      contextUnsubscribe?.();
      themeUnsubscribe?.();
    };
  }, [element]);

  return (
    <PlatformContext.Provider value={{ ...state, apiRequest }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}

export default PlatformProvider;
