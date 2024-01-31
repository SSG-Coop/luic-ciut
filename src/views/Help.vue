<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center pt-8">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              color="secondary"
              v-bind="props"
              min-width="220"
              @click="navigateToWelcome"
            >
              {{ $t("pages.help.welcomeSlidesBtn") }}
            </v-btn>
          </template>
          <span
            >{{ $t("pages.help.welcomeSlidesTooltip") }}</span
          >
        </v-tooltip>
      </v-col>
      <v-col cols="12" class="pt-8">
        <v-card class="lightBg" flat>
          <v-card-text>
            <h2 class="mb-2">{{ $t("pages.help.feedbackTitle") }}</h2>
            <p>
              {{ $t("pages.help.feedbackText") }}
            </p>
          </v-card-text>
        </v-card>
        <contact-form />
      </v-col>
    </v-row>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";
import ContactForm from "@/components/ContactForm.vue";
import router from "../router";

export default defineComponent({
  name: "HelpPage",

  components: {
    ContactForm,
  },

  setup() {
    const navigateToWelcome = () => {
      router.push({ name: "welcome" });
    };
    return {
      navigateToWelcome,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>