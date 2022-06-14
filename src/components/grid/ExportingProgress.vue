<template>
  <div class="wrapper">
    <div class="header">
      <p class="custom-title">Exporting in progress</p>
    </div>
    <i
      @click="$bvModal.hide('exportingProgress')"
      class="mdi mdi-close-circle close-icon"
    ></i>
    <div class="content">
      <p class="touch-mode-alert">
        {{ userDetails.email }}
        Exporting your file is in progress. You will receive an email when it's
        ready for download.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed:{
    ...mapGetters("authfack", ["userDetails"]),
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 38px;
  .custom-title {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: #c7c7c7;
    margin-bottom: 0 !important;
    letter-spacing: 1px;
  }
}
.close-icon {
  position: absolute;
  top: 21px;
  right: 26px;
  color: #f46a6a;
  font-size: 1.7rem;
  cursor: pointer;
}
.touch-mode-alert {
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: #495057;
  padding: 0 22px;
}
</style>
