<template>
  <!-- select -->
  <div class="d-flex align-items-center justify-content-center">
    <b-input
    v-model="selected"
    placeholder="Search..."
    size="sm"
    />
    <i
      v-if="selected"
      class="mdi mdi-close-thick mx-1 clear-icon"
      @click="clearFilter"
    ></i>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "FilterInput",
  props: [
    "selectAction",
    "paramsKey",
    "searchKey",
  ],
  data() {
    return {
      selected: null,
    };
  },
  methods: {
    ...mapActions("grid", ["onSetFilterValue", "onClearFilterValue"]),
    clearFilter() {
      this.onClearFilterValue(this.paramsKey.valueKey);
      this.selected = null;
    },
  },
  computed: {
    ...mapGetters("grid", ["getFilterValues"]),
  },
  watch: {
    selected(value) {
        const {name} = this.paramsKey
        let params = {
          [`filterBy[${name}]`]:value,
          };
        this.selectAction(params)
    },
  },
};
</script>

<style lang="scss" scobed>
.clear-icon {
  font-size: 1.1rem;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: #f46a6a;
  }
}
.multiselect__tags {
  margin-top: 1px;
}
.default-input{
  width: 100PX;
}
</style>
