/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
// loadFonts, vuetify, pinia, router, FontAwesomeIcon, i18n, awsExportsPlugin
import { registerPlugins } from "@/plugins";

/**
 * loadOffice
 * This function loads the current version of the office apis from Microsoft's CDN.
 * this needs to be loaded here instead of in index.html because of bug/conflict with office.js and router
 * the function fixes the issue of office.js nullifying the window history
 * for more info see: https://github.com/OfficeDev/office-js/pull/2808
 */
let promise = null;
const loadOffice = async () => {
  const replaceState = window.history.replaceState;
  const pushState = window.history.pushState;

  if (!promise) {
    promise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://appsforoffice.microsoft.com/lib/1/hosted/office.js";
      script.onload = () => {
        window.Office.onReady(() => {
          window.history.replaceState = replaceState;
          window.history.pushState = pushState;

          resolve();
        });
      };
      document.head.appendChild(script);
    });
  }
  return promise;
};
loadOffice();

const app = createApp(App);

// provide globals
app.provide("appName", import.meta.env.VITE_APP_TITLE);
app.provide("environment", import.meta.env.VITE_APP_ENVIRONMENT);
app.provide("uiVersion", import.meta.env.VITE_APP_UI_VERSION);
app.provide("uiDate", import.meta.env.VITE_APP_UI_DATE);
// additional globals provided in plugins

registerPlugins(app);

app.mount("#app");
