<template>
  <div>
    <v-icon size="1.5em">$smoke</v-icon>
    <div class="ghg-text" style="font-weight:900">CO₂e</div>
  </div>
</template>

<script>
// # © Copyright 2023, LUIC-CIUT's Contributors
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconGhg",
});
</script>
<style lang="scss" scoped>
.ghg-text {
    transform: translate(0.15em, -1.37em);
    font-size: 0.8em;
}
</style>