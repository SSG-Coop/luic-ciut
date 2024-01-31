<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-sheet rounded class="lightBg ma-0 pa-2">
        <v-row no-gutters justify="space-between">
          <v-col cols="6">
            {{ energySource.name }}
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="value"
              variant="outlined"
              dense
              :label="unitsText"
              :rules="requiredNumberRule"
              type="number"
              @change="change"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn @click="remove" flat icon="$timesCircle" size="small"></v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-form>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "EnergySourceInputCard",

  props: {
    energySource: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      default: "percent", // 'abs' or 'percent'
    },
  },

  emits: ["on-remove", "on-change"],

  setup(props, { emit }) {
    const { t } = useI18n();
    const form = ref();
    const value = ref();
    const unitsText = computed(() =>
      props.mode === "percent" ? "%" : props.energySource.absUnit
    );
    const fuelDensity = computed(() =>
      props.mode !== "percent" && "convVal" in props.energySource ? props.energySource.convVal : 1
    );
    const remove = () => {
      emit("on-remove", props.energySource.id);
    };
    const change = () => {
      emit("on-change");
    };

    /**
     * FORM VALIDATION
     */
    const valid = ref();
    const requiredNumberRule = computed(() => {
      const rules = [
        (v) => !!v || `Required`,
        (v) => Number(v) === parseFloat(v) || t("forms.validation.valueNumber"),
      ];
      if (props.mode === "percent") {
        rules.push(
          (v) => parseFloat(v) > 0 || t("forms.validation.value0to100")
        );
        rules.push(
          (v) => parseFloat(v) <= 100 || t("forms.validation.value0to100")
        );
      } else {
        rules.push((v) => parseFloat(v) > 0 || t("forms.validation.valueGreater0"));
      }
      return rules;
    });
    const validate = () => {
      form.value.validate();
    };

    return {
      form,
      valid,
      requiredNumberRule,
      validate,
      value,
      unitsText,
      fuelDensity,
      remove,
      change,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>