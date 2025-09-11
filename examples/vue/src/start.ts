import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import RootApp from './root-app.vue';

export async function start(element: HTMLElement) {
  const app = createApp(RootApp);
  app.use(createPlatformPlugin({ element }));
  app.mount(element);
}


