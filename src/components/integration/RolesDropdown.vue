<template>
  <b-form-select
    @change="changeHandler"
    class="width-40 mapping-select"
    v-model="selected"
  >
    <template v-for="role in roles">
      <b-form-select-option :key="role.id" :value="role">
        {{ role.name }}
      </b-form-select-option>
    </template>
  </b-form-select>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    selected: {},
    roles: {
      type: Array,
      required: true,
    },
  },
  // data() {
  //   return {
  //     selected: { id: null, name: 'Select User Type' },
  //   };
  // },
  methods: {
    changeHandler(value) {
      this.$emit("change", value);
    },
  },
};
</script>
