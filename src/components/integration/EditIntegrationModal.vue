<template>
  <section class="wrapper">
    <div class="content">
      <b-form id="form" novalidate>
        <div class="mb-2">
          <multiselect
            class="user-types-select"
            id="userType"
            v-model="value"
            :options="options"
            placeholder="Select a user type"
            :show-labels="false"
            :allowEmpty="true"
          >
          </multiselect>
        </div>
        <div class="input-wrapper width-32">
          <div class="form-group m-d-gruop ">
            <b-form-input
              id="firstName"
              name="firstName"
              type="text"
              required
            />
            <label for="firstName">First Name</label>
          </div>
        </div>
        <div class="input-wrapper width-32">
          <div class="form-group m-d-gruop ">
            <b-form-input
              id="lasttName"
              name="lasttName"
              type="text"
              required
            />
            <label for="lasttName">Last Name</label>
          </div>
        </div>
      </b-form>
    </div>
  </section>
</template>
<script>
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      value: null,
      options: ["user", "visitor", "walk-in"],
    };
  },
};
</script>
