<template>
  <!-- select -->
  <div class="d-flex align-items-center justify-content-center">
    <b-input
    v-model="selected"
    placeholder="filter"
    size="md"
    v-if="type != 'selectInput'"
    style="min-width:60px"
    />
      <multiselect
      v-if="type == 'selectInput'"
      class="mt-1"
      v-model="selected"
      :options="options ? options : []"
      placeholder="filter"
      :show-labels="false"
      style="min-width:80px"
    >
    </multiselect>
    <i
      v-if="selected"
      class="mdi mdi-close-thick mx-1 clear-icon"
      @click="clearFilter"
    ></i>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import multiselect from "vue-multiselect";

export default {
  name: "FilterInput",
    components: {
    multiselect,
  },
  props: [
    "selectAction",
    "paramsKey",
    "type",
    "options",
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
        const {site_id,type,name} = this.paramsKey
        let params = {
          site_id,
          [`filterBy[${type}_${name}]`]:value,
          };
        this.selectAction({
          id:site_id,
          filterBy:params
        })
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
