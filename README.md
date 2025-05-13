# Land Use Impact Calculator (LUIC) / Calculatrice d'impacts de l'usage du territoire (CIUT)

This project contains logic and data for the Land Use Impact Calculator (LUIC) / Calculatrice d'impacts de l'usage du territoire (CIUT).

<div style="text-align: center;">
  <img src="src/assets/Icon_budgeting.svg" width="300" alt="text">
</div>

## About
The Land Use Impact Calculator (LUIC) is a Microsoft Office Add-In for Excel. It is intended to provide users with a tool to explore the potential impacts of proposed residential developments in terms of GHG emissions produced, infrastructure capital costs incurred, and municipal revenues collected. The Calculator allows comparisons of these elements between different residential development scenarios for low-density, transit-oriented, and urban infill development types.

Model input assumptions—including energy sources, emissions factors, building codes, travel behaviours, etc.—use provincial values. These can be replaced with user assumptions.

## About this repository

This code repository and the following instructions are intended for a developer audience. The repository is intended to make the logic and code behind LUIC transparent and open source. 

If you simply want to use the LUIC tool, you DO NOT need to install and setup this repository as described below.  Instead, simply install the latest version of the Excel Add-in via the Microsoft AppSource store. __The latest version of the tool can be [viewed here](https://luic-ciut.ssg.coop/), and downloaded from the AppSource store [here](https://appsource.microsoft.com/en-US/product/office/WA200005582).__ 

## License
This project is made available under GPL 3 license. See `LICENSE`.

## Technical Setup
This project is built using [Javascript](https://developer.mozilla.org/en-US/docs/Web/javascript), the [Microsoft Office Excel Javascript API](https://learn.microsoft.com/en-us/office/dev/add-ins/reference/overview/excel-add-ins-reference-overview?view=excel-js-preview), [Vue 3](https://vuejs.org/) and [NPM](https://www.npmjs.com/).

**This has been compiled and tested using Node Version 18.13.0.**

Core NPM packages include:
- [Vuetify](https://vuetifyjs.com/en/)
- [vite](https://vitejs.dev/)
- [Vue I18n](https://vue-i18n.intlify.dev/)
- [Fontawesome](https://fontawesome.com/) (the project uses Fontawesome Pro icons and requires a Fontawesome license key to install)

Take a look at `package.json` for a complete list of packages used in this project.

### Web Form Mailer
The tool also features a web form mailer on the help screen which requires the ability to send and receive form requests and responses to an external resource. The project has been set up to use a web mailer using Amazon AWS cloud services based on this [terraform-aws-contact-form-mailer project](https://github.com/DJAndries/terraform-aws-contact-form-mailer).

## Project Files & Directories
```
📂 luic-ciut/
  ├── 📂 dist/ - compiled files (not included in git)
  ├── 📂 node_modules/ - npm packages and dependencies (not included in git)
  ├── 📂 public/ - static assets not handled by webpack
  ├── 📂 src/
  │   ├── 📂 assets/ - images and assets bundled by webpack
  │   ├── 📂 components/ - vue component files
  │   ├── 📂 config/ - configuration settings including default assumptions data and references
  │   ├── 📂 customIcons/ - svg images used as vue components
  │   ├── 📂 locales/ - i18n dictionaries and settings
  │   ├── 📂 plugins/ - vue plugins
  │   ├── 📂 router/ - page/view routes
  │   ├── 📂 sampleData/ - sample scenario data objects for testing
  │   ├── 📂 store/ - pinia state store setup
  │   ├── 📂 styles/ - scss and css customizations
  │   ├── 📂 utils/ - js utility modules and functions
  │   ├── 📂 views/ - vue single file components that are used for main views/pages
  │   ├── 📄 App.vue - main vue app setup
  │   └── 📄 main.js - main js entry point initializes MS Office module and Vue app
  ├── 📄 .env.dev ⚙️ - development environment settings
  ├── 📄 .env.prod ⚙️ - production environment settings
  ├── 📄 .envrc 🔒 - secure environment settings (create using .envrc-example)
  ├── 📄 index.html 🌐 - main html entry point for published app
  ├── 📄 README.md 📚
  └── 📄 package.json 📦 - contains project metadata and dependencies
```

## Quick Start Guide 🚀

### Installing development environment and setting up dependencies

1. For consistency, use [direnv](https://direnv.net/) to set local env variables (like the fontawesome key), and [NVM](https://github.com/nvm-sh/nvm) (Can also be installed with [homebrew](https://medium.com/devops-techable/how-to-install-nvm-node-version-manager-on-macos-with-homebrew-1bc10626181)) or [NVM for windows](https://github.com/coreybutler/nvm-windows) to set the node version being used.
__This project is currently setup using NODE version 18.13.0.__
2. An `.envrc` file is used to load environment variables to the local dev environment. Be sure you have set one up using the `.envrc-example` file and have entered all of the applicable variables (so far only the fontawesome key).
_(Fontawesome is installed with pro icons. A license key is required to access these libraries)._
3. setup `aws-exports.js` files using the examples in `/src/config/dev/aws-exports_example.js` and  `/src/config/prod/aws-exports_example.js`. If you do not need to use the contact form, the project will run locally with dummy values as long as your create the files as noted.
4. install dependencies

```bash
npm install
```

If building on mac arm64 architecture run `npm install --target_arch=x64`. Make sure Python 2.7 ins the current python version.

### Run Local Development Server

```bash
npm run dev
```

### Developing In Excel
Depending on your setup, you may find it helpful to install [vue devtools](https://devtools.vuejs.org/guide/installation.html#standalone). The project has been configured so that Vite includes `<script src="http://localhost:8098"></script>` in the `<head>` section of  `index.html` for the `dev` environment.

* Start a 2nd terminal session
* leave vite `npm run dev` running in one terminal
* launch `vue-devtools` in a second terminal* 
* right click on the add-in panel in excel to launch developer tools connected to the browser
* vue-devtools should be connected and available through the developer tools console commands

Developers using Mac should also look at [these notes](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/debug-office-add-ins-on-ipad-and-mac) to ensure the safari developer tools are enabled.


### Compile and minify for production

```bash
npm run build
```

## Loading the Add-In in Excel
To use this project as a javascript Add-In for Excel, the project must either be [sideloaded](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing), your version must be published to the [Microsoft AppSource Store](https://appsource.microsoft.com/), or you can use the latest version of the tool already published to the AppSource store by Sustainability Solutions Group.

__The latest version of the tool can be [viewed here](https://luic-ciut.ssg.coop/), and downloaded from the AppSource store [here](https://appsource.microsoft.com/en-US/product/office/WA200005582).__

## Project Supporters
This project is supported by the [Green Municipal Fund](https://greenmunicipalfund.ca/), a program of [Federation of Canadian Municipalities](https://fcm.ca/en).

<div style="text-align: center;">
  <img src="src/assets/FCM-logo-2018-col_en_0.svg" width="400" alt="Federation of Canadian Municipalities">
</div>

<div style="text-align: center;">
  <img src="src/assets/GMF_Colour_EN_RGB.jpg" width="400" alt="Green Municipal Fund">
</div>


This projected is developed and maintained by [Sustainability Solutions Group](https://ssg.coop)

<div style="text-align: center;">
  <img src="src/assets/SSG_Logotype_Black.png" width="400" alt="SSG">
</div>


## Documentation and Support
Please visit [https://luic-ciut.ssg.coop/](https://luic-ciut.ssg.coop/) for more documentation and support information.
