// Vue iframe entry point - similar to React main.tsx
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import RootApp from './root-app.vue';

const app = createApp(RootApp);

// Use the platform plugin for iframe context (no element needed for iframe)
app.use(createPlatformPlugin());

// Mount the app to the root element for iframe usage
app.mount('#app');
