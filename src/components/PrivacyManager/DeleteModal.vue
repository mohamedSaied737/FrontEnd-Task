<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  name: "DeleteUserType",
  data() {
    return {
      password: null,
      submitted: false,
    };
  },
  validations: {
    password: { required },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("privacyManager", ["getLoading", "getIsValidPassword"]),
    ...mapGetters("authfack", ["getUserPassword"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("deleteUserTypeNow");
    },
        password(password){
      this.submitted = true;
      this.$v.$touch();
      this.checkUserPassword(password);
    }
  },
  methods: {
    ...mapActions("entity", ["updateEntity", "checkEntitySubdomain"]),
    ...mapActions("privacyManager", ["deleteNowUserType", "checkUserPassword", "resetValues"]),
    onSubmit(e) {
      e.preventDefault();
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && this.getIsValidPassword) {
          this.deleteNowUserType(this.getModalInfo);
      }
    },
  },
  beforeMount(){
    this.resetValues();
  }
};
</script>

<template>
  <div class="form-groups">
    <p class="text-secondary mb-3 text-capitalize">
      Delete {{ getModalInfo.params.name }}
      {{
        getModalInfo.params.type != "both"
          ? getModalInfo.params.type
          : "Data & Scans"
      }}
    </p>
    <b-alert show variant="warning">
        <i v-if="getModalInfo.from == 'action'" class="mdi mdi-alert-outline mr-2"></i>This will permanently delete all scans and data</b-alert>
    <!-- password  -->
    <form autocomplete="off" @submit="onSubmit">
      <!-- password  -->
      <b-form-group>
        <span class="password-tip text-muted mb-0"
          >Enter Password To Confirm Changes!</span
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
          class="btn btn-outline-secondary px-3 mr-2"
          @click="$bvModal.hide('deleteUserTypeNow')"
          type="button"
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
