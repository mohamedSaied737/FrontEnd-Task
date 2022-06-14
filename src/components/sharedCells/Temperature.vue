<template>
  <div v-if="tempreture" class="temperature-wrapper green-bg py-1 text-center">
    <p class="mb-0 temperature-text">
      {{ tempreture }}
    </p>
  </div>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  name: "Temperature",
  props: ["props"],
  data: function() {
    return {
      tempreture: null,
    };
  },
  mounted() {
    this.tempreture = this.props;
  },
});
</script>
<style lang="scss" scoped>
.green-bg {
  background-color: #daf4eb;
}
.danger-bg {
  background-color: #fde4e4;
}
.warning-bg {
  background-color: #fcf1df;
}
.temperature-text {
  font-size: 0.6rem;
  line-height: 10px;
  height: 10px;
  color: #000;
}
.temperature-wrapper {
  border-radius: 20px;
  width: 40%;
  @media only screen and (max-width: 1120px) {
    width: 70%;
  }
  @media only screen and (max-width: 768px) {
    width: 12%;
    margin: 0;
    text-align: right;
    padding: 1% 3%;
  }
}
</style>
