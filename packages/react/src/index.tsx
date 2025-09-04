import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getContext,
  getTheme,
  apiRequest,
  initPlatform,
  getPlatformElement
} from "widget-sdk-core";

type PlatformState = {
  context: any;
  theme: any;
  element: HTMLElement | null;
};

const PlatformContext = createContext<any>(null);

export function PlatformProvider({ 
  children, 
  element 
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
    async function init() {
      // Initialize platform if element is provided (web component mode)
      if (element) {
        await initPlatform({ element });
      }
      
      const [context, theme] = await Promise.all([
        getContext(),
        getTheme(),
      ]);
      setState({ context, theme, element: getPlatformElement() });
    }
    void init();
  }, [element]);

  return (
    <PlatformContext.Provider
      value={{ ...state, apiRequest, initPlatform }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}

export default PlatformProvider;

