<template>
  <v-form v-model="valid" ref="form">
    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-text-field
          v-model="quantity"
          :label="$t('forms.fields.quantity')"
          variant="outlined"
          :rules="requiredRule($t('forms.fields.quantity'))"
          @update:modelValue="updateQty"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          v-model="selectedEnergyCode"
          variant="outlined"
          :items="allEnergyCodes"
          item-title="name"
          item-value="id"
          :label="$t('forms.fields.buildingEnergyCode')"
          menu-icon="$caretDown"
          :rules="requiredRule($t('forms.fields.buildingEnergyCode'))"
          @update:modelValue="updateEnergyCode"
        />
      </v-col>
      <v-slide-y-transition>
        <v-col v-if="selectedEnergyCode !== ''" class="pb-8">
            <v-card>
              <template v-slot:text>
                <building-code-snippet
                  :building-energy-code="selectedBuildingEnergyCodeObj"
                ></building-code-snippet>
              </template>
            </v-card>
          </v-col>
      </v-slide-y-transition>
      <v-col cols="12">
        <v-text-field
          v-model="eui"
          :label="`${$t('forms.fields.eui')} (MJ/m2/${$t('general.yearAbbr')})`"
          variant="outlined"
          :rules="requiredRule($t('forms.fields.eui'))"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <energy-source-list
          :show-mode="false"
          sector-id="buildings"
          ref="energySourceList"
        ></energy-source-list>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, watch, defineComponent, onMounted, computed } from "vue";
import ruleUtils from "@/utils/ruleUtils.js";
import buildingsConfig from "@/config/buildings";
import EnergySourceList from "@/components/EnergySourceList.vue";
import BuildingCodeSnippet from "@/components/BuildingCodeSnippet.vue";

export default defineComponent({
  name: "BuildingTypeInputCard",

  props: {
    homeType: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    buildingEnergyCode: {
      type: String,
      default: null,
    },
    energySources: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      required: true,
    },
  },

  emits: ["on-validated", "on-updateQty"],

  components: {
    EnergySourceList,
    BuildingCodeSnippet,
  },

  setup(props, { emit }) {
    const form = ref();

    const quantity = ref(props.qty);

    const allEnergyCodes =
      buildingsConfig().getBuildingEnergyCodeNamesIdsAsArray();
    const selectedEnergyCode = ref("");

    /**
     * automatically calculate the EUI based on the selected code
     */
    const updateEnergyCode = async () => {
      eui.value =
        buildingsConfig().buildingEnergyCodes[selectedEnergyCode.value].eui[
          props.homeType
        ];
      await energySourceList.value.validate();
      if (energySourceList.value.valid) {
        emit("on-validated");
      }
    };

    const updateQty = () => {
      emit("on-updateQty", props.index, parseInt(quantity.value));
    }

    const eui = ref(0);

    // update qty if prop changes from parent
    watch(
      () => props.qty,
      () => {
        quantity.value = props.qty;
      },
      { immediate: true }
    );

    // update data from previously saved scenario
    onMounted(() => {
      if (props.buildingEnergyCode !== null) {
        selectedEnergyCode.value = props.buildingEnergyCode;
        eui.value =
          buildingsConfig().buildingEnergyCodes[selectedEnergyCode.value].eui[
            props.homeType
          ];
      }
      if (Object.keys(props.energySources).length !== 0) {
        energySourceList.value.populate(props.energySources, "percent");
      }
    });

    // energy sources
    const energySourceList = ref(null);

    // the full buildingEnergyCode object from buildings config for the selected code
    const selectedBuildingEnergyCodeObj = computed(() => {
      return buildingsConfig().buildingEnergyCodes[selectedEnergyCode.value];
    });

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();

    const validate = async () => {
      await energySourceList.value.validate();
      if (!energySourceList.value.valid) {
        form.value.validate(); // validate other fields for show
        valid.value = false;
        return false;
      } else {
        valid.value = true;
      }
      return form.value.validate(); // returns promise
    };

    return {
      form,
      valid,
      validate,
      ...ruleUtils().getRules(["requiredRule"]),
      quantity,
      allEnergyCodes,
      selectedEnergyCode,
      selectedBuildingEnergyCodeObj,
      updateQty,
      updateEnergyCode,
      eui,
      energySourceList,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>