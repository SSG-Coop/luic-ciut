<template>
  <div class="my-4 mr-4">
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-if="ready" v-model="panels">
          <v-expansion-panel
            v-for="(item, index) in homes"
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
              <v-chip class="ml-2">{{ item.qty }} {{ $t('general.dwelling', 2) }}</v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <keep-alive>
                <building-type-input-card
                  :home-type="item.id"
                  :qty="item.qty"
                  :buildingEnergyCode="item.buildingEnergyCode"
                  :energySources="item.energySources"
                  :index="index"
                  ref="buildingForms"
                  @on-validated="clearPanelError(index, true)"
                  @on-updateQty="updateDwellingsQty"
                ></building-type-input-card>
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
import { ref, watch, defineComponent } from "vue";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";
import buildingsConfig from "@/config/buildings.js";
import ruleUtils from "@/utils/ruleUtils.js";
import useCalculatorUtils from "@/utils/calculatorUtils";
import scenarioUtils from "@/utils/scenarioUtils";
import BuildingTypeInputCard from "@/components/BuildingTypeInputCard.vue";

export default defineComponent({
  name: "ScenarioFormStepBuildings",

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
    BuildingTypeInputCard,
  },

  emits: ["on-validated", "on-error", "clear-error"],

  setup(props, { emit }) {
    const buildingForms = ref(null);

    const panels = ref([0]); // set the first panel open automatically
    const panelErrors = ref([]); // track panels with errors
    const neighbourhoodType =
      "neighbourhoodType" in props.scenario
        ? ref(props.neighbourhoodType)
        : ref("");

    const homes = ref([]);

    /**
     * setup the homes array which will track inputs for each home type
     */
    const initHomes = () => {
      if (
        "neighbourhoodType" in props.scenario &&
        neighbourhoodType.value !== props.scenario.neighbourhoodType
      ) {
        neighbourhoodType.value = props.scenario.neighbourhoodType;
        const neighbourhoodTypeObj =
          neighbourhoodTypesConfig().neighbourhoods[
            props.scenario.neighbourhoodType
          ].sectorDefaults;
        const _homes = neighbourhoodTypeObj.homes;
        // setup homes array
        homes.value = [];
        if ('buildings' in props.scenario) {
          // get the data from previously saved scenario
          Object.keys(props.scenario.buildings).forEach((homeType) => {
            homes.value.push({
              id: homeType,
              name: buildingsConfig().homeTypes[homeType].name,
              qty: props.scenario.buildings[homeType].qty,
              eui: props.scenario.buildings[homeType].eui,
              buildingEnergyCode: props.scenario.buildings[homeType].buildingEnergyCode,
              energySources: props.scenario.buildings[homeType].energySources,
            });
          })
        } else {
          // reset homes for a new scenario
          Object.keys(_homes).forEach((homeType) => {
            homes.value.push({
              id: homeType,
              name: buildingsConfig().homeTypes[homeType].name,
              qty: neighbourhoodTypeObj.homes[homeType],
              buildingEnergyCode: null,
              eui: 0,
              energySources: {},
            });
          });
        }
      }
    };

    watch(
      () => props.scenario,
      () => {
        initHomes();
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
      buildingForms.value.forEach((_form) => {
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

    // update dwellings count from child components
    const updateDwellingsQty = (index, qty) => {
      homes.value[index].qty = qty;
      scenarioUtils().triggerScenarioToggle();
    }

    /**
     * emit the form data
     */
    const emitData = () => {
      const scenario = {
        buildings: {},
      };

      // collect the buildings data
      buildingForms.value.forEach((_form) => {
        const energyUse = parseFloat(_form.quantity) *
            buildingsConfig().homeTypes[_form.homeType].size_m2 *
            parseFloat(_form.eui);
        scenario.buildings[_form.homeType] = {
          qty: _form.quantity,
          buildingEnergyCode: _form.selectedEnergyCode,
          eui: _form.eui,
          energySources: _form.energySourceList.sourcesValues,
          energyUse: energyUse,
          emissions: useCalculatorUtils().computeGhGsFromSourcesList(_form.energySourceList.sourcesValues, props.scenario.year, 'percent', energyUse),
        };
      });

      emit("on-validated", scenario);
    };

    return {
      buildingForms,
      panels,
      panelErrors,
      homes,
      valid,
      submitted,
      ...ruleUtils().getRules(["requiredRule"]),
      validate,
      clearPanelError,
      updateDwellingsQty,
      // ready: props.ready,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>