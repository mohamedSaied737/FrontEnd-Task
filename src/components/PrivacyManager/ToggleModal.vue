<script>
import { mapActions, mapGetters } from "vuex";
import { required} from "vuelidate/lib/validators";
export default {
  name: "DeleteUserType",
  data() {
    return {
      password: null,
      submitted: false,
      toggleValue: null,
      updatedEntity: null,
    };
  },

  validations: {
    password: { required},
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("privacyManager", ["getLoading", "getIsValidPassword"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("entity", ["getEntities"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("togglePrivacyManager");
    },
    password(password){
      this.submitted = true;
      this.$v.$touch();
      this.checkUserPassword(password);
    }
  },
  methods: {
    ...mapActions("entity", ["updateEntity", "checkEntitySubdomain"]),
    ...mapActions("privacyManager", ["togglePrivacyManager", "checkUserPassword", "resetValues"]),
    onSubmit(e) {
      e.preventDefault();
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid && this.getIsValidPassword) {
        this.togglePrivacyManager({
          params: {
            privacyManager: this.toggleValue ? 1 : 0,
          },
        });
      }
    },
  },
  beforeMount() {
    this.resetValues();
    this.getEntities.length > 0 &&this.getEntities.map(entity => {if(entity.id == this.currentEntity.id) {this.updatedEntity = entity} });
    let entityValue =
      this.updatedEntity.setting &&
      this.updatedEntity.setting
        .map((item) => item.name == "privacy_manager" && item.pivot.value)
        .filter(Boolean)[0];
    this.toggleValue = entityValue == 1 ? true : false;
  },
};
</script>
<template>
  <div class="form-groups">
    <p class="text-secondary mb-3">Privacy Manager</p>
    <form autocomplete="off" @submit="onSubmit">
      <!-- switcher  -->
      <b-form-group
        label-cols-sm="1"
        label-cols-lg="1"
        :label="toggleValue ? 'ON' : 'OFF'"
        label-for="mask"
        class="align-items-center input-wrapper mb-0"
      >
        <b-form-checkbox
          switch
          size="lg"
          v-model="toggleValue"
        ></b-form-checkbox>
      </b-form-group>
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
      <div class="d-flex justify-content-end align-items-center mt-1">
        <button
          type="button"
          class="btn btn-outline-secondary px-3 mr-2"
          @click="$bvModal.hide('togglePrivacyManager')"
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
