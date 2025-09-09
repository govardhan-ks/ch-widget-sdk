import { App, inject, reactive, type InjectionKey } from "vue";
import {
  getContext,
  getTheme,
  apiRequest,
  initPlatform,
} from "widget-sdk-core";

type Platform = {
  context: any;
  theme: any;
  apiRequest: typeof apiRequest;
  initPlatform: typeof initPlatform;
};

export const platformKey: InjectionKey<Platform> = Symbol("platform");

export function createPlatformPlugin(options?: { element?: HTMLElement }) {
  return {
    install(app: App) {
      const state = reactive<{ context: any; theme: any }>({
        context: null as any,
        theme: null as any,
      });

      let resolveReady: (() => void) | null = null;
      const readyPromise = new Promise<void>((res) => (resolveReady = res));
      let isReady = false;

      const platform: Platform = {
        get context() {
          return state.context;
        },
        get theme() {
          return state.theme;
        },
        apiRequest,
        initPlatform,
        get ready() {
          return isReady;
        },
        whenReady: () => readyPromise,
      };

      app.provide(platformKey, platform);

      (async () => {
        if (options?.element) {
          await initPlatform({ element: options.element });
        }
        const [context, theme] = await Promise.all([getContext(), getTheme()]);
        state.context = context;
        state.theme = theme;
      })();
    },
  };
}

export function usePlatform(): Platform {
  return (
    inject(platformKey) ?? {
      context: null,
      theme: null,
      apiRequest,
      initPlatform
    }
  );
}