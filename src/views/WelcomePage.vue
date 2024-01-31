<template>
  <div>
    <v-row>
      <v-col class="text-right">
        <v-btn text @click="skip">
          {{ $t("forms.skip") }}
          <v-icon small>$chevronRight</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-carousel
          v-model="slideNum"
          height="700"
          :continuous="false"
          hide-delimiter-background
          light
          delimiter-icon="$circleSmall"
          :show-arrows="false"
          next-icon="$angleRight"
          prev-icon="$angleLeft"
          class="mb-2 pb-2"
        >
          <v-carousel-item>
            <v-img
              :src="getImageUrl(`5304_FCM_EnvironmentalImpactsIcons_LandReclaimed_Final.png`)"
              max-width="120"
              max-height="120"
              contain
              :alt="$t('appInfo.appTitle')"
              class="mt-12 mx-auto mb-6"
            />
            <h1 class="text-center">{{ $t("pages.welcome.title") }}</h1>
            <div v-html="$t('pages.welcome.slide1html')"></div>
          </v-carousel-item>
          <v-carousel-item>
            <v-img
              :src="getImageUrl(`5304_FCM_EnvironmentalImpactsIcons_LandReclaimed_Final.png`)"
              max-width="120"
              max-height="120"
              contain
              :alt="$t('appInfo.appTitle')"
              class="mt-12 mx-auto mb-6"
            />
            <div v-html="$t('pages.welcome.slide2html')"></div>
          </v-carousel-item>
          <v-carousel-item>
            <v-img
              :src="getImageUrl(`new_scenario.gif`)"
              max-width="380"
              max-height="300"
              contain
              :alt="$t('appInfo.appTitle')"
              class="mt-12 mx-auto mb-6"
            />
            <div v-html="$t('pages.welcome.slide3html')"></div>
          </v-carousel-item>
          <v-carousel-item>
            <v-img
              :src="getImageUrl(`scenario_details.png`)"
              max-width="380"
              max-height="300"
              contain
              alt="Create a new project"
              class="mx-auto my-6"
            />
            <div v-html="$t('pages.welcome.slide4html')"></div>
          </v-carousel-item>
          <v-carousel-item>
            <v-img
            :src="getImageUrl(`scenarios_summary.png`)"
              max-width="380"
              max-height="300"
              contain
              alt="project worksheet"
              class="mx-auto my-6"
            />
            <div v-html="$t('pages.welcome.slide5html')"></div>
          </v-carousel-item>
          <v-carousel-item>
            <div v-html="$t('pages.welcome.slide6html')"></div>
            <div class="text-center mt-8">
              <v-btn color="success" class="mt-8" @click="newScenario()">
                <icon-add-item icon="$calculator" />
                {{ $t("scenario.newScenario") }}
              </v-btn>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="6" class="text-left">
        <v-btn v-if="slideNum !== firstSlide" @click="prev">
          <v-icon small>$chevronLeft</v-icon> {{ $t("forms.prev") }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn v-if="slideNum !== lastSlide" @click="next">
          {{ $t("forms.next") }} <v-icon small>$chevronRight</v-icon>
        </v-btn>
        <v-btn v-if="slideNum === lastSlide" @click="skip"> {{ $t("forms.done") }} </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";
import router from "@/router";
import { ref } from "vue";
import appConfig from "@/config/appConfig";
import { useUserStore } from "@/store/user.js";
import scenarioUtils from "@/utils/scenarioUtils.js";
import IconAddItem from "@/components/IconAddItem.vue";
import genericUtils from "@/utils/genericUtils";

export default defineComponent({
  name: "WelcomePage",

  components: { IconAddItem },

  setup() {
    const slideNum = ref(0);
    const firstSlide = 0;
    const lastSlide = 5;
    const skip = () => {
      useUserStore().$patch({
        latestIntroViewed: appConfig().latestIntroAvailable,
      });
      router.push({ name: "dashboard" });
    };
    const prev = () => {
      if (slideNum.value > firstSlide) {
        slideNum.value--;
      }
    };
    const next = () => {
      if (slideNum.value < lastSlide) {
        slideNum.value++;
      }
    };
    const newScenario = () => {
      // user has seen the intro
      useUserStore().$patch({
        latestIntroViewed: appConfig().latestIntroAvailable,
      });
      // set active project to null and navigate to project form
      scenarioUtils().setActiveScenario(null);
      router.push({ name: "scenario_edit" });
    };
    return {
      slideNum,
      firstSlide,
      lastSlide,
      skip,
      prev,
      next,
      newScenario,
      getImageUrl: genericUtils().getImageUrl,
    };
  },
});
</script>
<style lang="scss" scoped>
// override some stepper css
:deep(.v-carousel__controls__item)  {
  margin: 0 3px;
}
</style>
