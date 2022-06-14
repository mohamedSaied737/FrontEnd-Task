<template>
  <div class="wrapper">
    <p class="title">
      {{ getModalInfo.is_active == 0 ? "Activate User" : "Deactivate User" }}
    </p>
    <div class="content">
      <p class="confirmation-title" v-if="getModalInfo.is_active == 0">
        Are you sure you want to <b>Activate</b> {{ getModalInfo.fullName }} ?
      </p>
      <div class="deactive-wrapper" v-else>
        <p class="confirmation-title deactive">
          Are you sure you want <b>Deactivate</b>
          {{ getModalInfo.fullName }} from dashboard?
        </p>
        <p class="info">
          By deactivating this user he won’t be able to enter your company nor
          use the company’s dashboard.
        </p>
      </div>
    </div>
    <!-- action btns  -->
    <hr class="h-line" />
    <div 
    class="action-btns"
    :class="getModalInfo.is_active == 1 && 'reverse'"
    >
      <button
        class="submit-btn btn"
        :class="getModalInfo.is_active == 0 ? 'btn-primary' : 'btn-outline-danger'"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>{{
          getModalInfo.is_active == 0 ? "Activate" : "Deactivate"
        }}</span>
      </button>
      <button
        class="btn cancel-btn"
        :class="getModalInfo.is_active == 0 ? 'btn-outline-danger' : 'btn-primary'"
        @click="$bvModal.hide('userStatusToggle')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("userStatusToggle");
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("users", ["getLoading", "getModalState"]),
  },
  methods: {
    ...mapActions("users", ["resetLoading", "denyUser"]),

    onSubmit() {
      this.denyUser([
        {
          user_id: this.getModalInfo.id,
          active: this.getModalInfo.is_active == 0 ? 1 : 0,
        },
      ]);
    },
  },
  beforeMount() {
    this.resetLoading();
  },
};
</script>

<style lang="scss" scoped>
.confirmation-title {
  font-size: 20px;
  color: #787878;
  text-align: center;
  margin-bottom: 40px;
  font-weight: normal;
}
.deactive {
  margin-bottom: 12px;
}
.info {
  font-weight: normal;
  font-size: 17px;
  text-align: center;
  color: #939393;
}
.deactive-wrapper {
  margin-bottom: 37px;
}
.reverse{
    flex-direction: row-reverse;
    .cancel-btn{
      margin-right: 30px;
    }
    .submit-btn{
      margin: 0 !important;
    }
}
</style>
