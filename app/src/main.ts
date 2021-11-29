import { createApp } from 'vue';
import App from './App.vue';

import { createChisana } from '../../lib/src/index';

const chisana = createChisana();

const app = createApp(App);

app.use(chisana);

app.mount('#app');
