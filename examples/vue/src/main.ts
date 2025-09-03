import { createApp } from 'vue';
import '../../shared/dev-mock';
import { createPlatformPlugin } from 'widget-sdk-vue';
import App from './root-app.vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');


