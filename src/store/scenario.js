// © Copyright 2023, LUIC-CIUT's Contributors
// scenarios state storage
import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core';

export const useScenarioStore = defineStore({
  id: "scenario",
  state: () => ({
    scenarios: useStorage('scenarios', []),
    activeScenarioId: null,
    provId: null,
    scenarioToggle: false, // basic toggle to watch and trigger events if needed
  }),
  getters: {
    getScenarios() {
      return this.scenarios;
    },
    getNumScenarios() {
      return this.scenarios.length;
    },
    getActiveScenarioId() {
      return this.activeScenarioId;
    },
    getActiveScenario() {
      if (![null, undefined].includes(this.activeScenarioId)) {
        const activescenario = this.scenarios.find((proj) => proj.id === this.activeScenarioId);
        if (activescenario !== undefined) {
          return activescenario;
        }
      }
      return null;
    },
    getProvId() {
      return this.provId;
    },
    getScenarioToggle() {
      return this.scenarioToggle;
    },
  },
  actions: {
    deleteScenario(index) {
      this.scenarios.splice(index, 1);
    }
  },
});
