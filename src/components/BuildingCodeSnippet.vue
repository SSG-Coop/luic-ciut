<template>
  <div>
    <p class="mt-0 pt-0">
      <v-icon class="pr-2" size="small">$hammer</v-icon>
      {{ buildingEnergyCode.name }}
    </p>
    <p class="mt-3 text-caption">{{ buildingEnergyCode.description }}</p>
    <p class="text-caption font-weight-bold">{{ $t("general.referencesTitle") }}:</p>
        <ul v-if="'references' in buildingEnergyCode && buildingEnergyCode.references.length" class="ml-8">
          <li v-for="(item, index) in buildingEnergyCode.references" :key="index">
            <a
              v-if="item.length > 1"
              :href="item[1]"
              target="_blank"
              :title="item[0]"
            >
              {{ item[0] }}
            </a>
            <span v-else>{{ item[0] }}</span>
          </li>
        </ul>
        <span v-else>{{ $t("general.referencesNone") }}</span>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";

export default defineComponent({
  name: "BuildingCodeSnippet",

  props: {
    buildingEnergyCode: {
      type: Object,
      required: true,
    },
  },

  components: {},

  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
</style>