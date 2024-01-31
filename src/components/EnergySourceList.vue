<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12">
        <span class="text-subtitle-2">{{ titleComputed }}</span>
      </v-col>
      <v-col v-if="showMode" cols="12" class="text-center mt-2 mb-4">
        <v-btn-toggle v-model="mode" mandatory dense light>
          <v-btn value="percent">{{ $t("general.Percentage") }}</v-btn>
          <v-btn value="abs">{{ $t("general.Absolute") }}</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          v-model="sourceSelector"
          :items="availableSources"
          :error="sourceSelectorError"
          :error-messages="sourceSelectorErrMsgs"
          prepend-inner-icon="$squarePlus"
          menu-icon="$caretDown"
          item-title="name"
          item-value="id"
          variant="outlined"
          dense
          :label="$t('forms.fields.addEnergySource')"
          ref="sourceSelectorAutocomplete"
        >
        </v-autocomplete>
        <energy-source-input-card
          v-for="item in selectedSources"
          :key="item"
          :energy-source="getSourceFromId(item)"
          :mode="mode"
          @on-remove="removeSource(item)"
          @on-change="sourceChange"
          ref="selectedSourcesInputs"
        ></energy-source-input-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import energySourcesConfig from "@/config/energySources.js";
import useCalculatorUtils from "@/utils/calculatorUtils.js";
import EnergySourceInputCard from "@/components/EnergySourceInputCard.vue";

