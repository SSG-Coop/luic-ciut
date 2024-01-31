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

export function registerPlugins (app) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(awsExportsPlugin)
    app.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
    app.config.globalProperties.$t = i18n.global.t
}
