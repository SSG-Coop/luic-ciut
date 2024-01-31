<template>
  <router-view />
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/user.js";


export default defineComponent({
  name: "app",
  data() {
    return {};
  },

  setup() {
    const i18n = useI18n();
    const store = useUserStore();
    const availableLocales = i18n.availableLocales;

    // watch for locale in userStore
    watch(()=>store.getCurrentLocale.value,() => {
      i18n.locale.value = store.getCurrentLocale;
    },{
      immediate:true
    });

    return {
      availableLocales,
      i18n: i18n
    }
  },
});

</script>
