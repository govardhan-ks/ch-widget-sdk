import { App, inject, reactive } from "vue";
import {
  getContext,
  getTheme,
  apiRequest,
  ApiRequestOptions,
  initPlatform,
} from "widget-sdk-core";

export const platformKey = Symbol("platform");

export function createPlatformPlugin(options?: { element?: HTMLElement }) {
  return {
    install: async (app: App) => {
      const state = reactive<{ context: any; theme: any }>({ 
        context: null as any, 
        theme: null as any 
      });

      // Initialize platform if element is provided (web component mode)
      if (options?.element) {
        await initPlatform({ element: options.element });
      }

      const [context, theme] = await Promise.all([
        getContext(),
        getTheme(),
      ]);
      state.context = context;
      state.theme = theme;

      app.provide(platformKey, {
        ...state,
        apiRequest,
        initPlatform,
      });
    },
  };
}

export function usePlatform() {
  return inject(platformKey);
}
