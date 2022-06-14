<template>
  <i 
  class="mdi icon green-color mdi-account-arrow-right"
  title="Check in user"
  v-b-modal="'dashboardAction'"
  @click="setActionData(data, status)"
  ></i>
</template>

<script>
import { mapActions } from "vuex";
import scanStatus from "@/utils/Constants";

export default {
  name: "ActionCell",
  props: ["status", "data"],
  data() {
    return {
      CheckedIn: scanStatus.CHECKED_IN,
      CheckedOut: scanStatus.CHECKED_OUT,
    };
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    setActionData(data, status) {
      console.log(status, data);
      this.setData(data);
    },
  },
  computed: {
    renderScanIcon() {
      switch (this.status) {
        case this.CheckedOut:
          return [
            {
              title: "Check in",
              type: this.CheckedIn,
            },
          ];
        case this.CheckedIn:
          return [
            {
              title: "Check out",
              type: this.CheckedOut,
            },
          ];
        default:
          return [];
      }
    },
  },
};
</script>

<style scoped>
.green-color {
  color: #34c38f;
}
.danger-color {
  color: #f46a6a;
}
.icon {
  font-size: 1.6rem;
  cursor: pointer;
  margin: 0 2%;
  outline: none;
}
</style>
