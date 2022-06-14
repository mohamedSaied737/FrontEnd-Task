<template>
  <div>
    <div class="input-wrapper">
      <div
        class="form-group m-d-gruop"
        :class="{ 'invalid-field': submitted && checkErr(errors, element) }"
      >
        <b-form-input type="text" v-model="element.value" required />
        <label for="field.key_code">{{ element.name }}</label>
      </div>
    </div>
    <div class="err-wrapper mb-3">
      <div v-if="submitted && !element.value">
        <span class="error-value">{{ element.name }} is required.</span>
      </div>
      <div v-for="(error, index) in errors" :key="index">
        <div
          v-if="
            !error.general_error && error.key == element.key_code && submitted
          "
        >
          <span class="error-value">{{ error.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["element", "index", "submitted", "errors"],
  methods: {
    checkErr(errors, element) {
      console.log("checkerr", element, !element.value);
      if (!element.value) return true;
      let invalid = false;
      errors.map((error) => {
        if (error && !error.general_error && error.key == element.key_code) {
          console.log("true");
          invalid = true;
        }
      });
      // console.log('invalid', invalid);
      // return !!err;
      return invalid;
    },
  },
};
</script>

<style lang="scss">
.invalid-field {
  border: 1.5px solid #f46a6a !important;
  border-radius: 4px !important;
}
</style>

