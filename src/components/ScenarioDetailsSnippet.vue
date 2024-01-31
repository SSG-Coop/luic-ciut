<template>
  <div>
    <v-row align-content="start" no-gutters>
      <v-col cols="auto">
        <p>
          <v-icon class="pr-2">$mapMarkerAlt</v-icon>
          {{ scenario.provId }}
        </p>
      </v-col>
    </v-row>
    <v-row align-content="start" no-gutters class="mt-4">
      <v-col cols="auto">
        <v-icon class="pr-2">{{ neighbourhoodIcon }}</v-icon>
        {{ neighbourhoodTypeName }}
      </v-col>
    </v-row>
    <v-row align-content="start" no-gutters class="mt-4">
      <v-col cols="auto">
        <p class="text-subtitle-2">
          {{ scenario.description }}
        </p>
      </v-col>
    </v-row>
    <v-row align-content="start" no-gutters class="mt-4">
      <v-col cols="auto">
        <p class="text-caption">
          {{ $t("general.modified") }}: {{ datetimeModifiedFormatted }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, computed } from "vue";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";

export default defineComponent({
  name: "ScenarioDetailsSnippet",

  props: {
    scenario: {
      type: Object,
      required: true,
    },
  },

  components: {},

  setup(props) {
    const neighbourhoodIcon = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.scenario.neighbourhoodType].icon;
    });
    const neighbourhoodTypeName = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.scenario.neighbourhoodType].name;
    });
    const datetimeModifiedFormatted = computed(() => {
      const _date = new Date(props.scenario.datetimeModified);
      return _date.toDateString();
    });

    return {
      neighbourhoodIcon,
      neighbourhoodTypeName,
      datetimeModifiedFormatted,
    };
  },
});
</script>
<style lang="scss" scoped>
.arrow-down {
  transform: rotate(0deg);
  transition: transform 0.2s linear;
}

.arrow-down.open {
  transform: rotate(180deg);
  transition: transform 0.2s linear;
}
</style>