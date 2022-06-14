<template>
  <div class="wrapper">
    <p class="title">Reactivate My Passport Account</p>
    <div class="content">
      <p class="popup-confirmation">
        Your VisiPoint Passport has been deactivated
        {{ getPassportData ? getPassportData.since : "" }} days ago. Do you
        want to <b>“Reactivate”</b> it?
      </p>
    </div>
    <!-- action btns  -->
    <hr class="h-line" />
    <div class="action-btns">
      <button
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
      >
        <i
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          v-if="getLoading"
        ></i>
        <span v-else>Reactivate</span>
      </button>
      <button
        class="btn btn-outline-danger"
        @click="$bvModal.hide('reactivePassportAccount')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("passport", [
      "getLoading",
      "getModalState",
      "getPassportData",
    ]),
  },
  watch: {
    getModalState(modalState) {
      modalState && this.$bvModal.hide("reactivePassportAccount");
    },
  },
  methods: {
    ...mapActions("passport", ["reactivePassportAccount", "resetModalState"]),
    onSubmit() {
      const passportId =
        JSON.parse(localStorage.getItem("userDetails")) &&
        JSON.parse(localStorage.getItem("userDetails")).passport_id;
      this.reactivePassportAccount({ id: passportId });
    },
  },
  mounted() {
    this.resetModalState();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .content {
    .popup-confirmation {
      font-weight: normal;
      font-size: 20px;
      line-height: 34px;
      text-align: center;
      letter-spacing: 0.25px;
      color: #939393;
      margin-bottom: 37px;
    }
  }
}
</style>
