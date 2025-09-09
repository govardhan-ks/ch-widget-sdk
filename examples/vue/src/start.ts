import { createApp } from 'vue';
import { createPlatformPlugin, usePlatform } from 'widget-sdk-vue';
import RootApp from './root-app.vue';

export async function start(shadowRoot: ShadowRoot) {
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const app = createApp(RootApp);
  app.use(createPlatformPlugin({element: mount}));
  const platform: any = usePlatform();
  await platform.whenReady(); 
  
  app.mount(mount);
}


