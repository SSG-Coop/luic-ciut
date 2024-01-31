<template>
  <div class="ma-0 pa-0">
    <confirm-delete-dialog
      v-model="deleteDialog"
      type="scenario"
      :name="scenario.title"
      @confirm="deleteScenario"
      @snackbar="snackbar"
    ></confirm-delete-dialog>
    <v-card color="lightBg" class="my-4">
      <v-card-title>
        <v-row no-gutters class="ma-0 pa-0">
          <v-col cols="10">
            <span class="text-h6 no-break">
              <a @click="toggleShowDetails">
                <v-icon class="arrow-down mt-n1" :class="{ open: showDetails }">
                  $caretDown
                </v-icon>
                {{ scenario.title }}
              </a>
            </span>
          </v-col>
          <v-col cols="2">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="flat"
                  color="lightBg"
                  class="mt-n2"
                >
                  <v-icon>$ellipsisV</v-icon>
                </v-btn>
              </template>
              <v-list nav dense>
                <v-list-item @click="addToWorkbook">
                  <v-list-item-title>
                    {{
                      workbookAddOrUpdate === "add" ? $t('scenario.addToWorkbookShort') : $t('scenario.updateWorkbookShort')
                    }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="view">
                  <v-list-item-title>{{ $t('forms.view') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="edit">
                  <v-list-item-title>{{ $t('forms.edit') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="duplicateScenario">
                  <v-list-item-title>{{ $t('forms.duplicate') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="deleteDialog = true">
                  <v-list-item-title>{{ $t('forms.delete') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>
        <p>{{ $t('forms.fields.devYear') }}: {{ scenario.year }}</p>
      </v-card-subtitle>
      <v-card-text>
        <v-expand-transition>
          <div v-if="showDetails">
            <scenario-details-snippet
              :scenario="scenario"
            ></scenario-details-snippet>
            <v-row class="mt-4" justify="space-between">
              <v-col cols="auto">
                <v-btn @click="view">{{ $t('forms.view') }}</v-btn>
              </v-col>
              <v-col cols="auto">
                <v-tooltip top>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="success"
                      v-bind="props"
                      @click="addToWorkbook"
                    >
                      <icon-add-item icon="$table" />
                      {{ $t("scenario.workbook") }}
                    </v-btn>
                  </template>
                  <span>
                    {{
                      workbookAddOrUpdate === "add"
                        ? $t("scenario.addToWorkbook")
                        : $t("scenario.updateWorkbook")
                    }}
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, defineComponent } from "vue";
import scenarioUtils from "@/utils/scenarioUtils.js";
import useExcelUtils from "@/utils/excelUtils.js";
import router from "../router";
import ScenarioDetailsSnippet from "@/components/ScenarioDetailsSnippet.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import IconAddItem from "@/components/IconAddItem.vue";

export default defineComponent({
  name: "ScenarioDetailsCard",

  props: {
    scenario: {
      type: Object,
      required: true,
    },
  },

  emits: ["snackbar"],

  components: {
    ScenarioDetailsSnippet,
    ConfirmDeleteDialog,
    IconAddItem,
  },

  setup(props, { emit }) {
    const showDetails = ref(false);
    const toggleShowDetails = () => {
      showDetails.value = !showDetails.value;
    };
    const navGroup = ref(null);

    /**
     * go to view the scenario details
     */
    const view = () => {
      // set the active scenario
      scenarioUtils().setActiveScenario(props.scenario);
      // go to details view
      router.push({ name: "scenario_view" });
    };
    // go to edit
    const edit = () => {
      // set the active scenario
      scenarioUtils().setActiveScenario(props.scenario);
      router.push({ name: "scenario_edit" });
    };
    // duplicate action and go to edit
    const duplicateScenario = () => {
      scenarioUtils().duplicateScenario(props.scenario);
      router.push({ name: "scenario_edit" });
    };
    // delete functions
    const deleteDialog = ref(false);
    const deleteScenario = (confirm) => {
      if (confirm) {
        scenarioUtils().deleteScenario(props.scenario.id);
        // todo delete scenario worksheet
      }
    };
    // add this scenario to the current excel workbook
    const workbookAddOrUpdate = computed(() => {
      const addOrUpdate =
        props.scenario.id in useExcelUtils().workbookMap.value.scenarios
          ? "update"
          : "add";
      return addOrUpdate;
    });
    const addToWorkbook = () => {
      useExcelUtils().saveScenarioToWorksheet(props.scenario);
    };

    // handle snackbar
    const snackbar = (msg) => {
      emit("snackbar", msg);
    };

    return {
      showDetails,
      toggleShowDetails,
      navGroup,
      view,
      edit,
      deleteDialog,
      deleteScenario,
      duplicateScenario,
      workbookAddOrUpdate,
      addToWorkbook,
      snackbar,
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

.no-break {
  word-break: keep-all;
}
</style>