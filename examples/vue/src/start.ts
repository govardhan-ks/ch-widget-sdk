import '../../shared/dev-mock';
import { createApp } from 'vue';
import { createPlatformPlugin, usePlatform } from 'widget-sdk-vue';
import App from './root-app.vue';

export async function start(shadowRoot: ShadowRoot) {
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const app = createApp(App);
  app.use(createPlatformPlugin({element: mount}));
  const platform: any = usePlatform();
  await platform.whenReady(); 
  
  app.mount(mount);
}