export default defineComponent({
  name: "EnergySourceList",

  props: {
    title: {
      type: String,
      default: "",
    },
    initMode: {
      // the initial mode to use: either 'abs' or 'percent'
      type: String,
      default: "percent",
    },
    showMode: {
      // display mode buttons or not
      type: Boolean,
      default: true,
    },
    sectorId: {
      // if provided, list will be filtered to relevant energy sources
      type: String,
      default: null,
    },
  },

  emits: ["on-sum-change"],

  components: {
    EnergySourceInputCard,
  },

  setup(props, { emit }) {
    const { t } = useI18n();

    const titleComputed = computed(() => {
      return props.title !== '' ? props.title : t("forms.fields.energySources")
    })
    const mode = ref(props.initMode); // 'abs' or 'percent'. Initial set by props.initMode. Default is 'percent'
    const allEnergySources =
      props.sectorId !== null
        ? energySourcesConfig().getEnergySourcesForSector(props.sectorId)
        : energySourcesConfig().getEnergySourcesAsArray();
    const sourceSelector = ref();
    const sourceSelectorAutocomplete = ref(null); // ref to the autocomplete so we can access the reset function on it
    const sourceSelectorError = ref(false);
    const sourceSelectorErrMsgs = ref([]);
    const selectedSources = ref([]);
    const selectedSourcesInputs = ref();
    const availableSources = computed(() =>
      allEnergySources.filter(({ id }) => !selectedSources.value.includes(id))
    );

    // watch if showMode changes
    const showModeComputed = computed(() => props.showMode);
    watch(showModeComputed, (newVal) => {
      if (newVal === false) {
        // if it goes from true to false, reset mode to initMode
        mode.value = props.initMode;
      }
    });

    const selectSource = async (source) => {
      // adds a new energy source to the selectedSources array
      selectedSources.value.push(source);
      // clear any errors on the autocomplete
      clearSourceSelectorErrors();
      // clear the typed value
      sourceSelector.value = null;
      sourceSelectorAutocomplete.value.search = "";
    };

    watch(sourceSelector, (newVal) => {
      // watch for new selections of energy sources
      if (![null, undefined, ""].includes(newVal)) {
        selectSource(newVal);
      }
    });

    const getSourceFromId = (src) => {
      return energySourcesConfig().energySources[src];
    };

    const removeSource = (id) => {
      // removes an energy source from the selected sources based on id
      const index = selectedSources.value.indexOf(id);
      if (index !== -1) {
        selectedSources.value.splice(index, 1);
      }
    };
    const sourceChange = () => {
      // recheck the sourcesSum if a source was changed. Clear validation if sum adds to 100
      if (
        !sourcesSumValid.value &&
        mode.value === "percent" &&
        sourcesSum.value === 100
      ) {
        sourcesSumValid.value = true;
        clearSourceSelectorErrors();
      }
    };

    // COMPUTED REFS FOR GETTING SOURCES VALUES
    const sourcesSum = computed(() => {
      // provides a sum of all sources values
      let sum = 0;
      if (
        selectedSources.value.length &&
        selectedSourcesInputs.value !== undefined
      ) {
        selectedSourcesInputs.value.forEach((src) => {
          if (!isNaN(src.value)) {
            sum = sum + parseFloat(src.value);
          }
        });
      }
      return sum;
    });
    // sources sum watchers
    const sumEnergyFromSources = useCalculatorUtils().sumEnergyFromSources;
    // watch for changes to sum if mode='abs'
    watch(sourcesSum, (newVal) => {
      if (mode.value === "abs" && newVal > 0) {
        const emitVal = sumEnergyFromSources(sourcesValues.value, "MJ");
        emit("on-sum-change", emitVal);
      }
    });
    // watch for changes to mode='abs'
    watch(mode, (newVal) => {
      if (newVal === "abs" && sourcesSum.value > 0) {
        const emitVal = sumEnergyFromSources(sourcesValues.value, "MJ");
        emit("on-sum-change", emitVal);
      }
    });

    const sourcesValues = computed(() => {
      // provides an object of all sources and their values
      const vals = {};
      if (selectedSources.value.length) {
        selectedSourcesInputs.value.forEach((src) => {
          if (!isNaN(src.value)) {
            vals[src.energySource.id] = {
              value: parseFloat(src.value),
              units: src.unitsText,
              fuelDensity: src.fuelDensity,
              emissionsFactors: src.energySource.emissionsFactors,
              references:
                "references" in src.energySource
                  ? src.energySource.references
                  : null,
              efUnit:
                  "efUnit" in src.energySource
                  ? src.energySource.efUnit
                  : null,
            };
          }
        });
      }
      return vals;
    });

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref(false);
    const sourcesSumValid = ref(true);
    const clearSourceSelectorErrors = () => {
      // clear error messages on the autocomplete
      sourceSelectorErrMsgs.value = [];
      sourceSelectorError.value = false;
    };
    /**
     * validates the list
     */
    const validate = () => {
      if (!selectedSources.value.length) {
        // make sure at least one source has been selected
        valid.value = false;
        sourceSelectorErrMsgs.value = [
          t("forms.validation.energySourcesNone"),
        ];
        sourceSelectorError.value = true;
      } else if (
        mode.value === "percent" &&
        (sourcesSum.value < 100 || sourcesSum.value > 100)
      ) {
        valid.value = false;
        sourcesSumValid.value = false;
        sourceSelectorErrMsgs.value = [
          t("forms.validation.energySources100"),
        ];
        sourceSelectorError.value = true;
      } else {
        clearSourceSelectorErrors();
        // validate sources
        let _valid = true;
        selectedSourcesInputs.value.forEach((src) => {
          src.validate();
          if (!src.valid) {
            _valid = false;
          }
        });
        if (_valid) {
          // all source inputs passed validation
          valid.value = true;
        }
      }
      return valid.value;
    };

    /**
     * populates the component with previously saved data when loading an existing action
     * @param {[Object]} sources - a list of saved energysources and their respective values/settings
     * @param {string} _mode - the calculation mode (either percent or abs)
     */
    const populate = (sources, _mode) => {
      const _populate = async () => {
        mode.value = _mode;
        Object.keys(sources).forEach((src) => {
          // add to selectedSources list of sources keys
          selectedSources.value.push(src);
        });
      };
      _populate().then(() => {
        // set the values on the input card
        Object.keys(sources).forEach((src) => {
          const inputCard = selectedSourcesInputs.value.find(
            (_src) => _src.energySource.id === src
          );
          inputCard.value = sources[src].value;
        });
      });
    };

    return {
      titleComputed,
      mode,
      allEnergySources,
      sourceSelector,
      sourceSelectorAutocomplete,
      sourceSelectorError,
      sourceSelectorErrMsgs,
      selectedSources,
      selectedSourcesInputs,
      sourcesSum,
      sourcesValues,
      sourcesSumValid,
      sourceChange,
      availableSources,
      getSourceFromId,
      removeSource,
      valid,
      validate,
      populate,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>