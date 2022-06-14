<template>
  <b-avatar
    class="user-image"
    :class="image && 'image-hover'"
    :text="name"
    size="2.5em"
    :src="image"
  >
  </b-avatar>
</template>

<script>
export default {
  name: "ImageCell",
  props: ["image", "name"],
};
</script>
<style lang="scss" scoped>
.user-image {
  background-color: #92c0d0;
  color: #fff;
}
.image-hover {
  cursor: pointer;
  &:hover {
    transform: scale(7.5);
    z-index: 1000;
    position: relative;
    left: 140px;
  }
}
</style>
