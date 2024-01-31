<template>
  <div>
    <v-card color="lightBg">
      <template v-slot:title>
        {{ scenario.title }}
      </template>
      <template v-slot:subtitle> {{ $t("general.year") }}: {{ scenario.year }} </template>
      <template v-slot:text>
        <scenario-header-snippet
          :neighbourhood-type="neighbourhoodType"
          :prov-id="scenario.provId"
          :scenario="scenario"
        ></scenario-header-snippet>
      </template>
    </v-card>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, computed } from "vue";
import ScenarioHeaderSnippet from "@/components/ScenarioHeaderSnippet.vue";

export default defineComponent({
  name: "ScenarioHeaderCard",

  props: {
    scenario: {
      type: Object,
      required: true,
    },
  },

  components: { ScenarioHeaderSnippet },

  setup(props) {
    const neighbourhoodType = computed(() => {
      return "neighbourhoodType" in props.scenario
        ? props.scenario.neighbourhoodType
        : "";
    });

    const provId = computed(() => {
      return "provId" in props.scenario ? props.scenario.provId : "";
    });

    return { neighbourhoodType, provId };
  },
});
</script>
<style lang="scss" scoped>
</style>