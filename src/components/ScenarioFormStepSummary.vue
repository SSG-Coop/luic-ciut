<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <h2>ready to save to excel...</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "ScenarioFormStepSummary",

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

  components: {},

  emits: ["on-save"],

  setup(props, { emit }) {
    /**
     * FORM VALIDATION AND SAVING
     */
    const valid = ref();
    const submitted = ref(false);

    /**
     * validate form and emit data if validation passes
     */
    const validate = () => {
      // nothing to validate... just save
      emit("on-save");
    };

    return {
      valid,
      submitted,
      validate,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>