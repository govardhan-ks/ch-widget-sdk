import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUser,
  getSettings,
  getCommunity,
  applyThemeVariables,
  fetchPlatformData,
} from "widget-sdk-core";

type PlatformState = {
  user: any;
  settings: any;
  community: any;
};

const PlatformContext = createContext<any>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlatformState>({
    user: null,
    settings: null,
    community: null,
  });

  useEffect(() => {
    async function init() {
      const [user, settings, community] = await Promise.all([
        getUser(),
        getSettings(),
        getCommunity(),
      ]);
      setState({ user, settings, community });
    }
    void init();
  }, []);

  return (
    <PlatformContext.Provider
      value={{ ...state, applyThemeVariables, fetchPlatformData }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}

export default PlatformProvider;

