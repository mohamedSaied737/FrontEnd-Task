<template>
  <b-breadcrumb style="background-color:#fff;margin-bottom:3px" :items="items"></b-breadcrumb>
</template>

<script>
  export default {
    props:['items'],
  }
</script>

<style lang="scss" scoped>
.breadcrumb-item{
  a{
    color: #103F5E;
    padding: 0;
  }
}
</style>