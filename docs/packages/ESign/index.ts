import { App, Plugin } from 'vue';
import ESign from './src/index.vue';

export const ESignPlugin: Plugin = {
  install(app: App) {
    app.component('ESign', ESign);
    
  },
};

export {
  ESign,
};
