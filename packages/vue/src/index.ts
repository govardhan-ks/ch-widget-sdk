import { App, inject, reactive } from "vue";
import {
  getUser,
  getSettings,
  getCommunity,
  applyThemeVariables,
  fetchPlatformData,
} from "widget-sdk-core";

export const platformKey = Symbol("platform");

export function createPlatformPlugin() {
  return {
    install: async (app: App) => {
      const state = reactive<{ user: any; settings: any; community: any }>({ user: null as any, settings: null as any, community: null as any });

      const [user, settings, community] = await Promise.all([
        getUser(),
        getSettings(),
        getCommunity(),
      ]);
      state.user = user;
      state.settings = settings;
      state.community = community;

      app.provide(platformKey, {
        ...state,
        applyThemeVariables,
        fetchPlatformData,
      });
    },
  };
}

export function usePlatform() {
  return inject(platformKey);
}
