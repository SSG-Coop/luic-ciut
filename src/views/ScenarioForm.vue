<template>
  <div>
    <!-- STEPPER HEADER ICONS -->
    <v-row no-gutters align-content="space-between" class="ml-4 mr-n4">
      <v-col v-for="(step, index) in steps" :key="index">
        <v-tooltip :text="step.title" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <v-btn
                icon
                variant="flat"
                density="comfortable"
                :disabled="index > completedStep && index !== activeStep"
                :color="stepBtnColor(index)"
                @click="goToStep(index)"
                class="step-btn"
              >
                <v-icon
                  :icon="step.icon"
                  size="small"
                  color="white"
                  class="step-btn-icon"
                ></v-icon>
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <hr
          v-if="index < steps.length - 1"
          length="200"
          class="ml-9 step-divider"
          :class="{ 'step-divider-completed': completedStep >= index }"
        />
      </v-col>
    </v-row>
    <!-- SCENARIO TITLE AND SUMMARY TO SHOW AFTER STEP 1 -->
    <v-slide-y-transition>
      <scenario-header-card
        v-if="activeStep > 0"
        :scenario="scenario"
        class="mt-4 mb-4"
      >
      </scenario-header-card>
    </v-slide-y-transition>
    <!-- STEP FORMS -->
    <v-row
      no-gutters
      v-for="(step, index) in steps"
      :key="index"
      class="pl-4 pt-1"
    >
      <v-slide-x-reverse-transition hide-on-leave>
        <v-col v-show="index === activeStep">
          <h3 class="mt-2">
            <v-icon class="pl-4 pr-6">{{ step.icon }}</v-icon>
            {{ step.title }}
            <span
              v-if="completedStep != -1 && index > 0 && index <= 5"
              class="ml-8"
            >
              <references-info-btn-dialog
                :references="
                  getReferencesForNeighbourhoodType(
                    scenario.neighbourhoodType,
                    step.id
                  )
                "
                :title="`${step.title} Assumptions and References`"
              ></references-info-btn-dialog>
            </span>
          </h3>
          <component
            v-if="'component' in step"
            :is="step.component"
            ref="stepForms"
            :scenario="scenario"
            :ready="completedStep >= index - 1"
            @on-validated="processStep"
            @on-error="showError"
            @clear-error="clearError"
          />
        </v-col>
      </v-slide-x-reverse-transition>
    </v-row>
    <!-- ERROR ALERT -->
    <v-slide-y-reverse-transition>
      <v-alert
        v-if="formError"
        border="start"
        type="warning"
        icon="$exclamationTriangle"
        transition="slide-y-transition"
      >
        {{ $t("forms.errorAlert") }}
      </v-alert>
    </v-slide-y-reverse-transition>
    <!-- BUTTONS -->
    <v-row class="my-4" justify="space-between">
      <v-col cols="auto">
        <v-btn @click="cancel" v-if="activeStep === 0">
          {{ $t("forms.cancel") }}
        </v-btn>
        <v-btn @click="back" v-else> {{ $t("forms.back") }} </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" @click="validateStep(activeStep)">
          {{
            activeStep < steps.length - 1
              ? $t("forms.next")
              : $t("forms.saveToWorksheet")
          }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, defineComponent, markRaw, onBeforeMount, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import scenarioUtils from "@/utils/scenarioUtils.js";
import useExcelUtils from "@/utils/excelUtils.js";
import useNeigbhourhoodTypeUtils from "@/utils/neighbourhoodTypeUtils.js";
import ScenarioHeaderCard from "@/components/ScenarioHeaderCard.vue";
import ReferencesInfoBtnDialog from "@/components/ReferencesInfoBtnDialog.vue";
import ScenarioFormStepInfo from "@/components/ScenarioFormStepInfo.vue";
import ScenarioFormStepBuildings from "@/components/ScenarioFormStepBuildings.vue";
import ScenarioFormStepServices from "@/components/ScenarioFormStepServices.vue";
import ScenarioFormStepInfrastructure from "@/components/ScenarioFormStepInfrastructure.vue";
import ScenarioFormStepTransportation from "@/components/ScenarioFormStepTransportation.vue";
import ScenarioFormStepRevenue from "@/components/ScenarioFormStepRevenue.vue";
import gtagUtils from "@/utils/gtagUtils";

export default defineComponent({
  name: "ScenarioForm",

  components: {
    ScenarioHeaderCard,
    ReferencesInfoBtnDialog,
    ScenarioFormStepInfo,
    ScenarioFormStepBuildings,
    ScenarioFormStepServices,
    ScenarioFormStepInfrastructure,
    ScenarioFormStepTransportation,
    ScenarioFormStepRevenue,
  },

  setup() {
    const { t } = useI18n();
    const scenario = ref({});

    onBeforeMount(() => {
      if (scenarioUtils().getActiveScenario.value !== null) {
        // load scenario data for editing
        scenario.value = { ...scenarioUtils().getActiveScenario.value };
      }
    });

    onMounted(() => {
      // check if loading a saved scenario to edit
      if (scenarioUtils().getActiveScenario.value !== null) {
        for (let i = 0; i < stepForms.value.length; i++) {
          if ("populate" in stepForms.value[i]) {
            stepForms.value[0].populate();
          }
        }
      }
    });

    const steps = ref([
      // the steps in the form
      {
        id: `scenario`,
        title: t("scenario.modules.scenario"),
        icon: "$infoCircle",
        component: markRaw(ScenarioFormStepInfo),
      },
      {
        id: `homes`,
        title: t("scenario.modules.buildings"),
        icon: "$houseBuilding",
        component: markRaw(ScenarioFormStepBuildings),
      },
      {
        id: `services`,
        title: t("scenario.modules.services", 2),
        icon: "$schoolFlag",
        component: markRaw(ScenarioFormStepServices),
      },
      {
        id: `infrastructure`,
        title: t("scenario.modules.infrastructure"),
        icon: "$road",
        component: markRaw(ScenarioFormStepInfrastructure),
      },
      {
        id: `transportation`,
        title: t("scenario.modules.transportation"),
        icon: "$carBus",
        component: markRaw(ScenarioFormStepTransportation),
      },
      {
        id: `revenue`,
        title: t("scenario.modules.revenueLong"),
        icon: "$moneyCheckDollarPen",
        component: markRaw(ScenarioFormStepRevenue),
      },
    ]);

    const stepForms = ref(null);

    const activeStep = ref(0); // currently active step
    const completedStep = ref(-1); // track progress of the wizard steps

    /**
     * get the step button color depending on the status of the step and the current progress
     */
    const stepBtnColor = (index) => {
      if (activeStep.value === index) {
        return `accent`;
      } else if (completedStep.value >= index) {
        return `primary`;
      }
      return null;
    };

    /**
     * move the stepper back
     */
    const back = () => {
      if (activeStep.value > 0) {
        activeStep.value -= 1;
      }
    };

    const goToStep = (index) => {
      activeStep.value = index;
    };

    /**
     * VALIDATION AND SAVING
     */
    const formError = ref(false);

    /**
     * validate form and save if validation passes
     */
    const validateStep = (index) => {
      stepForms.value[index].validate();
    };

    /**
     * set the form error alert on
     */
    const showError = () => {
      formError.value = true;
    };
    /**
     * set the form error alert on
     */
    const clearError = () => {
      formError.value = false;
    };

    /**
     * process the emitted data from a form step
     */
    const processStep = (emitData) => {
      // console.log(`received emitted data:`, emitData);
      // clear any form error message - form must be valid
      formError.value = false;
      scenario.value = { ...scenario.value, ...emitData };
      // save provId if it's the first step
      if (activeStep.value === 0) {
        // console.log(`saving the provId...`, scenario.value.provId);
        scenarioUtils().setProvId(scenario.value.provId);
      }
      // save if it's the last step
      if (activeStep.value === steps.value.length - 1) {
        // console.log(`saving the scenario...`, scenario.value);
        completedStep.value = activeStep.value;
        saveScenario();
      } else {
        // mark step completed
        if (completedStep.value < activeStep.value) {
          completedStep.value += 1;
        }
        // proceed to next step
        activeStep.value += 1;
      }
    };

    const saveScenario = () => {
      // save scenario to store
      scenarioUtils().updateOrCreateScenario(scenario.value);
      // save to worksheet
      // console.log(`scenario is being saved to excel...`);
      useExcelUtils().saveScenarioToWorksheet(scenario.value);
      // analytics tracking
      // label to include 3 fields/values separated by commas: provId, neighbourhoodType, year
      const label = `${scenario.value.provId}, ${scenario.value.neighbourhoodType}, ${scenario.value.year}`;
      gtagUtils().gtagEvent(`save_scenario`, `scenarios`, label);
      // redirect to home page
      router.push({ name: "dashboard" });
    };

    /**
     * cancel and go back to dashboard
     */
    const cancel = () => {
      router.push({ name: "dashboard" });
    };

    return {
      scenario,
      getReferencesForNeighbourhoodType:
        useNeigbhourhoodTypeUtils().getReferencesForNeighbourhoodType,
      steps,
      stepForms,
      activeStep,
      completedStep,
      stepBtnColor,
      back,
      goToStep,
      validateStep,
      formError,
      showError,
      clearError,
      processStep,
      saveScenario,
      cancel,
    };
  },
});
</script>
<style lang="scss" scoped>
.step-btn {
  border: 2px solid white;
}
.step-btn-icon {
  transform: scale(0.9);
}
.step-divider {
  transform: translate(0, -1.1em);
  border: 0;
  border-top: 1px solid #eeeeee; // grey.lighten3
  border-bottom: 1px solid #fff;
}
.step-divider-completed {
  border-top: 1px solid #203564; // primary
}
</style>