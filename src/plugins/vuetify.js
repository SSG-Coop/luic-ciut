/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import 'vuetify/styles'

// colors
import colors from "vuetify/lib/util/colors";

// fontawesome libraries and settings
import { aliases, fa } from "@/plugins/fontAwesome";
// custom icon
import luiCalculator from '@/customIcons/LuicIcon.vue';

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          // vuetify color definitions can be found here: https://vuetifyjs.com/en/styles/colors/#material-colors
          primary: "#008942",
          secondary: "#16B4D8",
          accent: "#AFE028",
          error: colors.red.darken4,
          caution: colors.yellow.darken1,
          warning: colors.deepOrange.darken4,
          success: "#16B4D8",
          info: "#16B4D8",
          lightBg: colors.grey.lighten5,
          greyText: colors.grey.darken2,
        },
      },
    },
  },
  // icons: CUSTOM_ICONS,
  icons: {
    defaultSet: 'fa',
    aliases: { ...aliases, luiCalculator },
    sets: {
      fa,
    }
  },
})
