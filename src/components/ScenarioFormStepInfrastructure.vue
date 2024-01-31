<template>
  <div class="my-4 mr-4">
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-if="ready" v-model="panels">
          <v-expansion-panel
            v-for="(item, index) in infrastructure"
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
              <v-chip class="ml-2">{{ item.qty }} m</v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <keep-alive>
                <infrastructure-type-input-card
                  :infrastructure-type="item.id"
                  :qty="item.qty"
                  :capCostInt="item.capCostInt"
                  :maintCostInt="item.maintCostInt"
                  :index="index"
                  ref="infrastructureForms"
                  @on-validated="clearPanelError(index, true)"
                  @on-updateQty="updateQty"
                ></infrastructure-type-input-card>
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
import infrastructureConfig from "@/config/infrastructure.js";
import ruleUtils from "@/utils/ruleUtils.js";
import InfrastructureTypeInputCard from "@/components/InfrastructureTypeInputCard.vue";

export default defineComponent({
  name: "ScenarioFormStepInfrastructure",

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
    InfrastructureTypeInputCard,
  },

  emits: ["on-validated", "on-error", "clear-error"],

  setup(props, { emit }) {
    const infrastructureForms = ref(null);

    const panels = ref([0]); // set the first panel open automatically
    const panelErrors = ref([]); // track panels with errors
    const neighbourhoodType =
      "neighbourhoodType" in props.scenario
        ? ref(props.neighbourhoodType)
        : ref("");

    const infrastructure = ref([]);

    /**
     * setup the infrastructure array which will track inputs for each home type
     */
    const initInfrastructure = () => {
      if (
        "neighbourhoodType" in props.scenario &&
        neighbourhoodType.value !== props.scenario.neighbourhoodType
      ) {
        neighbourhoodType.value = props.scenario.neighbourhoodType;
        const neighbourhoodTypeObj =
          neighbourhoodTypesConfig().neighbourhoods[
            props.scenario.neighbourhoodType
          ].sectorDefaults;
        const _infrastructure = neighbourhoodTypeObj.infrastructure;
        // setup infrastructure array
        infrastructure.value = [];
        if ('infrastructure' in props.scenario) {
          // get the data from previously saved scenario
          Object.keys(_infrastructure).forEach((infrastructureType) => {
            infrastructure.value.push({
              id: infrastructureType,
              name: infrastructureConfig().infrastructureTypes[infrastructureType].name,
              qty: props.scenario.infrastructure[infrastructureType].qty,
              capCostInt: props.scenario.infrastructure[infrastructureType].capCostIntensity,
              maintCostInt: props.scenario.infrastructure[infrastructureType].maintCostIntensity,
            });
          });
        } else {
          // reset infrastructure for a new scenario
          Object.keys(_infrastructure).forEach((infrastructureType) => {
            infrastructure.value.push({
              id: infrastructureType,
              name: infrastructureConfig().infrastructureTypes[infrastructureType].name,
              qty: neighbourhoodTypeObj.infrastructure[infrastructureType],
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
        initInfrastructure();
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
      infrastructureForms.value.forEach((_form) => {
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

    // update qty from child components
    const updateQty = (index, qty) => {
      infrastructure.value[index].qty = qty;
    }

    /**
     * emit the form data
     */
    const emitData = () => {
      const scenario = {
        infrastructure: {},
      };

      // collect the infrastructure data
      infrastructureForms.value.forEach((_form) => {
        scenario.infrastructure[_form.infrastructureType] = {
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
      infrastructureForms,
      panels,
      panelErrors,
      infrastructure,
      valid,
      submitted,
      ...ruleUtils().getRules(["requiredRule"]),
      validate,
      clearPanelError,
      updateQty,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>