import '../../shared/dev-mock';
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import App from './root-app.vue';

export async function start(shadowRoot: ShadowRoot) {
  const host = shadowRoot.host as HTMLElement;
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const app = createApp(App);
  app.use(createPlatformPlugin());
  app.mount(mount);
}


