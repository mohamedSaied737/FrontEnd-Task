<template>
  <b-modal
    :id="modalID"
    ref="modal"
    hide-footer  
    :scrollable="scrollable"
    :title="title"
  >
    <slot></slot>
  </b-modal>
</template>
<script>
export default {
  name: "Modal",
  props: ["title", "modalID", "scrollable"],
};
</script>
<style lang="scss" scoped>
.modal {
  overflow: hidden !important;
}
.vnis {
  display: flex;
}
</style>
