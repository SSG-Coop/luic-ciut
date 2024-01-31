<template>
  <div class="my-4 mr-4">
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-if="ready" v-model="panels">
          <v-expansion-panel
            v-for="(item, index) in sources"
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
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <keep-alive>
                <revenue-source-input-card
                  :source-type="item"
                  :home-types="homes"
                  ref="sourceForms"
                  @on-validated="clearPanelError(index, true)"
                ></revenue-source-input-card>
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
import { useI18n } from "vue-i18n";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";
import buildingsConfig from "@/config/buildings.js";
import ruleUtils from "@/utils/ruleUtils.js";
import RevenueSourceInputCard from "@/components/RevenueSourceInputCard.vue";

export default defineComponent({
  name: "ScenarioFormStepRevenue",

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

  components: { RevenueSourceInputCard },

  emits: ["on-validated", "on-error"],

  setup(props, { emit }) {
    const { t } = useI18n();
    const sourceForms = ref(null);

    const panels = ref([0]); // set the first panel open automatically
    const panelErrors = ref([]); // track panels with errors
    const neighbourhoodType =
      "neighbourhoodType" in props.scenario
        ? ref(props.neighbourhoodType)
        : ref("");

    const sources = ref([
      {
        id: "developmentCharges",
        name: t("appConfig.revenue.revenueTypes.developmentCharges"),
        homes: {},
      },
      {
        id: "propertyTaxes",
        name: t("appConfig.revenue.revenueTypes.propertyTaxes"),
        homes: {},
      },
    ]);

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
        // reset homes
        homes.value = [];
        sources.value.forEach((src) => {
          src.homes = {};
        });
        // setup homes array
        Object.keys(_homes).forEach((homeType) => {
          homes.value.push({
            id: homeType,
            name: buildingsConfig().homeTypes[homeType].name,
          });
          // setup value refs for tracking input vals
          sources.value.forEach((src) => {
            if ('revenue' in props.scenario) {
              // get the data from previously saved scenario
              // todo check this is working refactored
              src.homes[homeType] = {};
              src.homes[homeType].perUnit = props.scenario.revenue[src.id][homeType].perUnit;
              src.homes[homeType].total = props.scenario.revenue[src.id][homeType].total;
            } else {
              // set to 0 for a new scenario
              src.homes[homeType] = {};
              src.homes[homeType].perUnit = 0;
              src.homes[homeType].total = 0;
            }
          });
        });
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
      sourceForms.value.forEach((_form) => {
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
        revenue: {},
      };

      // collect the sources data
      // todo scenario.revenue[src.sourceType.id][homeType.id] is being refactored!
      sourceForms.value.forEach((src) => {
        scenario.revenue[src.sourceType.id] = {};
        src.homeTypes.forEach((homeType) => {
          scenario.revenue[src.sourceType.id][homeType.id] = {
            perUnit: parseFloat(src.revenue[homeType.id]),
            total: parseFloat(src.revenue[homeType.id] * props.scenario.buildings[homeType.id].qty)
          }
        });
      });

      emit("on-validated", scenario);
    };

    return {
      sourceForms,
      panels,
      panelErrors,
      sources,
      homes,
      valid,
      submitted,
      validate,
      ...ruleUtils().getRules(["requiredNumberRule"]),
    };
  },
});
</script>
<style lang="scss" scoped>
</style>