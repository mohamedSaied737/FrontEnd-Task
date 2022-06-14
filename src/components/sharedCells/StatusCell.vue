<template>
  <p
    class="font-weight-bold mb-0 status no-wrap"
    :class="
      status == CheckedOut || status == DENIED || status == 'Deactivated'
        ? 'out-color'
        : 'in-color'
    "
  >
    {{ status }}
  </p>
</template>
<script>
import scanStatus from "@/utils/Constants";
export default {
  name: "StatusCell",
  props: ["status", "data", "userType"],
  data: function () {
    return {
      CheckedIn: scanStatus.CHECKED_IN,
      CheckedOut: scanStatus.CHECKED_OUT,
      DENIED: scanStatus.DENIED,
    };
  },
  methods: {
    openScanDataTypes() {
      if (this.userType) {
        let userType = this.userType;
        this.data.scan.map(function (e) {
          if (!e.user_type) e.user_type = userType;
        });
      }
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
// .status {
//   cursor: pointer;
// }
</style>
