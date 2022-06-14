<template>
  <div id="compRenderer">
    <!--add click methods to the icons below-->
    <div class="action-btns-box">
      <router-link :to="`/compliance/update/${data.row.id}`">
        <i class="mdi mdi-pencil mr-3 action-icon"></i>
      </router-link>
      <i class="mdi mdi-delete action-icon" @click="onDeleteCompliance()"></i>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["data"],
  methods: {
    ...mapActions("compliance", ["deleteCompliance"]),
    onDeleteCompliance() {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete ${this.data.row.name} ?`,
          {
            title: "Confirmation",
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            cancelVariant: "outline-secondary",
            okTitle: "Confirm",
            headerClass: "p-2 border-bottom-0 h1",
            footerClass: "p-2 border-top-0",
            centered: true,
          }
        )
        .then((proceed) => {
          if (proceed) {
            this.deleteCompliance(this.data.row.id);
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
#compRenderer {
  .modal-body {
  font-size: 18px;
  font-weight: bold;
}
  .action-btns-box i {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.38);
    cursor: pointer;
    &:hover {
      color: #103f5e;
    }
  }
}
</style>
