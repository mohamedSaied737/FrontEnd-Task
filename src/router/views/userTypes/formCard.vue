<template>
  <div id="formCard">
    <b-form class="row" @submit.prevent="onSubmit">
      <b-card class="form-card">
        <h5 class="mb-2 form-title">{{ formTitle }}</h5>
        <h6 class="form-subtitle">Fill in information below</h6>
        <!-- name input  -->
        <div class="name mb-3">
          <label for="name" class="mb-0 no-wrap no-wrap input-label"
            >Name:</label
          >
          <b-input id="name" name="name" type="text" v-model="form.name" placeholder="Name" />
          <div class="err-wrapper">
            <div v-if="submitted && !$v.form.name.required">
              <span class="error-value">User type name is required</span>
            </div>
              <div v-else-if="submitted && !$v.form.name.maxLength">
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
            v-model="form.registration_method"
            :options="registration_method_list"
            placeholder="Select Registration Method"
            label="name"
            :show-labels="false"
            :allowEmpty="true"
          />
          <div class="err-wrapper">
            <div v-if="submitted && !$v.form.registration_method.required">
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
            v-model="form.visit_grace_period"
            placeholder="Enter grace period in minutes"
          />
          <div class="err-wrapper">
            <div v-if="submitted && !$v.form.visit_grace_period.required">
              <span class="error-value">Visit grace period is required</span>
            </div>
              <div v-else-if="submitted && !$v.form.visit_grace_period.maxLength">
              <span class="error-value">The maximum length is 4 digits</span>
            </div>
          </div>
        </div> -->
        <!-- switch user type  -->
        <!-- <div class="switch-user-type mb-3" v-if="onShowSwitchUserType">
          <b-form-checkbox
            v-model="form.switch_user_type"
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
        <div class="action-btns">
          <button
            type="submit"
            :disabled="getLoading || disableWatcher"
            class="submit-btn btn btn-primary"
            size="md"
          >
            <i
              v-if="getLoading"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
            ></i>
            <span v-else>
              Submit
            </span>
          </button>
          <router-link to="/user-types">
            <button class="btn btn-outline-danger cancel-btn">
              Cancel
            </button>
          </router-link>
        </div>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  props: [
    "parentTypes",
    "mode",
    "parentId",
    "formTitle",
    "parentSettings",
    "parentName",
  ],
  data: function() {
    return {
      userTypes: [],
      form: {
        parentId: null,
        type: null,
        name: "",
        parent: null,
        subParent: null,
        entity_id: null,
        registration_method: null,
        visit_grace_period: 30,
        switch_user_type: false,
      },
      isFormSubmitted: false,
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
  validations:{
     form:{
       name:{required,maxLength: maxLength(20)},
      //  registration_method:{required},
      //  visit_grace_period:{
      // required: requiredIf(function() {
      //       return this.onShowGracePeriodInput;
      //     }),
      //    numeric,
      //    maxLength: maxLength(4)}
     }
  },
  watch: {
    parentName(name) {
      this.parent_user_type = name;
    },
    onShowGracePeriodInput(value){
      !value && (this.form.visit_grace_period=null)
    }
  },
  computed: {
    ...mapGetters("userType", ["getLoading"]),
        ...mapGetters("authfack", ["currentEntity",]),
    disableWatcher() {
      const { name } = this.form;
      return name ? false : true;
    },
    onShowGracePeriodInput() {
      if (this.form.registration_method) {
        return (
          this.form.registration_method.name == "Pre-registered only" ||
          this.form.registration_method.name ==
            "Pre-registration with approval required"
        );
      }
      return false;
    },
    onShowSwitchUserType() {
      if (this.form.registration_method) {
        return this.form.registration_method.name == "Pre-registered by admin";
      }
      return false;
    },
    onShowUndefinedUsersText() {
      if (this.form.registration_method) {
        return (
          this.form.registration_method.name == "Registration not required"
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions("userType", ["createUserType"]),
    onSubmit() {
      this.submitted = true;
      let entity_id = this.currentEntity.id;
      let {parentId} = this;
      this.$v.$touch();
      let {
        name,
        switch_user_type,
        visit_grace_period,
        registration_method
      } = this.form;
      if(!this.$v.$error){
        this.createUserType({
          userType: {
            name,
            parent_id: parentId,
            entity_id,
          },
          settings: {
            registration_method:registration_method&&registration_method.id,
            visit_grace_period:visit_grace_period?visit_grace_period:30,
            switch_usertype:switch_user_type?1:0
            },
        });
      }
    },
  },
  beforeMount(){
    this.form.parentId = this.parentId;
    this.form.entity_id = this.currentEntity.id
  },
};
</script>

<style lang="scss" scoped>
$textColor: #495057;
#formCard {
  border-radius: 25px;
  position: relative;
  .form-card {
    width: 100%;
    .form-subtitle {
      color: #74788d;
      letter-spacing: 0.25px;
      line-height: 16px;
      font-size: 14px;
      margin: 0px 10px 20px 0px;
    }
    .action-btns {
      margin-top: 40px;
    }
    .err-wrapper{
      div{
        margin-top: 5px;
      }
    }
  }
}
</style>
