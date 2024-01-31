<template>
  <v-form v-model="valid" ref="form">
    <v-row no-gutters class="mt-3">
      <v-col v-for="homeType in homeTypes" :key="homeType.id" cols="12">
        <span class="text-subtitle-2">{{ homeType.name }}</span>
        <v-text-field
          v-model="revenue[homeType.id]"
          :label="`${
            sourceType.id == 'developmentCharges' ? $t('forms.fields.charges') : $t('forms.fields.taxes')
          } (Average $/${sourceType.id == 'developmentCharges' ? $t('general.dwelling') : $t('general.dwelling') + '/' + $t('general.yearAbbr')}`"
          variant="outlined"
          :rules="
            requiredNumberRule(
              `${sourceType.id == 'developmentCharges' ? $t('forms.fields.charges') : $t('forms.fields.taxes')}`
            )
          "
          class="mt-2"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, watch, defineComponent } from "vue";
import ruleUtils from "@/utils/ruleUtils.js";

export default defineComponent({
  name: "RevenueSourceInputCard",

  props: {
    sourceType: {
      type: Object,
      required: true,
    },
    homeTypes: {
      type: Array,
      required: true,
    },
  },

    setup(props) {
    const form = ref();

    const revenue = ref({});
    /**
     * setup the revenue object which will track inputs for each home type
     */
    const initRevenue = () => {
      props.homeTypes.forEach((homeType) => {
        if (!Object.keys(revenue.value).includes(homeType.id)) {
          // home type not listed in revenue keys
          revenue.value[homeType.id] = props.sourceType.homes[homeType.id].perUnit;
        }
      });
      const _homeTypes = props.homeTypes.map((homeType) => homeType.id);
      Object.keys(revenue.value).forEach((homeType) => {
        if (!_homeTypes.includes(homeType)) {
          // remove homeTypes that shouldn't be in revenue
          delete revenue.value[homeType];
        }
      });
    };

    watch(
      () => props.homeTypes,
      () => {
        initRevenue();
      },
      { immediate: true }
    );

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();

    const validate = async () => {
      return form.value.validate(); // returns promise
    };

    return {
      form,
      revenue,
      valid,
      validate,
      ...ruleUtils().getRules(["requiredNumberRule"]),
    };
  },
});
</script>
<style lang="scss" scoped>
</style>