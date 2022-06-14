<script>
import { mapActions, mapGetters } from "vuex";
import {
  required,
  maxLength,

} from "vuelidate/lib/validators";

export default {
  name: "UpdateActionForm",
  data() {
    return {
      id: null,
      name: null,
      registration_method: null,
      visit_grace_period: 30,
      switch_user_type: false,
      // other
      registration_method_list: [
        {
          id: "PRE_REGISTERED_ONLY",
          name: "Pre-registered only",
        },
        {
          id: "PRE_REGISTERED_WITH_APPROVAL_REQUIRED",
          name: "Pre-registration with approval required",
        },
        {
          id: "REGISTRATION_ALLOWED",
          name: "Registration allowed",
        },
        {
          id: "PRE_REGISTERED_BY_ADMIN",
          name: "Pre-registered by admin",
        },
        {
          id: "REGISTRATION_NOT_REQUIRED",
          name: "Registration not required",
        },
      ],
      parent_user_type: null,
      submitted: false,
    };
  },
  validations: {
    name: { required, maxLength: maxLength(20) },
    // registration_method: {required},
    // visit_grace_period: {
    //   required: requiredIf(function() {
    //     return this.onShowGracePeriodInput;
    //   }),
    //   numeric,
    //   maxLength: maxLength(4),
    // },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("updateUserTypes");
    },
    onShowGracePeriodInput(value) {
      !value && (this.visit_grace_period = null);
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("userType", ["getModalState", "getLoading"]),
    onShowGracePeriodInput() {
      if (this.registration_method) {
        return (
          this.registration_method.name == "Pre-registered only" ||
          this.registration_method.name ==
            "Pre-registration with approval required"
        );
      }
      return false;
    },
    onShowSwitchUserType() {
      if (this.registration_method) {
        return this.registration_method.name == "Pre-registered by admin";
      }
      return false;
    },
    onShowUndefinedUsersText() {
      if (this.registration_method) {
        return this.registration_method.name == "Registration not required";
      }
      return false;
    },
  },
  methods: {
    ...mapActions("userType", ["updateUserType", "resetState"]),
    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$error) {
        const {
          id,
          name,
          registration_method,
          visit_grace_period,
          switch_user_type,
        } = this;
        this.updateUserType({
          id,
          form: {
            userType: {
              name,
            },
            settings: {
              registration_method:
                registration_method && registration_method.id,
              visit_grace_period: visit_grace_period ? visit_grace_period : 30,
              switch_usertype: switch_user_type ? 1 : 0,
            },
          },
        });
      }
    },
  },
  beforeMount() {
    const {resetState, getModalInfo} = this;
    resetState();
    if (getModalInfo) {
      const { id, name, settings } = getModalInfo;
      this.name = name;
      this.id = id;
      settings.length > 0 &&
        settings.map((setting) => {
          switch (setting.name) {
            case "visit_grace_period":
              return (this.visit_grace_period = setting.pivot.value);
            case "switch_usertype":
              return (this.switch_user_type =
                setting.pivot.value == "0" ? false : true);
            case "registration_method":
              return this.registration_method_list.map((method) => {
                return (
                  method.id == setting.pivot.value &&
                  (this.registration_method = method)
                );
              });
            default:
              return "";
          }
        });
    }
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-secondary mb-3">Edit User Type</p>
    <div class="form-groups">
      <!-- name   -->
      <div class="name mb-3">
        <label for="name" class="mb-0 no-wrap no-wrap input-label">Name:</label>
        <b-input
          id="name"
          name="name"
          type="text"
          v-model="name"
          placeholder="Enter name"
        />
        <div class="err-wrapper">
          <div v-if="submitted && !$v.name.required">
            <span class="error-value">User type name is required</span>
          </div>
          <div v-else-if="submitted && !$v.name.maxLength">
            <span class="error-value">The maximum length is 20 characters</span>
          </div>
        </div>
      </div>
      <!-- registration-method  -->
      <!-- <div class="registration-method mb-3">
        <label for="method" class="mb-0 no-wrap no-wrap input-label"
          >Registration Method:</label
        >
        <multiselect
          id="method"
          v-model="registration_method"
          :options="registration_method_list"
          placeholder="Registration Method"
          label="name"
          :show-labels="false"
          :allowEmpty="true"
        />
        <div class="err-wrapper">
            <div v-if="submitted && !$v.registration_method.required">
              <span class="error-value">Registration method is required</span>
            </div>
        </div>
        <p v-if="onShowUndefinedUsersText" class="mb-0 text-muted">
          Undefined users will sign in to your company as this user type if
          added to a flow in the applied journey.
        </p>
      </div> -->
      <!-- visit grace period  -->
      <!-- <div class="period mb-3" v-if="onShowGracePeriodInput">
        <label for="period" class="mb-0 no-wrap no-wrap input-label"
          >Visit Grace Period:</label
        >
        <b-input
          id="period"
          name="period"
          type="number"
          v-model="visit_grace_period"
          placeholder="Enter grace period in minutes"
        />
        <div class="err-wrapper">
          <div v-if="submitted && !$v.visit_grace_period.required">
            <span class="error-value">Visit Grace Period is required</span>
          </div>
          <div v-else-if="submitted && !$v.visit_grace_period.maxLength">
            <span class="error-value">The maximum length is 4 digits</span>
          </div>
        </div>
      </div> -->
      <!-- switch user type  -->
      <!-- <div class="switch-user-type mb-3" v-if="onShowSwitchUserType">
        <b-form-checkbox
          v-model="switch_user_type"
          class="custom-checkbox-primary"
          checked
        >
          Give the user the ability to switch his user type
        </b-form-checkbox>
        <p class="mb-0 text-muted">
          I.e. the staff member will be able to change his user type without
          referring to the admin
        </p>
      </div> -->
    </div>
    <div class="action-btns">
      <button
        :disabled="getLoading"
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span v-else>Update</span>
      </button>
      <button
        class="btn btn-outline-danger cancel-btn"
        @click="$bvModal.hide('updateUserTypes')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.update-user-type-wrapper {
  .form-groups {
    padding-bottom: 1%;
  }
  .input-label {
    width: 400px;
  }
  .action-btns {
    margin-top: 40px;
  }
}
</style>
