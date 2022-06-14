<script>
import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";
import Layout from "../../layouts/auth-register";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  required,
  email,
  alphaNum,
  numeric,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
import { FormWizard, TabContent } from "vue-form-wizard";
import isValidDomain from "is-valid-domain";
import Multiselect from "vue-multiselect";
import VueCountryCode from "vue-country-code";

export default {
  title: "Register",
  components: { Layout, FormWizard, TabContent, Multiselect, VueCountryCode },
  data() {
    return {
      userCountryCode: null,
      companyCountryCode: null,
      device: "",
      deviceOptions: [
        { id: "LT-Zentron8", name: "LT-Zentron8" },
        { id: "LD-AITemp", name: "LD-AITemp" },
        { id: "Zentron 15", name: "Zentron 15" },
      ],
      form: {
        user: {
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          password: "",
          package: "",
        },
        entity: {
          name: "",
          subdomain: "",
          company_email: "",
          company_phone: "",
          package: "Standalone",
        },
        kiosk: {
          name: null,
          android_serial: "",
          mac_address: "",
          partner_name: "",
          date_of_purchase: "",
          purchased_from: "",
          lamasatech_serial: "",
        },
        lamasatech_serial: {
          id: "",
        },
      },
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
      subdomain: "",
      inputTyping: false,
      // PHONE
      phone_input: null,
      phone_input_company: null,
      checkSubdomain:false,
    };
  },
  validations: {
    device: { required },
    form: {
      user: {
        first_name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(15),
        },
        last_name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(15),
        },
        phone: { required, numeric },
        email: { required, email },
        password: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(20),
        },
      },
      entity: {
        name: { required },
        subdomain: { required },
        company_email: { required, email },
        package: { required },
        company_phone: { required, numeric },
      },
      kiosk: {
        name: { required },
        date_of_purchase: { required },
        purchased_from: { required },
        android_serial: {
          required,
          alphaNum,
          minLength: minLength(6),
        },
        mac_address: {
          required,
          alphaNum,
          minLength: minLength(12),
        },
        lamasatech_serial: {
          required,
          numeric,
        },
      },
    },
    phone_input: { required, numeric },
    phone_input_company: { required, numeric },
  },
  watch: {
    "form.entity.package"(kioskPackage) {
      this.saveKioskPackage(kioskPackage);
    },
    "form.user.password"(pass) {
      this.saveUserPassword(pass);
    },
    'form.entity.subdomain'(subdomain){
      if (isValidDomain(subdomain + this.subdomain, {subdomain: true,})) {
        this.checkDomain(subdomain + this.subdomain);
        this.checkSubdomain = true
      } else {
        this.checkSubdomain = false
      }
    },
    phone_input(phone){
        this.form.user.phone = `${this.userCountryCode}${phone}`
    },
    phone_input_company(phone){
      this.form.entity.company_phone = `${this.companyCountryCode}${phone}`;
    }
  },
  computed: {
    ...mapState("authfack", ["status"]),
    ...mapGetters("authfack", ["loadingStatus"]),
    ...mapGetters("entity", ["getSubdomain"]),
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,
    ...mapActions("authfack", [
      "resetLoading",
      "saveKioskPackage",
      "saveUserPassword",
    ]),
    ...mapActions("entity", ["checkDomain"]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form.entity[name];
      return $dirty ? !$error : null;
    },
    addLamasatechSerial(selectedOption) {
      switch (selectedOption.name) {
        case "LD-AITemp":
        return this.form.kiosk.lamasatech_serial = "7091135919162XXXXX";
        case "LT-Zentron8":
        return this.form.kiosk.lamasatech_serial = "7091136435555XXXXX";
        case "Zentron 15":
        return this.form.kiosk.lamasatech_serial = "5060861160027XXXXX";
        default:""
      }
    },
    tryToRegisterIn() {
      this.submitted = true;
      this.$v.$touch();
      // stop here if form is invalid
      if (!this.$v.$invalid) {
        this.isRegisterError = false;
        this.regError = null;
        this.form.lamasatech_serial.id = this.form.kiosk.lamasatech_serial;
        if (!this.form.entity.subdomain.includes(".")) {
          this.form.entity.subdomain =
            this.form.entity.subdomain + this.subdomain;
        }
        this.registeruser(this.form);
        if (localStorage.getItem("errors")) {
          this.regError = JSON.parse(localStorage.getItem("errors")).errors;
          this.isRegisterError = true;
        }
      }
    },
    beforeTabOneSwitch() {
      // && !this.$v.phone_input 
      if (!this.$v.form.user.$invalid) {
        this.$v.$reset();
        this.submitted = false;
      } else {
        this.$v.$touch();
        this.submitted = true;
      }
      return new Promise((resolve) => {
        resolve(!this.$v.form.user.$invalid);
      });
    },
    beforeTabTwoSwitch() {
      if (!this.$v.form.entity.$invalid) {
        this.$v.$reset();
        this.submitted = false;
      } else {
        this.$v.$touch();
        this.submitted = true;
      }
      if(this.getSubdomain && this.checkSubdomain){
         return  new Promise((resolve) => {
          resolve(!this.$v.form.entity.$invalid);
        })
      }
    },
    beforeTabThreeSwitch() {
      if (!this.$v.form.kiosk.$invalid) {
        this.$v.$reset();
        this.submitted = false;
      } else {
        this.$v.$touch();
        this.submitted = true;
      }
      return new Promise((resolve) => {
        resolve(!this.$v.form.kiosk.$invalid);
      });
    },
    oninputTyping() {
      return (this.inputTyping = true);
    },
    oninputPaste() {
      return (this.inputTyping = true);
    },
    onSelectUserCountryCode({ dialCode }) {
      this.userCountryCode = dialCode;
    },
    onSelectCompanyCountryCode({ dialCode }) {
      this.companyCountryCode = dialCode;
    },
  },
  mounted() {
    // get mac/androied from query
    if (Object.keys(this.$route.query).length > 0) {
      this.form.kiosk.android_serial = this.$route.query.serial;
      this.form.kiosk.mac_address = this.$route.query.mac;
    }
    this.resetLoading();
    let domain = window.location.hostname;
    this.subdomain = "." + domain;
  },
};
</script>

