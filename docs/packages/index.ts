/* eslint-disable */
import { App, Plugin } from 'vue';

import { ESignPlugin } from './ESign';
const XiPlugin: Plugin = {
  install(app: App) {
    ESignPlugin.install?.(app);
  },
};

export default XiPlugin;

export * from './ESign'