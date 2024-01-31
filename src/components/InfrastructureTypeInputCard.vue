<template>
  <v-form v-model="valid" ref="form">
    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="quantity"
              v-bind="props"
              :label="`${$t('forms.fields.length')} (m)`"
              variant="outlined"
              :rules="requiredNumberRule($t('forms.fields.length'))"
              @update:modelValue="updateAll"
            ></v-text-field>
          </template>
          <span>{{ $t("forms.infrastructureEnterZero", {item: itemName}) }}</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="capCostIntensity"
          :label="`${$t('forms.fields.capitalCostIntensity')} ($/m)`"
          variant="outlined"
          :rules="requiredNumberRule($t('forms.fields.capitalCostIntensity'))"
          @update:modelValue="updateCapCost"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="capCost"
          :label="`${$t('forms.fields.capitalCost')} ($)`"
          variant="outlined"
          :rules="requiredNumberRule($t('forms.fields.capitalCost'))"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="maintCostIntensity"
          :label="`${$t('forms.fields.maintCostIntensity')} ($/m/${$t('general.yearAbbr')})`"
          variant="outlined"
          :rules="requiredNumberRule($t('forms.fields.maintCostIntensity'))"
          @update:modelValue="updateMaintCost"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="maintCost"
          :label="`${$t('forms.fields.maintCost')} ($/${$t('general.yearAbbr')})`"
          variant="outlined"
          :rules="requiredNumberRule($t('forms.fields.maintCost'))"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, watch, defineComponent, onMounted } from "vue";
import ruleUtils from "@/utils/ruleUtils.js";
import infrastructureConfig from "@/config/infrastructure.js";

export default defineComponent({
  name: "InfrastructureTypeInputCard",

  props: {
    infrastructureType: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    capCostInt: {
      type: Number,
      default: null,
    },
    maintCostInt: {
      type: Number,
      default: null,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  emits: ["on-validated", "on-updateQty"],

  setup(props, { emit }) {
    const form = ref();

    const quantity = ref(props.qty);

    const itemName = infrastructureConfig().infrastructureTypes[props.infrastructureType].name;

    // load default values for capCost and maintCost
    const capCostIntensity = ref(
      infrastructureConfig().infrastructureTypes[props.infrastructureType]
        .capCostIntensity
    );
    const capCost = ref(
      infrastructureConfig().infrastructureTypes[props.infrastructureType]
        .capCostIntensity * props.qty
    );
    const maintCostIntensity = ref(
      infrastructureConfig().infrastructureTypes[props.infrastructureType]
        .maintCostIntensity
    );
    const maintCost = ref(
      infrastructureConfig().infrastructureTypes[props.infrastructureType]
        .maintCostIntensity * props.qty
    );

    // update qty if prop changes from parent
    watch(
      () => props.qty,
      () => {
        quantity.value = props.qty;
      }
    );

    // update data from previously saved scenario
    onMounted(() => {
      if (props.capCostInt !== null) {
        capCostIntensity.value = props.capCostInt;
        capCost.value = !isNaN(parseFloat(capCostIntensity.value))
          ? parseFloat(capCostIntensity.value) * parseInt(quantity.value)
          : 0;
      }
      if (props.maintCostInt !== null) {
        maintCostIntensity.value = props.maintCostInt;
        maintCost.value = !isNaN(parseFloat(maintCostIntensity.value))
          ? parseFloat(maintCostIntensity.value) * parseInt(quantity.value)
          : 0;
      }
    });

    const updateCapCost = async () => {
      capCost.value = !isNaN(parseFloat(capCostIntensity.value))
        ? parseFloat(capCostIntensity.value) * parseInt(quantity.value)
        : 0;
      await form.value.validate();
      if (valid.value) {
        emit("on-validated");
      }
    };

    const updateMaintCost = async () => {
      maintCost.value = !isNaN(parseFloat(maintCostIntensity.value))
        ? parseFloat(maintCostIntensity.value) * parseInt(quantity.value)
        : 0;
      await form.value.validate();
      if (valid.value) {
        emit("on-validated");
      }
    };

    const updateAll = () => {
      updateCapCost();
      updateMaintCost();
      emit("on-updateQty", props.index, parseInt(quantity.value));
    };

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();

    const validate = async () => {
      return form.value.validate(); // returns promise
    };

    return {
      form,
      valid,
      validate,
      ...ruleUtils().getRules(["requiredNumberRule"]),
      quantity,
      itemName,
      capCostIntensity,
      capCost,
      updateCapCost,
      maintCostIntensity,
      maintCost,
      updateMaintCost,
      updateAll,
    };
  },
});
</script>
<style lang="scss" scoped></style>
