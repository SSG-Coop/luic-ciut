<template>
  <div class="my-4 mr-4">
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-if="ready" v-model="panels">
          <v-expansion-panel
            v-for="(item, index) in transportation"
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
              <v-chip class="ml-2"
                >{{ item.qty }} {{ item.active ? `KT` : `VKT` }}/HH</v-chip
              >
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <keep-alive>
                <transportation-type-input-card
                  :transportation-type="item.id"
                  :qty="item.qty"
                  :energySources="item.energySources"
                  :index="index"
                  ref="transportationForms"
                  @on-validated="clearPanelError(index, true)"
                  @on-updateQty="updateQty"
                ></transportation-type-input-card>
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
import transportationConfig from "@/config/transportation.js";
import ruleUtils from "@/utils/ruleUtils.js";
import useCalculatorUtils from "@/utils/calculatorUtils";
import TransportationTypeInputCard from "@/components/TransportationTypeInputCard.vue";

export default defineComponent({
  name: "ScenarioFormStepTransportation",

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
    TransportationTypeInputCard,
  },

  emits: ["on-validated", "on-error", "clear-error"],

  setup(props, { emit }) {
    const transportationForms = ref(null);

    const panels = ref([0]); // set the first panel open automatically
    const panelErrors = ref([]); // track panels with errors
    const neighbourhoodType =
      "neighbourhoodType" in props.scenario
        ? ref(props.neighbourhoodType)
        : ref("");

    const transportation = ref([]);

    /**
     * setup the transportation array which will track inputs for each home type
     */
    const initTransportation = () => {
      if (
        "neighbourhoodType" in props.scenario &&
        neighbourhoodType.value !== props.scenario.neighbourhoodType
      ) {
        neighbourhoodType.value = props.scenario.neighbourhoodType;
        const neighbourhoodTypeObj =
          neighbourhoodTypesConfig().neighbourhoods[
            props.scenario.neighbourhoodType
          ].sectorDefaults;
        const _transportation = neighbourhoodTypeObj.transportation;
        // setup transportation array
        transportation.value = [];
        if ("transportation" in props.scenario) {
          // get the data from previously saved scenario
          Object.keys(_transportation).forEach((transportationType) => {
            transportation.value.push({
              id: transportationType,
              name: transportationConfig().transportationTypes[
                transportationType
              ].name,
              qty: props.scenario.transportation[transportationType].qty,
              active:
                "active" in
                transportationConfig().transportationTypes[transportationType]
                  ? true
                  : false,
              energySources:
                props.scenario.transportation[transportationType].energySources,
            });
          });
        } else {
          // reset transportation for a new scenario
          Object.keys(_transportation).forEach((transportationType) => {
            transportation.value.push({
              id: transportationType,
              name: transportationConfig().transportationTypes[
                transportationType
              ].name,
              qty: neighbourhoodTypeObj.transportation[transportationType],
              active:
                "active" in
                transportationConfig().transportationTypes[transportationType]
                  ? true
                  : false,
            });
          });
        }
      }
    };

    watch(
      () => props.scenario,
      () => {
        initTransportation();
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
      transportationForms.value.forEach((_form) => {
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
      transportation.value[index].qty = qty;
    };

    /**
     * emit the form data
     */
    const emitData = () => {
      const scenario = {
        transportation: {},
      };

      // collect the transportation data
      transportationForms.value.forEach((_form) => {
        const energyUseZero =
          ("active" in
            transportationConfig().transportationTypes[
              _form.transportationType
            ] &&
            transportationConfig().transportationTypes[_form.transportationType]
              .active) ||
          _form.quantity == 0
            ? true
            : false;
        const totalHomes =
          neighbourhoodTypesConfig().totalHomesForNeighbourhood(
            props.scenario.buildings
          );
        const energyUse = energyUseZero
          ? 0
          : useCalculatorUtils().computeTransportEnergyFromSourcesList(
              _form.energySourceList.sourcesValues,
              _form.transportationType,
              _form.quantity * totalHomes
            );
        const activeEmissions = { CO2: 0, CH4: 0, N2O: 0, total: 0 };
        scenario.transportation[_form.transportationType] = {
          qty: _form.quantity,
          qtyTotal: _form.quantity * totalHomes,
          energySources: energyUseZero
            ? {}
            : _form.energySourceList.sourcesValues,
          energyUse: energyUse,
          emissions: energyUseZero
            ? activeEmissions
            : useCalculatorUtils().computeGhGsFromSourcesList(
                _form.energySourceList.sourcesValues,
                props.scenario.year,
                "percent",
                energyUse
              ),
        };
      });

      emit("on-validated", scenario);
    };

    return {
      transportationForms,
      panels,
      panelErrors,
      transportation,
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
<style lang="scss" scoped></style>
