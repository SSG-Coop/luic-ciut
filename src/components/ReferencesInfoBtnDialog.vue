<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" flat>
        <v-icon size="small">$infoCircle</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-2">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <span
          v-if="'description' in references"
          class="text-caption"
          >{{ references.description }}
          </span><br />
        <span class="text-caption font-weight-bold">{{ $t("general.referencesTitle") }}</span><br />
        <ul v-if="'references' in references && references.references.length" class="ml-8">
          <li v-for="(item, index) in references.references" :key="index">
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
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialog = false">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";
import { ref } from "vue";

export default defineComponent({
  name: "ReferencesInfoBtnDialog",

  props: {
    title: {
      type: String,
      required: true,
    },
    references: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const dialog = ref(false);
    return {
      dialog,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>