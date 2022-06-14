<template>
  <div class="d-flex align-items-center">
    <span class="d-flex align-items-center font-weight-bold type-text"> {{ value }}</span>
    <i 
     title="show-details"
     class="mdi mdi-eye-outline details-icon ml-1"
     v-b-modal="'siteDetails'"
      @click="setActionData()"
     ></i>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["value","data","type"],
    methods: {
    ...mapActions("modal", ["setData"]),
    setActionData() {
    this.setData({
        type:this.type,
        data:this.data
    });
    }
    },
};
</script>

<style lang="scss" scoped>
.type-text{
    width: 30px;
}
.details-icon {
  font-size: 1.1rem;
  cursor: pointer;
  outline: none;
}
</style>
