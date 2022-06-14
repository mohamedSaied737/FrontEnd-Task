<template>
  <p
    class="font-weight-bold mb-0 status no-wrap"
    :class="status == CheckedOut ? 'out-color' : 'in-color'"

    title="click for more info"
  >
    {{ status }}
  </p>
</template>
<script>
import scanStatus from "@/utils/Constants";
export default {
  name: "StatusCell",
  props: ["status", "data"],
  data: function() {
    return {
      CheckedIn: scanStatus.CHECKED_IN,
      CheckedOut: scanStatus.CHECKED_OUT,
    };
  },
  methods: {
    openScanDataTypes() {
      this.$bvModal.show("scanDataTypes");
      this.$store.dispatch("modal/changeModalAdContent", this.data.scan);
    },
  },
};
</script>
<style lang="scss" scobed>
.in-color {
  color: #34c38f;
}
.out-color {
  color: #f46a6a;
}
.status {
  cursor: pointer;
}
</style>
