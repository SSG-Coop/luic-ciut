// © Copyright 2023, LUIC-CIUT's Contributors
// user profile and authentication state storage
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    currentLocale: useStorage("currentLocale", "en"),
    latestIntroViewed: useStorage("lastIntroViewed", "NONE"),
    widthAdjustTipViewed: useStorage("widthAdjustTipViewed", false),
  }),
  getters: {
    getCurrentLocale() {
      return this.currentLocale;
    },
    getLatestIntroViewed() {
      return this.latestIntroViewed;
    },
    getWidthAdjustTipViewed() {
      return this.widthAdjustTipViewed;
    },
  },
  actions: {},
});
