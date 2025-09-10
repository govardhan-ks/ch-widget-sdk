import { App, inject, reactive, type InjectionKey } from "vue";
import {
  apiRequest,
  initPlatform,
  getContextObservable,
  getThemeObservable,
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

      const platform: Platform = {
        get context() {
          return state.context;
        },
        get theme() {
          return state.theme;
        },
        apiRequest,
        initPlatform
      };

      app.provide(platformKey, platform);

      (async () => {
        // Initialize platform
        await initPlatform(options?.element ? { element: options.element } : undefined);
        
        // Subscribe to observables
        const [contextObs, themeObs] = await Promise.all([
          getContextObservable(),
          getThemeObservable()
        ]);

        contextObs.subscribe((context: any) => { state.context = context; });
        themeObs.subscribe((theme: any) => { state.theme = theme; });
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