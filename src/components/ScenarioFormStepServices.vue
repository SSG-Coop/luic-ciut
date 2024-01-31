<template>
  <div class="my-4 mr-4">
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-if="ready" v-model="panels">
          <v-expansion-panel
            v-for="(item, index) in services"
            :key="item.id"
            elevation="0"
            bg-color="lightBg"
            eager
          >
            <v-expansion-panel-title
              expand-icon="$caretDown"
              collapse-icon="$caretUp"
              :color="panelErrors.includes(index) ? `warning` : ``"
            >
              {{ item.name }}
              <v-chip class="ml-2">{{ item.qty }} {{ item.units }}</v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <keep-alive>
                <service-type-input-card
                  :service-type="item.id"
                  :qty="item.qty"
                  :capCostInt="item.capCostInt"
                  :maintCostInt="item.maintCostInt"
                  ref="serviceForms"
                  @on-validated="clearPanelError(index, true)"
                ></service-type-input-card>
              </keep-alive>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, watch, defineComponent } from "vue";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";
import servicesConfig from "@/config/services.js";
import ruleUtils from "@/utils/ruleUtils.js";
import scenarioUtils from "@/utils/scenarioUtils";
import ServiceTypeInputCard from "@/components/ServiceTypeInputCard.vue";

export default defineComponent({
  name: "ScenarioFormStepServices",

  props: {
    scenario: {
      type: Object,
      required: true,
    },
    ready: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    ServiceTypeInputCard,
  },

  emits: ["on-validated", "on-error", "clear-error"],

  setup(props, { emit }) {
    const serviceForms = ref(null);

    const panels = ref([0]); // set the first panel open automatically
    const panelErrors = ref([]); // track panels with errors
    const neighbourhoodType =
      "neighbourhoodType" in props.scenario
        ? ref(props.neighbourhoodType)
        : ref("");

    const services = ref([]);

    const getChipUnits = (units) => {
      // converts service cost units into units to display on chips
      // example getChipUnits("$/student") returns "student"
      return units.split("$/")[1];
    };

    /**
     * setup the services array which will track inputs for each home type
     */
    const initServices = () => {
      if (
        "neighbourhoodType" in props.scenario
      ) {
        neighbourhoodType.value = props.scenario.neighbourhoodType;
        const neighbourhoodTypeObj =
          neighbourhoodTypesConfig().neighbourhoods[
            props.scenario.neighbourhoodType
          ].sectorDefaults;
        const _services = neighbourhoodTypeObj.services;
        // setup services array
        services.value = [];
        if ("services" in props.scenario) {
          // get the data from previously saved scenario
          Object.keys(props.scenario.services).forEach((serviceType) => {
            services.value.push({
              id: serviceType,
              name: servicesConfig().serviceTypes[serviceType].name,
              qty:
                neighbourhoodTypeObj.services[serviceType] *
                neighbourhoodTypesConfig().totalHomesForNeighbourhood(
                  props.scenario.buildings
                ),
              units: `${
                servicesConfig().serviceTypes[serviceType].units.split("$/")[1]
              }s`,
              capCostInt: props.scenario.services[serviceType].capCostIntensity,
              maintCostInt:
                props.scenario.services[serviceType].maintCostIntensity,
            });
          });
        } else {
          // reset services for new scenario
          Object.keys(_services).forEach((serviceType) => {
            services.value.push({
              id: serviceType,
              name: servicesConfig().serviceTypes[serviceType].name,
              qty:
                neighbourhoodTypeObj.services[serviceType] *
                neighbourhoodTypesConfig().totalHomesForNeighbourhood(
                  props.scenario.buildings
                ),
              units: `${
                servicesConfig().serviceTypes[serviceType].units.split("$/")[1]
              }s`,
              capCostInt: null,
              maintCostInt: null,
            });
          });
        }
      }
    };

    watch(
      () => props.scenario,
      () => {
        if (props.ready) {
          initServices();
        }
      }
    );

    // watch for upstream changes to scenario that require re-calculating dwellings counts
    watch(
      scenarioUtils().getScenarioToggle,
      () => {
        if (props.ready) {
          initServices();
        }
      }
    );

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();
    const submitted = ref(false);

    /**
     * validate form and emit data if validation passes
     */
    const validate = () => {
      validateSubForms().then((results) => {
        results.forEach((result, index) => {
          if (!result.valid) {
            if (!panelErrors.value.includes(index)) {
              // add it to list of errors if not already there
              panelErrors.value.push(index);
            }
          } else {
            // clear error if it was previously set
            clearPanelError(index);
          }
        });
        // invalidate if there are any errors
        valid.value = panelErrors.value.length ? false : true;
        if (valid.value === true) {
          emitData();
        } else {
          submitted.value = true;
          emit("on-error");
        }
      });
    };

    const validateSubForms = () => {
      const formValidations = [];
      serviceForms.value.forEach((_form) => {
        formValidations.push(_form.validate());
      });
      return Promise.all(formValidations);
    };

    const clearPanelError = (index, updateMainError = false) => {
      // clear error if it was previously set
      panelErrors.value = panelErrors.value.filter((idx) => idx !== index);
      if (updateMainError) {
        // also clear the entire form if no more panel errors
        valid.value = panelErrors.value.length ? false : true;
        if (valid.value === true) {
          emit("clear-error");
        }
      }
    };

    /**
     * emit the form data
     */
    const emitData = () => {
      const scenario = {
        services: {},
      };

      // collect the services data
      serviceForms.value.forEach((_form) => {
        scenario.services[_form.serviceType] = {
          qty: _form.quantity,
          capCostIntensity: parseFloat(_form.capCostIntensity),
          capCost: _form.capCost,
          maintCostIntensity: parseFloat(_form.maintCostIntensity),
          maintCost: _form.maintCost,
        };
      });

      emit("on-validated", scenario);
    };

    return {
      getChipUnits,
      serviceForms,
      panels,
      panelErrors,
      services,
      valid,
      submitted,
      ...ruleUtils().getRules(["requiredRule"]),
      validate,
      clearPanelError,
    };
  },
});
</script>
<style lang="scss" scoped></style>
