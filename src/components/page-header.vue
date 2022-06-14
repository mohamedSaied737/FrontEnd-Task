<script>
export default {
  props: ["title", "className"],
};
</script>

<template>
  <div class=""  :class="className">
    <h4 class="pages-title mb-0">{{ title }}</h4>
    <slot v-if="true"></slot>
  </div>
</template>

<style lang="scss" scoped>
.pages-title {
  color: #495057!important;
  font-weight: 400!important;
  font-size: 16px!important;
  line-height: 19px!important;
  //top padding for all headers
  padding-top:0!important;
  padding-bottom: 28px!important;
  padding-top: 28px!important;
  padding-left:9px!important
}
</style>
