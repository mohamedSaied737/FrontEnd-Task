<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./verticalEntity";

export default {
  components: { Vertical },
  data() {
    return {};
  },
  computed: {
    ...layoutComputed
  },
  methods: {}
};
</script>

<template>
  <div>
    <vertical>
      <slot />
    </vertical>


  </div>
</template>
