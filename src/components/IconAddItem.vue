<template>
  <div>
    <v-icon :size="size">{{ icon }}</v-icon>
    <v-icon x-small class="plus-icon mr-2">$plus</v-icon>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconAddItem",

  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'medium'
    },
  }
});
</script>
<style lang="scss" scoped>
.plus-icon {
    transform: translateY(-0.3em);
}
</style>