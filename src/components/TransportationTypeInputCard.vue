<template>
  <v-form v-model="valid" ref="form">
    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="quantity"
              v-bind="props"
              :label="
                isActiveTransport
                  ? `AKT/${$t('general.dwelling')}`
                  : `VKT/${$t('general.dwelling')}`
              "
              variant="outlined"
              @update:modelValue="updateQty"
            ></v-text-field>
          </template>
          <span>{{ isActiveTransport ? $t("forms.aktTooltip") : $t("forms.vktTooltip") }}</span>
        </v-tooltip>
      </v-col>
      <v-col v-if="isActiveTransport" cols="12">
        <v-alert
          type="success"
          :icon="activeIcon"
          variant="tonal"
          border="start"
        >
          {{ $t("appConfig.transportation.activeMode") }}
        </v-alert>
      </v-col>
      <v-col v-else-if="quantity > 0" cols="12">
        <energy-source-list
          :show-mode="false"
          sector-id="transportation"
          ref="energySourceList"
        ></energy-source-list>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, watch, defineComponent, onMounted } from "vue";
import transportationConfig from "@/config/transportation.js";
import EnergySourceList from "@/components/EnergySourceList.vue";

export default defineComponent({
  name: "TransportationTypeInputCard",

  props: {
    transportationType: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
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

  components: {
    EnergySourceList,
  },

  emits: ["on-updateQty"],

  setup(props, { emit }) {
    const form = ref();

    const quantity = ref(props.qty);

    const isActiveTransport = ref(
      "active" in
        transportationConfig().transportationTypes[props.transportationType] &&
        transportationConfig().transportationTypes[props.transportationType]
          .active
        ? true
        : false
    );

    const activeIcon = computed(() => {
      return transportationConfig().transportationTypes[
        props.transportationType
      ].icon;
    });

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
      if (
        props.energySources !== undefined &&
        Object.keys(props.energySources).length !== 0
      ) {
        energySourceList.value.populate(props.energySources, "percent");
      }
    });

    // energy sources
    const energySourceList = ref(null);

    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();

    const validate = async () => {
      if (isActiveTransport.value == false && quantity.value > 0) {
        await energySourceList.value.validate();
        if (!energySourceList.value.valid) {
          form.value.validate(); // validate other fields for show
          valid.value = false;
          return false;
        } else {
          valid.value = true;
        }
      }
      return form.value.validate(); // returns promise
    };

    const updateQty = () => {
      emit("on-updateQty", props.index, parseFloat(quantity.value));
    };

    return {
      form,
      valid,
      validate,
      quantity,
      isActiveTransport,
      activeIcon,
      energySourceList,
      updateQty,
    };
  },
});
</script>
<style lang="scss" scoped></style>
