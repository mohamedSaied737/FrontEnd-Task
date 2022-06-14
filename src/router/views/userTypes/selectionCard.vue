<template>
  <div id="selectionCard">
    <div class="inner-sel" v-if="!isLoading">
      <ul class="mb-2" v-for="(el, index) in optionlist" :key="el.id + index">
        <li
          @click="onSelection(el.id, el.name, index)"
          class="individual-sel-card flex-row"
          :class="{ 'active-parent': activeIndex === index }"
        >
          <div>
            <span class="parent-txt">{{ el.name }}</span>
          </div>
          <div>
            <i class="mdi mdi-apple-keyboard-control"></i>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="loading-div">
      <img src="@/assets/images/loading.gif" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {};
  },
  props: ["isLoading", "optionlist", "onSelection", "activeIndex"],
};
</script>

<style lang="scss" scoped>
#selectionCard {
  width: 172px;
  height: 420px;
  overflow-y: scroll;
  background-color: #fafafa;
  padding: 2px;
  border: 1px solid rgba(63, 63, 63, 0.149);
  box-shadow: 4px 0px 10px 2px rgba(0, 0, 0, 0.02);
  .active-parent {
    background-color: #e3eff2 !important;
    .mdi-apple-keyboard-control {
      color: #000000;
    }
    .parent-txt {
      font-weight: 600;
      color: #000000;
    }
  }
  @media only screen and (max-width: 670px) {
    width: 50%;
    height: 320px;
  }
  .loading-div {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .individual-sel-card {
    cursor: pointer;
    justify-content: space-between;
    width: 100%;
    transition: background-color 0.2s linear;
    &:hover {
      background-color: rgb(219, 219, 219);
    }
    .parent-txt {
      transition: all 0.2s linear;
      text-transform: capitalize;
    }
    background-color: #fff;
    text-overflow: ellipsis;
    overflow-x: hidden;
    box-shadow: 0px 10px 20px rgba(18, 38, 63, 0.0313726);
    border-radius: 5px;
    min-height: 46px;
    align-items: center;
    padding: 2px 10px;
    margin-bottom: 6px;
    .mdi-apple-keyboard-control::before {
      font-weight: 800;
      transform: rotate(90deg);
      margin-right: 9px;
      transition: all 0.2s linear;
    }
    .mdi-pencil {
      font-size: 15px;
      margin-right: 4px;
    }
  }
}
</style>
