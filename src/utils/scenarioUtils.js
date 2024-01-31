// © Copyright 2023, LUIC-CIUT's Contributors
// composition functions for working with scenarios and scenario store
// import { computed } from "vue";
import { computed } from "vue";
import { useScenarioStore } from "@/store/scenario.js";
import { v4 as uuidv4 } from "uuid";

export default function scenarioUtils() {
  /**
   * scenario store getters
   */
  const scenarioStore = useScenarioStore();
  const getScenarios = computed(() => scenarioStore.getScenarios);
  const numScenarios = computed(() => scenarioStore.getScenarios.length);
  const getActiveScenarioId = computed(() => scenarioStore.getActiveScenarioId);
  const getActiveScenario = computed(() => scenarioStore.getActiveScenario);
  const getProvId = computed(() => scenarioStore.getProvId);
  const getScenarioToggle = computed(() => scenarioStore.getScenarioToggle);

  const getScenarioById = (scenarioId) => {
    return getScenarios.value.find((scen) => scen.id === scenarioId);
  };

  /**
   * updates an existing scenario or creates a new scenario in the store and sets its ID as the current active scenario id
   * @param {Object} scenario - scenario object to be created in the store
   */
  const updateOrCreateScenario = (scenario) => {
    // check if the project is already in the store
    const index = scenarioStore.getScenarios.findIndex(
      (scen) => scen.id === scenario.id
    );
    const isUpdate = index !== -1 ? true : false;

    scenarioStore.$patch((state) => {
      if (isUpdate) {
        // update existing scenario
        state.scenarios.splice(index, 1, JSON.parse(JSON.stringify(scenario)));
      } else {
        // add the new scenario
        state.scenarios.push(scenario);
      }
      state.activeScenarioId = scenario.id;
    });
  };

  /**
   * set active scenario in store
   */
  const setActiveScenario = (scenario) => {
    const scenId = scenario !== null ? scenario.id : null;
    scenarioStore.$patch({ activeScenarioId: scenId });
  };

  /**
   * update a scenario in the store
   * uses the scenario.id to find the correct scenario to update
   */
  const updateScenario = (scenario) => {
    const index = scenarioStore.getScenarios.findIndex(
      (scen) => scen.id === scenario.id
    );
    if (index !== -1) {
      // need to splice the scenarioStore to make sure that the change propogates to localStorage
      scenarioStore.$patch((state) => {
        state.scenarios.splice(index, 1, JSON.parse(JSON.stringify(scenario)));
      });
    } else {
      console.warn(`Could not find scenario in store. Scenario was not saved`);
    }
  };

    /**
   * duplicate a scenario
   * @param {Object} scenario - a scenario object to be duplicated
   */
    const duplicateScenario = (scenario) => {
      const newScenario = JSON.parse(JSON.stringify(scenario));
      // some new values
      newScenario.title = `COPY of ${scenario.title}`;
      newScenario.id = uuidv4();
      newScenario.datetimeCreated = Date.now();
      newScenario.datetimeModified = Date.now();
      // save
      updateOrCreateScenario(newScenario);
      return newScenario;
    };

  /**
   * delete a single scenario by its id
   */
  const deleteScenario = (id) => {
    const index = scenarioStore.getScenarios.findIndex(
      (scen) => scen.id === id
    );
    if (index !== -1) {
      scenarioStore.deleteScenario(index);
    } else {
      console.warn(
        `Could not find scenario with id: ${id}. Nothing was deleted`
      );
    }
  };
  /**
   * delete all of the scenarios in the store
   */
  const deleteAllscenarios = () => {
    scenarioStore.$patch({ scenarios: [] });
  };

  /**
   * set provId in store
   */
  const setProvId = (id) => {
    scenarioStore.$patch({ provId: id });
  };

  /**
   * trigger scenario update
   */
  const triggerScenarioToggle = () => {
    scenarioStore.$patch({ scenarioToggle: !getScenarioToggle.value });
  };

  return {
    getScenarios,
    numScenarios,
    getActiveScenarioId,
    getActiveScenario,
    getScenarioById,
    updateOrCreateScenario,
    setActiveScenario,
    updateScenario,
    duplicateScenario,
    deleteScenario,
    deleteAllscenarios,
    getProvId,
    setProvId,
    getScenarioToggle,
    triggerScenarioToggle,
  };
}
