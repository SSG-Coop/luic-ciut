// © Copyright 2023, LUIC-CIUT's Contributors
// composition functions for working with user store
import { computed } from "vue";
import { useUserStore } from "@/store/user.js";

export default function userUtils() {
  const userStore = useUserStore();
  const getLatestIntroViewed = computed(() => userStore.getLatestIntroViewed);

  return {
    getLatestIntroViewed,
  };
}
