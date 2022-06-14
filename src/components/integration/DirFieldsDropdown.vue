<template>
  <b-form-select
    @change="changeHandler"
    v-model="selected"
    class="width-40 mapping-select"
  >
    <template v-for="item in items">
      <b-form-select-option
        :key="item.id"
        :value="item.id"
        :disabled="selectedValues.includes(item.id)"
        >{{ item.display_Name }}</b-form-select-option
      >
    </template>
  </b-form-select>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    // selected: {},
    items: {
      type: Array,
      required: true,
    },
    selectedValues: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: null,
    };
  },
  methods: {
    changeHandler(value) {
      console.log('value', value);
      this.$emit("change", value);
    },
  },
};
</script>
