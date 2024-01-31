<template>
  <div>
    <p class="mt-0 pt-0">
      <v-icon class="pr-2" size="small">{{ neighbourhoodIcon }}</v-icon>
      {{ neighbourhoodTypeName }}
      <span v-if="provId !== null">
        <v-icon class="pl-8 pr-3" size="small">$mapMarkerAlt</v-icon>
        {{ scenario.provId }}
      </span>
    </p>
    <p class="mt-3 text-caption">{{ neighbourhoodDescription }}</p>
    <p>
      <v-chip class="mt-2 ml-n1" size="small"
        >{{ totalHomes }} {{ $t("general.dwelling", 2) }}</v-chip
      >
      <!-- <v-chip
        class="mt-2 ml-2"
        :color="developmentType === 'greenfield' ? 'success' : 'info'"
        size="small"
        >{{ $t(`appConfig.neighbourhoods.devTypes.${developmentType}`) }}</v-chip
      > -->
    </p>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, computed } from "vue";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";

export default defineComponent({
  name: "ScenarioHeaderSnippet",

  props: {
    neighbourhoodType: {
      type: String,
      required: true,
    },
    provId: {
      type: String,
      default: null,
    },
    scenario: {
      type: Object,
      default: () => {return {}},
    },
  },

  components: {},

  setup(props) {
    const neighbourhoodIcon = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.neighbourhoodType]
        .icon;
    });
    const neighbourhoodTypeName = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.neighbourhoodType]
        .name;
    });
    const totalHomes = computed(() => {
      return "buildings" in props.scenario
        ? neighbourhoodTypesConfig().totalHomesForNeighbourhood(
            props.scenario.buildings
          )
        : neighbourhoodTypesConfig().totalHomesForNeighbourhoodDefault(
            props.neighbourhoodType
          );
    });
    const neighbourhoodDescription = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.neighbourhoodType]
        .description;
    });
    const developmentType = computed(() => {
      return neighbourhoodTypesConfig().neighbourhoods[props.neighbourhoodType]
        .developmentType;
    });

    return {
      neighbourhoodIcon,
      neighbourhoodTypeName,
      totalHomes,
      neighbourhoodDescription,
      developmentType,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>