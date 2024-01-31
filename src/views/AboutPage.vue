<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-alert
          border="start"
          type="info"
          icon="$infoCircle"
          transition="slide-y-transition"
          class="text-body-2 mb-8"
        >
        {{  $t("pages.about.betaMsg") }}
        </v-alert>
        <h2>{{  $t("pages.about.title") }}</h2>
        <p><span class="font-weight-bold">{{  $t("appInfo.version") }}: {{ uiVersion }}</span></p>
        <p class="mb-4"><span class="text-caption font-italic">{{  $t("appInfo.lastUpdated") }}: {{ uiDate }}</span></p>
        <div v-html="$t('pages.about.html')"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <h3>{{  $t("pages.about.supportedBy") }}</h3>
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-img
              :src="getImageUrl(`FCM-logo-2018-col_en_0.svg`)"
              v-bind="props"
              max-width="250"
              max-height="200"
              contain
              :alt="$t('pages.about.fcm')"
              class="mx-auto my-6"
            />
            <v-img
              :src="getImageUrl(`GMF_Colour_EN_RGB.jpg`)"
              v-bind="props"
              max-width="250"
              max-height="200"
              contain
              :alt="$t('pages.about.fcm')"
              class="mx-auto my-6"
            />
          </template>
          <span>{{  $t("pages.about.fcm") }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <h4>{{  $t("pages.about.developedBy") }}</h4>
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <a
              href="https://ssg.coop"
              title="Sustainability Solutions Group"
              target="_blank"
            >
              <v-img
                :src="getImageUrl(`ssg-logo.png`)"
                v-bind="props"
                max-width="270"
                max-height="270"
                contain
                alt="Sustainability Solutions Group"
                class="mx-auto my-4"
              />
            </a>
          </template>
          <span>Sustainability Solutions Group</span>
        </v-tooltip>
        <p class="text-caption">
          {{  $t("pages.about.moreInfo") }}<br />
          <a href="mailto:luic-ciut@ssg.coop" :title="$t('general.email')"
            >luic-ciut@ssg.coop</a
          >
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, inject, computed } from "vue";
import genericUtils from "@/utils/genericUtils";
import { useUserStore } from "@/store/user.js";

export default defineComponent({
  name: "AboutPage",

  components: {},

  setup() {
    const uiVersion = inject('uiVersion');
    const currentLocale = computed(() => {
      return useUserStore().getCurrentLocale;
    })
    const uiDate = new Date(inject('uiDate')).toLocaleDateString(currentLocale.value, { month: 'long', day: 'numeric', year: 'numeric' }) ;
    return {
      getImageUrl: genericUtils().getImageUrl,
      uiVersion,
      uiDate
    };
  },
});
</script>
<style lang="scss" scoped>
</style>