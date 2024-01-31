// © Copyright 2023, LUIC-CIUT's Contributors
// this plugin provides aws-exports setting to the app globally
// NOTE THE DEV VS PROD CONFIG FOLDERS ARE HARD-CODED HERE
// rather than pulling from the .env.dev and .env.prod files due to struggles loading imports dynamically in VITE
// import awsExportsDev from `@${import.meta.env.VITE_APP_CONFIG_ROOT}aws-exports.js`; // DOESN'T WORK
import awsExportsDev from "@/config/dev/aws-exports.js";
import awsExportsProd from "@/config/prod/aws-exports.js";

export default {
  install(app) {
    if (import.meta.env.PROD) {
      app.provide("WebformMailer", awsExportsProd.webform_mailer);
      app.provide("WebformMailerKey", awsExportsProd.webform_mailer_key);
    } else {
      // dev
      app.provide("WebformMailer", awsExportsDev.webform_mailer);
      app.provide("WebformMailerKey", awsExportsDev.webform_mailer_key);
    }
  },
};

