<template>
  <div class="d-flex align-items-center">
    <!-- v-if="data && data.length > 0" -->
    <button
      v-b-modal="'dashboardCompliances'"
      @click="setActionData()"
      class="d-flex align-items-center btn-primary  type-text"
      >
      <span class="comp-details">Details</span>
      </button
    >
    <!-- <span v-else>-</span> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["data"],
  methods: {
    ...mapActions("modal", ["setData"]),
    setActionData() {
      this.setData(this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.type-text {
  justify-content: center;
  width: 70px;
  height: 25px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #ffffff;
  border:none;
  border-radius: 12.5px;
}
.details-icon {
  font-size: 1.1rem;
  cursor: pointer;
  outline: none;
}
</style>
