<template>
  <div class="wrapper">
    <div class="header">
    <p class="custom-title">Disable Touch Mode</p>
    </div>
    <i @click="$bvModal.hide('touchModeAlert')" class="mdi mdi-close-circle close-icon"></i>
    <div class="content">
      <p class="touch-mode-alert">To disable the touch mode, all the flows should have at least one input type selected.</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.header{
    margin-bottom: 38px;
    .custom-title{
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
        color: #C7C7C7;
        margin-bottom: 0 !important;
        letter-spacing: 1px;
    }
}
    .close-icon{
      position: absolute;
      top: 21px;
      right: 26px;
      color: #F46A6A;
      font-size: 1.7rem;
      cursor: pointer;
    }
.touch-mode-alert{
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #495057;
    padding: 0 22px;
}
</style>


