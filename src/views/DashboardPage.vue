<template>
  <div>
    <div v-if="numScenarios > 0">
      <h2>{{ $t("pages.dashboard.myScenarios") }}</h2>
      <v-slide-y-transition group>
        <scenario-details-card
          v-for="(item, index) in myScenarios"
          :key="`scenario${index}`"
          :scenario="item"
          class="my-2"
          @snackbar="setSnackbar"
        ></scenario-details-card>
      </v-slide-y-transition>
    </div>
    <div v-else>
      <v-img
        :src="getImageUrl(`5304_FCM_EnvironmentalImpactsIcons_LandReclaimed_Final.png`)"
        max-width="120"
        max-height="120"
        contain
        :alt="$t('appInfo.appTitle')"
        class="mx-auto my-6"
      />
    </div>
    <div class="text-center">
      <v-btn color="secondary" class="mt-8" @click="newScenario()">
        <icon-add-item icon="$calculator" />
        {{ $t("scenario.newScenario") }}
        <v-tooltip activator="parent" location="top">
          {{ $t("scenario.newScenarioTooltiop") }}
        </v-tooltip>
      </v-btn>
      <v-snackbar v-model="snackbar" :timeout="2000" app>
        {{ snackbarMsg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            {{ $t("forms.close") }}
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-dialog v-model="showWidthAdjustTip" persistent absolute>
      <v-card>
        <v-card-text>
          <v-container fill-height>
            <v-row align="center" no-gutters>
              <v-col cols="3">
                <v-icon class="bounce ml-6">$arrowLeft</v-icon>
              </v-col>
              <v-col cols="9">
                <div class="float-left">
                  <v-icon large class="mt-1 mr-2 yellow--text text--darken-3"
                    >$lightbulb</v-icon
                  >
                </div>
                <div>
                  <h3>{{ $t("pages.dashboard.resizeTitle") }}</h3>
                </div>
                <p class="pt-2">
                  {{ $t("pages.dashboard.resizeMsg") }}
                </p>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn
                  @click="closeShowWidthAdjustTip()"
                  class="text-center secondary mt-6"
                >
                  {{ $t("forms.ok") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import router from "@/router";
import { ref, onBeforeMount, onMounted, defineComponent } from "vue";
import appConfig from "@/config/appConfig";
import IconAddItem from "@/components/IconAddItem.vue";
import ScenarioDetailsCard from "@/components/ScenarioDetailsCard.vue";
import scenarioUtils from "@/utils/scenarioUtils.js";
import { useUserStore } from "@/store/user.js";
import genericUtils from "@/utils/genericUtils";
// for testing and development vvvvvv
import useExcelUtils from "@/utils/excelUtils.js";
import exampleScenarios from "@/sampleData/scenario.js";
// for testing and development ^^^^^^

export default defineComponent({
  name: "DashboardPage",
  components: {
    IconAddItem,
    ScenarioDetailsCard,
  },
  setup() {
    // snackbar
    const snackbar = ref(false);
    const snackbarMsg = ref("");
    const setSnackbar = (msg) => {
      snackbarMsg.value = msg;
      snackbar.value = true;
    };

    // launch welcome screen if it hasn't been seen
    onBeforeMount(() => {
      if (
        useUserStore().getLatestIntroViewed !== appConfig().latestIntroAvailable
      ) {
        router.push({ name: "welcome" });
      }
    });

    // does user know they can adjust the width?
    const showWidthAdjustTip = ref(false);
    onMounted(() => {
      if (
        !useUserStore().getWidthAdjustTipViewed &&
        window.visualViewport.width < 450
      ) {
        setTimeout(() => {
          showWidthAdjustTip.value = true;
        }, 2000);
      }
    });
    const closeShowWidthAdjustTip = () => {
      showWidthAdjustTip.value = false;
      useUserStore().$patch({ widthAdjustTipViewed: true });
    };

    const newScenario = () => {
      // set active scenario to null and navigate to scenario form
      scenarioUtils().setActiveScenario(null);
      router.push({ name: "scenario_edit" });
    };

    // for testing and development
    const testWorkbook = () => {
      console.log(`writing data to workbook....`);
      const _scen = exampleScenarios().TODV1;
      useExcelUtils().saveScenarioToWorksheet(_scen);
      // useExcelUtils().saveScenarioToWorksheet(_scen);
    };

    return {
      myScenarios: scenarioUtils().getScenarios,
      numScenarios: scenarioUtils().numScenarios,
      deleteScenario: scenarioUtils().deleteScenario,
      deleteAllScenarios: scenarioUtils().deleteAllScenarios,
      newScenario,
      snackbar,
      snackbarMsg,
      setSnackbar,
      showWidthAdjustTip,
      closeShowWidthAdjustTip,
      getImageUrl: genericUtils().getImageUrl,
      testWorkbook,
    };
  },
});
</script>
<style lang="scss" scoped>
.bounce {
  -moz-animation: bounce 2s infinite;
  -webkit-animation: bounce 2s infinite;
  animation: bounce 5s infinite;
}
@keyframes bounce {
  0%,
  10%,
  25%,
  40%,
  50% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-30px);
  }
  30% {
    transform: translateX(-15px);
  }
}
</style>