<template>
  <Layout>
    <div id="register-comp" class="row justify-content-center">
      <div class="col-md-11 col-lg-11 col-xl-11">
        <div class="card overflow-hidden">
          <div class="card-body pt-0">
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                border-bottom
                my-2
              "
            >
              <div class="register-title">
                <h3 class="text-dark">Registration</h3>
                <p class="h6">Please fill in the information below...</p>
              </div>
              <div class="logo-wrapper d-flex justify-content-end">
                <img
                  src="@/assets/images/logo-lg.svg"
                  class="unselectable"
                  alt
                  width="50%"
                />
              </div>
            </div>
            <div class="col-sm-12 col-md-8 mx-auto">
              <div class="card">
                <div class="card-body">
                  <div class="errors-wrapper">
                    <b-alert
                      v-model="registerSuccess"
                      class="mt-3"
                      variant="success"
                      dismissible
                      >Registration successfull.
                    </b-alert>
                    <div v-for="reg of regError" :key="reg[0]">
                      <b-alert
                        v-model="isRegisterError"
                        class="mt-3 alert-danger-bg"
                        variant="danger"
                        dismissible
                        >{{ reg[0] }}</b-alert
                      >
                    </div>
                    <div v-if="notification.message">
                      <b-alert
                        v-model="isRegisterError"
                        class="mt-3 alert-danger-bg"
                        variant="danger"
                        dismissible
                        >* {{ notification.message }}</b-alert
                      >
                    </div>
                  </div>
                  <!-- start Wizard -->
                  <form-wizard
                    class="register-form-wizard"
                    color="#103F5E"
                    @on-complete="tryToRegisterIn"
                    step-size="sm"
                  >
                    <!-- Step 1  -->
                    <tab-content
                      icon="mdi mdi-account-circle"
                      title="Personal Info"
                      :before-change="beforeTabOneSwitch"
                    >
                      <div class="row setup-content">
                        <div class="col-12">
                          <!-- first name -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="first_name-group"
                            label="First Name"
                            label-for="first_name"
                          >
                            <b-form-input
                              id="first_name"
                              v-model.trim="form.user.first_name"
                              type="text"
                              placeholder="Enter First Name"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.user.first_name.$error,
                                'is-valid': !$v.form.user.first_name.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted && !$v.form.user.first_name.required
                              "
                              class="invalid-feedback"
                            >
                              First Name is required.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.first_name.minLength
                              "
                              class="invalid-feedback"
                            >
                              First Name should be at least 2 characters.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.first_name.maxLength
                              "
                              class="invalid-feedback"
                            >
                              First Name should be less than 15 characters.
                            </div>
                          </b-form-group>
                          <!-- last name -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="last_name-group"
                            label="Last Name"
                            label-for="last_name"
                          >
                            <b-form-input
                              id="last_name"
                              v-model.trim="form.user.last_name"
                              type="text"
                              placeholder="Enter Last Name"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.user.last_name.$error,
                                'is-valid': !$v.form.user.last_name.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted && !$v.form.user.last_name.required
                              "
                              class="invalid-feedback"
                            >
                              Last Name is required.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.last_name.minLength
                              "
                              class="invalid-feedback"
                            >
                              Last Name should be at least 2 characters.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.last_name.maxLength
                              "
                              class="invalid-feedback"
                            >
                              Last Name should be less than 15 characters.
                            </div>
                          </b-form-group>
                          <!-- phone  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="phone-group"
                            label="Phone"
                            label-for="phone"
                          >
                            <div class="phone-input-wrapper">
                              <VueCountryCode
                                :disabledFetchingCountry="false"
                                @onSelect="onSelectUserCountryCode"
                                :enabledCountryCode="true"
                                :preferredCountries="['GB', 'US', 'CN']"
                              />
                              <b-form-input
                                id="phone"
                                v-model.trim="phone_input"
                                type="text"
                                placeholder="Enter Phone"
                                class="phone-input"
                                :class="{
                                  'is-invalid':
                                    submitted && $v.phone_input.$error,
                                  'is-valid': !$v.phone_input.$invalid,
                                }"
                              ></b-form-input>
                              <div
                                v-if="submitted && !$v.phone_input.required"
                                class="invalid-feedback"
                              >
                                <span class="no-wrap">Phone is required.</span>
                              </div>
                              <div
                                v-if="submitted && !$v.phone_input.numeric"
                                class="invalid-feedback"
                              >
                                <span class="no-wrap">
                                  Phone number should contain only digits.
                                </span>
                              </div>
                            </div>
                          </b-form-group>
                          <!-- email  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="email-group"
                            label="Email"
                            label-for="email"
                          >
                            <b-form-input
                              id="email"
                              v-model.trim="form.user.email"
                              type="text"
                              placeholder="Enter Email"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.user.email.$error,
                                'is-valid': !$v.form.user.email.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="submitted && $v.form.user.email.$error"
                              class="invalid-feedback"
                            >
                              <span v-if="!$v.form.user.email.required"
                                >Email is required.</span
                              >
                              <span v-if="!$v.form.user.email.email">
                                Please enter a valid email address.</span
                              >
                            </div>
                          </b-form-group>
                          <!-- password  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="password-group"
                            label="Password"
                            label-for="password"
                          >
                            <b-form-input
                              autocomplete="new-password"
                              id="password"
                              v-model="form.user.password"
                              type="password"
                              placeholder="Enter Password"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.user.password.$error,
                                'is-valid': !$v.form.user.password.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted && !$v.form.user.password.required
                              "
                              class="invalid-feedback"
                            >
                              Password is required.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.password.minLength
                              "
                              class="invalid-feedback"
                            >
                              Password should be at least 8 characters.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.user.password.maxLength
                              "
                              class="invalid-feedback"
                            >
                              Password should be less than 20 characters.
                            </div>
                          </b-form-group>
                        </div>
                      </div>
                    </tab-content>
                    <!-- Step 2  -->
                    <tab-content
                      icon="bx bx-grid"
                      title="Entity Info"
                      :before-change="beforeTabTwoSwitch"
                    >
                      <div class="row setup-content">
                        <div class="col-12">
                          <!-- compoany name  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="name-group"
                            label="Company Name"
                            label-for="name"
                          >
                            <b-form-input
                              id="name"
                              v-model="form.entity.name"
                              type="text"
                              placeholder="Enter Company Name"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.entity.name.$error,
                                'is-valid': !$v.form.entity.name.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="submitted && !$v.form.entity.name.required"
                              class="invalid-feedback"
                            >
                              Company Name is required.
                            </div>
                          </b-form-group>
                          <!-- sub domain  -->
                          <b-form-group
                            class="no-wrap"
                            label-cols-sm="4"
                            label-cols-lg="3"
                            label="Subdomain"
                            label-for="subdomain"
                          >
                            <b-input-group :append="subdomain">
                              <b-form-input
                                autocomplete="off"
                                id="subdomain"
                                v-model="form.entity.subdomain"
                                type="text"
                                placeholder="Enter Subdomain"
                                :class="{
                                  'is-invalid':
                                    $v.form.entity.subdomain.$error ||
                                    (inputTyping &&
                                      (!checkSubdomain || !getSubdomain)),
                                }"
                                @keypress="oninputTyping"
                                @input="$v.form.entity.subdomain.$touch()"
                                @paste="oninputPaste"
                                :state="
                                  inputTyping && checkSubdomain && getSubdomain
                                    ? true
                                    : null
                                "
                              ></b-form-input>
                              <div
                                v-if="!$v.form.entity.subdomain.required"
                                class="invalid-feedback invalid-subdomain"
                              >
                                Subdomain is required.
                              </div>
                              <div
                                v-else-if="inputTyping && !checkSubdomain"
                                class="invalid-feedback invalid-subdomain"
                              >
                                Subdomain is not valid.
                              </div>
                              <div
                                v-if="inputTyping && getSubdomain == false"
                                class="invalid-feedback invalid-subdomain"
                              >
                                Subdomain is Already Taken!.
                              </div>
                            </b-input-group>
                          </b-form-group>
                          <!-- company email  -->
                          <b-form-group
                          :class="
                            inputTyping &&
                            (!checkSubdomain || !getSubdomain)
                              ? 'email-input'
                              : ''
                          "
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="company_email-group"
                            label="Company Email"
                            label-for="company_email"
                          >
                            <b-form-input
                              id="company_email"
                              v-model="form.entity.company_email"
                              type="text"
                              placeholder="Enter Company Email"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.form.entity.company_email.$error,
                                'is-valid':
                                  !$v.form.entity.company_email.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted &&
                                !$v.form.entity.company_email.required
                              "
                              class="invalid-feedback"
                            >
                              Comapany Email is required.
                            </div>
                            <div
                              v-if="
                                submitted && !$v.form.entity.company_email.email
                              "
                              class="invalid-feedback"
                            >
                              Please enter a valid email address.
                            </div>
                          </b-form-group>
                          <!-- company phone  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="company_phone-group"
                            label="Company Phone"
                            label-for="company_phone"
                          >
                            <div class="phone-input-wrapper">
                              <VueCountryCode
                                :disabledFetchingCountry="false"
                                @onSelect="onSelectCompanyCountryCode"
                                :enabledCountryCode="true"
                                :preferredCountries="['GB', 'US', 'CN']"
                              />
                            <b-form-input
                              id="company_phone"
                              v-model="phone_input_company"
                              type="text"
                              placeholder="Enter Company Phone"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.phone_input_company.$error,
                                'is-valid':
                                  !$v.phone_input_company.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted &&
                                !$v.phone_input_company.required
                              "
                              class="invalid-feedback"
                            >
                            <span class="no-wrap">Phone is required.
                            </span>
                            </div>
                            <div
                              v-if="
                                submitted &&
                                !$v.phone_input_company.numeric
                              "
                              class="invalid-feedback"
                            >
                              <span class="no-wrap">
                              Phone number should contain only digits.
                              </span>
                            </div>
                          </b-form-group>
                          <!-- service  -->
                          <b-form-group
                            v-if="false"
                            label-cols-sm="4"
                            label-cols-lg="3"
                            label="Service"
                            :class="{
                              'is-invalid':
                                submitted && $v.form.entity.package.$error,
                              'is-valid': !$v.form.entity.package.$invalid,
                            }"
                            disabled
                          >
                            <div
                              class="
                                form-radio-wrapper
                                mt-2
                                d-flex
                                align-items-center
                              "
                            >
                              <b-form-radio
                                v-model="form.entity.package"
                                name="standalone"
                                value="Standalone"
                                :class="{
                                  'is-invalid':
                                    submitted &&
                                    !$v.form.entity.package.required,
                                }"
                                >Standalone</b-form-radio
                              >
                              <b-form-radio
                                class="mx-3"
                                :class="{
                                  'is-invalid':
                                    submitted &&
                                    !$v.form.entity.package.required,
                                }"
                                v-model="form.entity.package"
                                name="cloud"
                                value="Cloud"
                                >Cloud</b-form-radio
                              >
                              <div
                                v-if="
                                  submitted && !$v.form.entity.package.required
                                "
                                class="invalid-feedback"
                              >
                                Service From is required.
                              </div>
                            </div>
                          </b-form-group>
                        </div>
                      </div>
                    </tab-content>
                    <!-- Step 3 -->
                    <tab-content
                      icon="bx bx-rocket"
                      title="Last step"
                      :before-change="beforeTabThreeSwitch"
                    >
                      <div class="row setup-content">
                        <div class="col-12">
                          <!-- kiosk name  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            label="Kiosk Name"
                            label-for="kiosk_name"
                          >
                            <b-form-input
                              id="kiosk_name"
                              v-model="form.kiosk.name"
                              type="text"
                              placeholder="Enter Kiosk Name"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.kiosk.name.$error,
                              }"
                            ></b-form-input>
                            <div
                              v-if="submitted && !$v.form.kiosk.name.required"
                              class="invalid-feedback"
                            >
                              Kiosk name is required.
                            </div>
                          </b-form-group>
                          <!-- date  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="date_of_purchase-group"
                            label="Date Of Purchase"
                            label-for="date_of_purchase"
                          >
                            <b-form-input
                              id="date_of_purchase"
                              v-model="form.kiosk.date_of_purchase"
                              type="date"
                              placeholder="Enter date of purchase"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.form.kiosk.date_of_purchase.$error,
                                'is-valid':
                                  !$v.form.kiosk.date_of_purchase.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted &&
                                !$v.form.kiosk.date_of_purchase.required
                              "
                              class="invalid-feedback"
                            >
                              Date Of Purchase is required.
                            </div>
                          </b-form-group>
                          <!-- android serial  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="android_serial-group"
                            label="Android Serial No"
                            label-for="android_serial"
                          >
                            <b-form-input
                              id="android_serial"
                              v-model="form.kiosk.android_serial"
                              type="text"
                              placeholder="Enter Android Serial No"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.form.kiosk.android_serial.$error,
                                'is-valid':
                                  !$v.form.kiosk.android_serial.$invalid,
                              }"
                              :disabled="
                                Object.keys(this.$route.query).length > 0
                              "
                            ></b-form-input>
                            <div
                              v-if="
                                submitted && $v.form.kiosk.android_serial.$error
                              "
                              class="invalid-feedback"
                            >
                              <span
                                v-if="!$v.form.kiosk.android_serial.required"
                                >Kiosk Serial is required.</span
                              >
                              <span
                                v-if="!$v.form.kiosk.android_serial.alphaNum"
                                >Please enter kiosk serial alphaNum.</span
                              >
                              <span
                                v-if="!$v.form.kiosk.android_serial.minLength"
                                >Please enter kiosk serial 6 charcter.</span
                              >
                            </div>
                          </b-form-group>
                          <!-- mac address  -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="android_serial-group"
                            label="MAC Address"
                            label-for="mac_address"
                          >
                            <b-form-input
                              id="mac_address"
                              v-model="form.kiosk.mac_address"
                              type="text"
                              placeholder="Enter MAC Address"
                              :class="{
                                'is-invalid':
                                  submitted && $v.form.kiosk.mac_address.$error,
                                'is-valid': !$v.form.kiosk.mac_address.$invalid,
                              }"
                              :disabled="
                                Object.keys(this.$route.query).length > 0
                              "
                            ></b-form-input>
                            <div
                              v-if="
                                submitted && $v.form.kiosk.mac_address.$error
                              "
                              class="invalid-feedback"
                            >
                              <span v-if="!$v.form.kiosk.mac_address.required"
                                >mac address is required.</span
                              >
                              <span v-if="!$v.form.kiosk.mac_address.alphaNum"
                                >Please enter mac address alphaNum.</span
                              >
                              <span v-if="!$v.form.kiosk.mac_address.minLength"
                                >Please enter mac address 12 charcter.</span
                              >
                            </div>
                          </b-form-group>
                          <!-- Purchased Device -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="Purchased Device"
                            label="Purchased Device"
                            label-for="Purchased Device"
                            :class="{
                              'is-invalid': submitted && $v.device.$error,
                              'is-valid': !$v.device.$invalid,
                            }"
                          >
                            <multiselect
                              id="purchased_device"
                              v-model="device"
                              :options="deviceOptions"
                              placeholder="Select Device"
                              label="name"
                              :show-labels="false"
                              :allowEmpty="true"
                              @select="addLamasatechSerial"
                            />
                            <div
                              v-if="submitted && $v.device.$error"
                              class="invalid-feedback"
                            >
                              <span v-if="!$v.device.required"
                                >Device is required.</span
                              >
                            </div>
                          </b-form-group>
                          <!-- lamasatech serial -->
                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="lamasatech_serial-group"
                            label="LamasaTech Serial"
                            label-for="lamasatech_serial"
                          >
                            <b-form-input
                              id="lamasatech_serial"
                              v-model="form.kiosk.lamasatech_serial"
                              type="text"
                              placeholder="Enter LamasaTech serial"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  $v.form.kiosk.lamasatech_serial.$error,
                                'is-valid':
                                  !$v.form.kiosk.lamasatech_serial.$invalid,
                              }"
                            ></b-form-input>
                            <div
                              v-if="
                                submitted &&
                                !$v.form.kiosk.lamasatech_serial.required
                              "
                              class="invalid-feedback"
                            >
                              LamasaTech Serial is required.
                            </div>
                          </b-form-group>

                          <b-form-group
                            label-cols-sm="4"
                            label-cols-lg="3"
                            label="Purchased From"
                            :class="{
                              'is-invalid':
                                submitted &&
                                $v.form.kiosk.purchased_from.$error,
                              'is-valid':
                                !$v.form.kiosk.purchased_from.$invalid,
                            }"
                          >
                            <div class="form-radio-wrapper mt-2 d-flex">
                              <b-form-radio
                                v-model="form.kiosk.purchased_from"
                                name="lamasatech"
                                value="LamasaTech"
                                :class="{
                                  'is-invalid':
                                    submitted &&
                                    !$v.form.kiosk.purchased_from.required,
                                }"
                                >LamasaTech</b-form-radio
                              >
                              <b-form-radio
                                class="mx-3"
                                :class="{
                                  'is-invalid':
                                    submitted &&
                                    !$v.form.kiosk.purchased_from.required,
                                }"
                                v-model="form.kiosk.purchased_from"
                                name="partner"
                                value="Partner"
                                >Partner</b-form-radio
                              >
                              <div
                                v-if="
                                  submitted &&
                                  !$v.form.kiosk.purchased_from.required
                                "
                                class="invalid-feedback"
                              >
                                Purchased From is required.
                              </div>
                            </div>
                          </b-form-group>
                          <b-form-group
                            v-if="form.kiosk.purchased_from == 'Partner'"
                            label-cols-sm="4"
                            label-cols-lg="3"
                            id="partner_name-group"
                            label="Partner Name"
                            label-for="partner_name"
                          >
                            <b-form-input
                              id="partner_name"
                              v-model="form.kiosk.partner_name"
                              type="text"
                              placeholder="Enter partner name"
                            ></b-form-input>
                          </b-form-group>
                        </div>
                      </div>
                    </tab-content>
                    <button class="btn btn-outline-primary" slot="prev">
                      Back
                    </button>
                    <button class="btn btn-primary" slot="next">
                      Next
                    </button>
                    <b-button
                      class="w-lg"
                      :disabled="loadingStatus"
                      variant="primary"
                      slot="finish"
                    >
                      <i
                        v-if="loadingStatus"
                        class="
                          bx bx-hourglass bx-spin
                          font-size-16
                          align-middle
                          mr-2
                        "
                      ></i>
                      <span v-else>Register</span>
                    </b-button>
                  </form-wizard>
                </div>
              </div>
            </div>
            <div class="mt-5 text-center">
              <p>
                Already have an account ?
                <router-link to="/login" class="text-info">Login</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
#register-comp .is-invalid {
  animation: shake 0.4s ease;
  -webkit-animation: shake 0.4s ease;
  -moz-animation: shake 0.4s ease;
  animation-iteration-count: 1;
  animation-fill-mode: backwards;
}
.email-input {
  margin-top: 2rem;
}
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(10px);
  }
  70% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}
.btn-primary {
  color: #fff;
  background-color: #103f5e;
  border-color: #103f5e;
}
.btn-primary,
.btn-outline-primary {
  padding: 10px 50px;
}
/* Mobile */
@media (max-width: 425px) {
  .btn-primary {
    padding: 10px 35px;
  }
  .btn-outline-primary {
    padding: 10px 35px;
  }
  .w-lg{
    padding: 10px 35px !important;
    padding: 0;
  }
}
</style>
