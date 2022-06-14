<script>
import { mapActions, mapGetters } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";
export default {
  name: "DeleteUserType",
  data() {
    return {
      password: null,
      submitted: false,
      dataRetention: null,
      scansRetention: null,
    };
  },

  validations: {
    dataRetention: { required, numeric },
    scansRetention: { required, numeric },
    password: { required },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("privacyManager", ["getLoading", "getIsValidPassword"]),
    ...mapGetters("authfack", ["getUserPassword", "currentEntity"]),
    ...mapGetters("entity", ["getEntities"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("editData&Scans");
    },
    password(password){
      this.submitted = true;
      this.$v.$touch();
      this.checkUserPassword(password);
    }
  },
  methods: {
    ...mapActions("entity", ["fetchEntities"]),
    ...mapActions("privacyManager", ["editUserType", "checkUserPassword", "resetValues"]),
    onSubmit(e) {
      e.preventDefault();
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && this.getIsValidPassword) {
        this.editUserType({
          params: {
            userTypes: [
              {
                id: this.getModalInfo.data.id,
                settings: [
                  {
                    id: this.getModalInfo.dataRetention[0].id,
                    value: this.dataRetention,
                  },
                  {
                    id: this.getModalInfo.scansRetention[0].id,
                    value: this.scansRetention,
                  },
                ],
              },
            ],
          },
        });
      }
    },
  },
  beforeMount() {
    this.dataRetention = this.getModalInfo.dataRetention[0].value;
    this.scansRetention = this.getModalInfo.scansRetention[0].value;
    this.resetValues();
  },
};
</script>
<template>
  <div class="form-groups">
    <p class="text-secondary mb-3">Edit Data and Scans</p>
    <form autocomplete="off" @submit="onSubmit">
      <!-- Data Retention -->
      <b-form-group
        label-cols-sm="3"
        label-cols-lg="3"
        label="Data Retention"
        label-for="mask"
        class="align-items-center input-wrapper"
      >
        <b-input
          class="text-muted input-hide-arrow"
          :class="{ 'is-invalid': submitted && $v.dataRetention.$error }"
          type="number"
          v-model="dataRetention"
          size="md"
          placeholder="Enter Data Retention in Days"
          style="min-width: 40px"
          debounce="500"
          min="0"
        />
        <div v-if="submitted && !$v.dataRetention.required" class="text-danger">
          <span style="font-size: 0.8rem" class="font-weight-normal"
            >Required Data Retention!</span
          >
        </div>
        <div
            v-else-if="submitted && !$v.dataRetention.numeric"
            class="invalid-feedback"
          >
          <span class="no-wrap">
            Data Retention Should be a postive number.
          </span>
        </div>
      </b-form-group>
      <!-- Scans Retention -->
      <b-form-group
        label-cols-sm="3"
        label-cols-lg="3"
        label="Scans Retention"
        label-for="mask"
        class="align-items-center input-wrapper"
      >
        <b-input
          class="text-muted input-hide-arrow"
          :class="{ 'is-invalid': submitted && $v.scansRetention.$error }"
          type="number"
          v-model="scansRetention"
          size="md"
          placeholder="Enter Scans Retention in Days"
          style="min-width: 40px"
          debounce="500"
        />
        <div
          v-if="submitted && !$v.scansRetention.required"
          class="text-danger"
        >
          <span style="font-size: 0.8rem" class="font-weight-normal"
            >Required Scans Retention!</span
          >
        </div>
        <div
            v-else-if="submitted && !$v.dataRetention.numeric"
            class="invalid-feedback"
          >
          <span class="no-wrap">
            Scans Retention should be a postive number.
          </span>
        </div>
      </b-form-group>
      <!-- password  -->
            <b-form-group
            label-cols-sm="3" label-cols-lg="3" label="Password"
            >

        <b-input
          :class="{
            'is-invalid': submitted && !getIsValidPassword,
            'is-valid': submitted && getIsValidPassword,
          }"
          type="password"
          v-model="password"
          size="md"
          placeholder="Enter Password"
        />
        <div v-if="submitted && !$v.password.required">
          <span style="font-size: 0.8rem" class="font-weight-normal text-danger"
            >Required Password!</span
          >
        </div>
        <div
          v-else-if="submitted && !getIsValidPassword"
        >
          <span style="font-size: 0.8rem" class="font-weight-normal text-danger"
            >Current Password is Not Correct!</span
          >
        </div>
      </b-form-group>

      <!-- action btns  -->
      <div class="d-flex justify-content-end align-items-center mt-3">
        <button
          type="button"
          class="btn btn-outline-secondary px-3 mr-2"
          @click="$bvModal.hide('editData&Scans')"
        >
          Cancel
        </button>
        <button
          class="submit-btn btn btn-primary px-4"
          size="md"
          type="submit"
          :disabled="getLoading"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          Confirm
        </button>
      </div>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.form-wrapper .form-row {
  align-items: start;
}
.password-tip {
  font-size: 0.6rem;
}
</style>
