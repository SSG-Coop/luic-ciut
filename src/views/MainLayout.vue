<template>
  <v-app>
    <div>
      <v-app-bar app color="primary">
        <v-app-bar-nav-icon>
          <v-icon>$calculator</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="ml-0">{{ title }}</v-toolbar-title>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon dark>
              <v-icon>$ellipsisV</v-icon>
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item :to="{ path: '/dashboard' }">
              <template v-slot:prepend>
                <v-icon>$listUl</v-icon>
              </template>
              <v-list-item-title>{{  $t("navigation.dashboard") }}</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ path: '/welcome' }">
              <template v-slot:prepend>
                <v-icon>$galleryThumbnails</v-icon>
              </template>
              <v-list-item-title>{{  $t("navigation.welcome") }}</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ path: '/help' }">
              <template v-slot:prepend>
                <v-icon>$circleQuestion</v-icon>
              </template>
              <v-list-item-title>{{  $t("navigation.help") }}</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ path: '/about' }">
              <template v-slot:prepend>
                <v-icon>$infoCircle</v-icon>
              </template>
              <v-list-item-title>{{  $t("navigation.about") }}</v-list-item-title>
            </v-list-item>
            <div v-for="locale in Object.keys(supportedLocales)" :key="locale">
              <v-list-item v-show="currentLocale !== locale" @click="changeLocale(locale)">
                <template v-slot:prepend>
                  <v-icon>$globe</v-icon>
                </template>
                <v-list-item-title>{{ supportedLocales[locale] }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main id="main" class="content">
        <!-- the router view -->
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import supportedLocales from "@/locales/supportedLocales";
import router from "@/router";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user.js";
import { useScenarioStore } from "@/store/scenario.js";
import useExcelUtils from "@/utils/excelUtils.js";

export default defineComponent({
  name: "MainLayout",

  components: {},

  // setup(props, context) {
  setup() {
    const i18n = useI18n();

    onMounted(() => {
      // make sure the workbook map is up to date
      useExcelUtils().generateWorkbookMap();
    });

    // scenario store
    const scenario = useScenarioStore();
    // access the router for reactively changing the title
    // const router = reactive(context.root.$router);
    const currRoute = reactive(useRoute());
    const title = computed(() => {
      let _title = i18n.t(`navigation.${currRoute.name}`);
      if (
        ["scenario_edit"].includes(currRoute.name) &&
        scenario.getActiveScenario == null
      ) {
        _title = i18n.t(`scenario.newScenario`);
      }
      return _title;
    });
    // navigtion & menu stuff
    const navGroup = ref(null);
    const currentLocale = computed(() => {
      return useUserStore().getCurrentLocale;
    })
    const changeLocale = (newLocale) => {
      useUserStore().$patch({ currentLocale: newLocale });
      i18n.locale.value = newLocale;
    }

    return {
      title,
      navGroup,
      supportedLocales,
      currentLocale,
      changeLocale,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>