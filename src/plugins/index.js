/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import i18n from './i18n'
import awsExportsPlugin from './aws-exports-plugin.js'

// google analytics
import VueGtag from 'vue-gtag';

// Register plugins with the app
export function registerPlugins (app) {
  loadFonts()

  // google analytics if enabled
  if (import.meta.env.VITE_USE_GTAG === 'true') {
    app.use(VueGtag, {
      config: { id: import.meta.env.VITE_GTAG_ID }
    }, router)
  }

  // other plugins
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(awsExportsPlugin)
    app.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
    app.config.globalProperties.$t = i18n.global.t
}
