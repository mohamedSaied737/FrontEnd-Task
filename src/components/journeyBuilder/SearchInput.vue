<template>
  <!-- select -->
  <div class="d-flex justify-content-center">
    <multiselect
      v-if="type == 'selectInput'"
      class="mt-1"
      v-model="selected"
      :label="label"
      :options="options ? options : []"
      placeholder="Filter"
      :show-labels="false"
      @open="onOpen"
      style="min-width: 120px"
    >
      <template
        v-if="paramsKey.name == 'UserType'"
        slot="option"
        slot-scope="props"
      >
        <div class="option__desc">
          <span
            v-if="props.option.children"
            class="option__name font-weight-bold"
            >{{ props.option.name }}</span
          >
          <span v-else class="option__usertype__child font-weight-bold ml-1"
            >- {{ props.option.name }}</span
          >
        </div>
      </template>
    </multiselect>
    <b-form-input
      v-else
      class="default-input"
      v-model="selected"
      placeholder="Filter"
    >
    </b-form-input>
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
    "searchKey",
    "type",
    "openAction",
    "options",
    "label",
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
    onOpen() {
      return this.openAction && this.openAction();
    },
  },
  computed: {
    ...mapGetters("grid", ["getFilterValues"]),
  },
  watch: {
    selected(value) {
      const { name } = this.paramsKey;
      let params = {
        [`filterBy[${name}]`]:
          this.type == "selectInput" ? value && value.id : value,
      };
      this.selectAction(params);
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
.default-input {
  width: 100px;
}
</style>
