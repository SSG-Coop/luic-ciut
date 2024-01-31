<template>
  <div class="ma-0 pa-0">
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>{{ $t("forms.confirmDeleteTitle") }} {{ type }}</v-card-title>
        <v-card-text>
          <p>{{ $t("forms.confirmDeleteMsg", {item: type}) }}</p>
          <p class="font-weight-bold">{{ name }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog=false">{{ $t("forms.cancel") }}</v-btn>
          <v-btn text @click="confirmDelete">{{ $t("forms.delete") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ConfirmDeleteDialog",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  emits: ["update:modelValue", "confirm", "snackbar"],

  setup(props, { emit }) {
    const { t } = useI18n();
    // setup v-model tracking for make sure the input field wires to the parent value
    const dialog = ref(props.modelValue);
    watch(
      () => props.modelValue,
      (newVal) => {
        dialog.value = newVal;
      }
    );
    watch(dialog, (newVal) => {
      emit("update:modelValue", newVal);
    });

    const confirmDelete = () => {
      emit("confirm", true);
      emit("snackbar", t("forms.confirmHasBeenDeleted", {itemType: props.type, itemName: props.name}));
      dialog.value = false;
    };

    return {
      dialog,
      confirmDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>