<template>
  <div>
    <h2><v-icon class="pr-2">$calculator</v-icon> {{ activeScenario.title }}</h2>
    <scenario-details-snippet :scenario="activeScenario"></scenario-details-snippet>
    <v-row class="mt-4" justify="space-between">
      <v-col cols="12" class="text-center">
        <v-tooltip top>
          <template v-slot:activator="{ props }">
            <v-btn
              color="success"
              v-bind="props"
              min-width="220"
              @click="addToWorkbook"
            >
              <icon-add-item icon="$table" />
              Workbook
            </v-btn>
          </template>
          <span
            >{{
              workbookAddOrUpdate === "add"
                ? $t("scenario.addToWorkbook")
                : $t("scenario.updateWorkbook")
            }}
          </span
          >
        </v-tooltip>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="2000" app>
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { ref, computed, defineComponent } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import IconAddItem from "@/components/IconAddItem.vue";
import scenarioUtils from "@/utils/scenarioUtils.js";
import useExcelUtils from "@/utils/excelUtils.js";
import ScenarioDetailsSnippet from "@/components/ScenarioDetailsSnippet.vue";


export default defineComponent({
  name: "ScenarioDetails",
  components: {
    IconAddItem,
    ScenarioDetailsSnippet,
  },
  setup(props, { refs }) {
    // snackbar
    const snackbar = ref(false);
    const snackbarMsg = ref("");
    const setSnackbar = (msg) => {
      snackbarMsg.value = msg;
      snackbar.value = true;
    };

    const activeScenario = scenarioUtils().getActiveScenario;

    const showActions = computed(() => {
      return (
        "actions" in activeScenario.value && activeScenario.value.actions.length
      );
    });

    const capActions = computed(() => {
      return showActions.value
        ? activeScenario.value.actions.filter(
            (act) => act.actionType === "capital"
          )
        : [];
    });

    const polActions = computed(() => {
      return showActions.value
        ? activeScenario.value.actions.filter(
            (act) => act.actionType === "policy"
          )
        : [];
    });

    const newAction = (actionType) => {
      router.push({ name: "action_edit", params: { actionType: actionType } });
    };

    // show if a new action was created
    const route = useRoute();
    const addNewActionToWorkbook = () => {
      refs[route.params.newActionId][0].addToWorkbook();
    };

    // add this scenario to the current excel workbook
    const workbookAddOrUpdate = computed(() => {
      const addOrUpdate =
        activeScenario.value.id in useExcelUtils().workbookMap.value.scenarios
          ? "update"
          : "add";
      return addOrUpdate;
    });
    const addToWorkbook = () => {
      useExcelUtils().saveScenarioToWorksheet(activeScenario.value);
    };

    return {
      activeScenario,
      showActions,
      capActions,
      polActions,
      route,
      newAction,
      addNewActionToWorkbook,
      workbookAddOrUpdate,
      addToWorkbook,
      snackbar,
      snackbarMsg,
      setSnackbar,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>