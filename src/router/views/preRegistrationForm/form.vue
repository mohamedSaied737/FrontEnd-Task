<template>
  <div class="pre-register-wrapper">
    <Form-wizard
      ref="pre_reg_form"
      class="pre-register-form"
      :class="!getPreRegistrationTypes.length ? 'no-usr-pre-register-form' : ''"
    >
      <!-- tab 1 -->
      <tab-content :befor-change="handelNextClick">
        <div id="preloader">
          <div id="status">
            <div class="spinner-chase">
              <div class="chase-dot"></div>
              <div class="chase-dot"></div>
              <div class="chase-dot"></div>
              <div class="chase-dot"></div>
              <div class="chase-dot"></div>
              <div class="chase-dot"></div>
            </div>
          </div>
        </div>
        <section
          :class="
            !getPreRegistrationTypes.length
              ? 'no-usr-pre-reg-head-tab1'
              : 'pre-reg-head-tab1'
          "
        >
          <div class="visit-register-header">
            <div class="logo">
              <img src="@/assets/images/logo-lg.svg" alt="-visipoint-logo" />
            </div>
          </div>
          <h3 class="welcome-msg">Welcome</h3>
          <div v-if="getPreRegistrationTypes.length > 0">
            <p class="reg-msg-tab1">Register for a visit</p>
          </div>
        </section>
        <div v-if="getPreRegistrationTypes.length > 0">
          <p class="select-type-msg">Select User Type</p>
          <div class="btns-grid">
            <b-button
              v-for="type in getPreRegistrationTypes"
              :key="type.id"
              @click="handelClick(type)"
              pill
              :variant="toggleValue == type.id ? 'dark' : 'light'"
              >{{ type.name }}
            </b-button>
          </div>
          <hr v-if="getPreRegistrationTypes.length > 0" class="h-line-tab1" />
          <section>
            <div style="margin-bottom: 66px">
              <p class="date-time-lable">Visit Date and Time</p>
              <div class="date-piker-wrapper">
                <div class="date-time-wrappers date-p">
                  <date-picker
                    id="visit_date"
                    class="pre-reg-datepicker"
                    :class="
                      !checkValidation && dateValidation ? 'is-invalid' : ''
                    "
                    :first-day-of-week="1"
                    lang="en"
                    v-model="dateValue"
                    placeholder="Visit Date"
                    value-type="date"
                    :disabledDate="disableDateBeforeCurrent"
                  >
                    <i
                      slot="icon-calendar"
                      style="margin-right: 10px"
                      v-if="!dateValue"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.666656 14.8332C0.666656 16.2498 1.74999 17.3332 3.16666 17.3332H14.8333C16.25 17.3332 17.3333 16.2498 17.3333 14.8332V8.1665H0.666656V14.8332ZM14.8333 2.33317H13.1667V1.49984C13.1667 0.999837 12.8333 0.666504 12.3333 0.666504C11.8333 0.666504 11.5 0.999837 11.5 1.49984V2.33317H6.49999V1.49984C6.49999 0.999837 6.16666 0.666504 5.66666 0.666504C5.16666 0.666504 4.83332 0.999837 4.83332 1.49984V2.33317H3.16666C1.74999 2.33317 0.666656 3.4165 0.666656 4.83317V6.49984H17.3333V4.83317C17.3333 3.4165 16.25 2.33317 14.8333 2.33317Z"
                          fill="#787878"
                        />
                      </svg>
                    </i>
                    <i
                      slot="icon-calendar"
                      style="margin-right: 10px"
                      v-if="dateValue"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.666626 14.8327C0.666626 16.2493 1.74996 17.3327 3.16663 17.3327H14.8333C16.25 17.3327 17.3333 16.2493 17.3333 14.8327V8.16602H0.666626V14.8327ZM14.8333 2.33268H13.1666V1.49935C13.1666 0.999349 12.8333 0.666016 12.3333 0.666016C11.8333 0.666016 11.5 0.999349 11.5 1.49935V2.33268H6.49996V1.49935C6.49996 0.999349 6.16663 0.666016 5.66663 0.666016C5.16663 0.666016 4.83329 0.999349 4.83329 1.49935V2.33268H3.16663C1.74996 2.33268 0.666626 3.41602 0.666626 4.83268V6.49935H17.3333V4.83268C17.3333 3.41602 16.25 2.33268 14.8333 2.33268Z"
                          fill="#103F5E"
                        />
                      </svg>
                    </i>
                  </date-picker>
                </div>
                <div class="date-time-wrappers">
                  <date-picker
                    class="pre-reg-datepicker"
                    :class="
                      !checkValidation && timeValidation ? 'is-invalid' : ''
                    "
                    :use12h="true"
                    :show-second="false"
                    format="HH:mm A"
                    lang="en"
                    v-model="timeValue"
                    value-type="date"
                    type="time"
                    :open.sync="open"
                    placeholder="Visit Time"
                    @change="handleTimeChange"
                    :disabled="!dateValue"
                    :hour-options="availableHours"
                    :minute-options="availableMinuts"
                    :default-value="new Date(new Date().getTime() + 5 * 60000)"
                  >
                    <i
                      slot="icon-calendar"
                      style="margin-right: 10px"
                      v-if="!timeValue"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.5 0.75C4.6875 0.75 0.75 4.6875 0.75 9.5C0.75 14.3125 4.6875 18.25 9.5 18.25C14.3125 18.25 18.25 14.3125 18.25 9.5C18.25 4.6875 14.3125 0.75 9.5 0.75ZM12.5625 11.25C12.3 11.6875 11.775 11.775 11.3375 11.6L9.0625 10.2875C8.8 10.1125 8.625 9.85 8.625 9.5V5.125C8.625 4.6 8.975 4.25 9.5 4.25C10.025 4.25 10.375 4.6 10.375 5.125V8.975L12.2125 10.025C12.65 10.2875 12.7375 10.8125 12.5625 11.25Z"
                          fill="#787878"
                        />
                      </svg>
                    </i>
                    <i
                      slot="icon-calendar"
                      style="margin-right: 10px"
                      v-if="timeValue"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.5 0.75C4.6875 0.75 0.75 4.6875 0.75 9.5C0.75 14.3125 4.6875 18.25 9.5 18.25C14.3125 18.25 18.25 14.3125 18.25 9.5C18.25 4.6875 14.3125 0.75 9.5 0.75ZM12.5625 11.25C12.3 11.6875 11.775 11.775 11.3375 11.6L9.0625 10.2875C8.8 10.1125 8.625 9.85 8.625 9.5V5.125C8.625 4.6 8.975 4.25 9.5 4.25C10.025 4.25 10.375 4.6 10.375 5.125V8.975L12.2125 10.025C12.65 10.2875 12.7375 10.8125 12.5625 11.25Z"
                          fill="#103F5E"
                        />
                      </svg>
                    </i>
                  </date-picker>
                </div>
              </div>
              <p
                v-if="!checkValidation && timeValidation && dateValidation"
                class="time-error"
              >
                Visit Date and time can’t be before now.
              </p>
              <p
                v-else-if="!checkValidation && timeValidation"
                class="time-error"
              >
                Visit time can’t be before now.
              </p>
              <p
                v-else-if="!checkValidation && dateValidation"
                class="time-error"
              >
                Visit date can’t be before today.
              </p>
            </div>
          </section>
        </div>
        <div
          v-if="!getPreRegistrationTypes.length"
          class="reg-not-available-msg"
        >
          Registration is not available via this link. Please feel free to
          contact the administrator of the site.
        </div>
        <div
          v-if="!getPreRegistrationTypes.length"
          class="no-usr-margin-box"
        ></div>
        <b-button
          v-if="getPreRegistrationTypes.length"
          @click="switchBtn()"
          :disabled="!checkValidation"
          :class="
            checkValidation == true
              ? 'next-btn activ-btn'
              : 'next-btn dimmed-btn'
          "
          size="lg"
        >
          NEXT
        </b-button>
      </tab-content>
      <!-- tab 2 -->
      <tab-content :befor-change="handelNextClick">
        <div class="visit-register">
          <div class="visit-register-header">
            <div class="logo-2">
              <img src="@/assets/images/logo-lg.svg" alt="-visipoint-logo" />
            </div>
            <p class="form-title">Register for a visit</p>
            <p class="sub-title">
              Already have a passport account?
              <router-link to="/login" class="login-btn"> LOGIN</router-link>
            </p>
          </div>
          <div class="content">
            <b-form @submit.prevent="onSubmit" novalidate>
              <div class="row-group first-last-name-wrapper">
                <!-- first name  -->
                <div class="first-name">
                  <div
                    class="form-group m-d-gruop"
                    :class="$v.form.first_name.$error && 'invalid-value'"
                  >
                    <div class="required-star">
                      <span class="required">*</span>
                    </div>
                    <input
                      v-model="form.first_name"
                      type="text"
                      class="form-control"
                      id="first_name"
                      required
                    />
                    <label for="first_name">First Name</label>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="submitted && !$v.form.first_name.required">
                      <span class="error-value">First name is required</span>
                    </div>
                    <div v-if="submitted && !$v.form.first_name.maxLength">
                      <span class="error-value">Maximum 30 characters</span>
                    </div>
                  </div>
                </div>
                <!-- last name  -->
                <div class="last-name">
                  <div
                    class="form-group m-d-gruop"
                    :class="$v.form.last_name.$error && 'invalid-value'"
                  >
                    <div class="required-star">
                      <span class="required">*</span>
                    </div>
                    <b-form-input
                      id="last_name"
                      v-model.trim="form.last_name"
                      type="text"
                      required
                    />
                    <label for="last_name">Last Name</label>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="submitted && !$v.form.last_name.required">
                      <span class="error-value">Last name is required.</span>
                    </div>
                    <div v-if="submitted && !$v.form.last_name.maxLength">
                      <span class="error-value">Maximum 30 characters</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- company  -->
              <div class="company-name">
                <div
                  class="form-group m-d-gruop"
                  :class="$v.form.company_name.$invalid"
                >
                  <b-form-input
                    id="company"
                    v-model.trim="form.company_name"
                    type="text"
                    required
                  />
                  <label for="company">Company Name</label>
                </div>
                <div class="err-wrapper">
                  <div v-if="submitted && !$v.form.company_name.maxLength">
                    <span class="error-value">Maximum 30 characters</span>
                  </div>
                </div>
              </div>
              <!-- register email phone  -->
              <div class="register-email-phone" v-if="form.register_check">
                <div class="register-hint">
                  <hr class="h-line" />
                  <p class="hint-label">Add Email Address or Phone Number</p>
                </div>
                <!-- email   -->
                <div class="email-wrapper">
                  <div
                    class="form-group m-d-gruop"
                    :class="$v.form.email.$error && 'invalid-value'"
                  >
                    <b-form-input
                      id="email"
                      v-model.trim="form.email"
                      type="text"
                      required
                      class="form-control"
                      @input="$v.form.email.$touch()"
                      @keypress="onEmailTyping"
                      @paste="onEmailTyping"
                    />
                    <label for="email">Email Address</label>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="email_typing && !$v.form.email.required">
                      <span class="error-value">Email is required.</span>
                    </div>
                    <div v-else-if="email_typing && !$v.form.email.email">
                      <span class="error-value">Please enter valid email.</span>
                    </div>
                    <div
                      v-else-if="
                        email_typing &&
                        form.email &&
                        getEmailDuplicatedCheck &&
                        !getEmailDuplicatedCheck.available &&
                        getEmailDuplicatedCheck.msg.length == 0
                      "
                    >
                      <span class="error-value"
                        >Email address already exists, register with a different
                        one or
                        <router-link tag="a" to="/login" class="redirect-login"
                          >LOGIN</router-link
                        ></span
                      >
                    </div>
                    <div
                      v-else-if="
                        email_typing &&
                        form.email &&
                        getEmailDuplicatedCheck &&
                        getEmailDuplicatedCheck.msg.length > 0
                      "
                    >
                      <span class="error-value"
                        >A deactivated account with this email address already
                        exists, login to reactivate your account.
                        <router-link tag="a" to="/login" class="redirect-login"
                          >LOGIN</router-link
                        ></span
                      >
                    </div>
                  </div>
                </div>
                <!-- phone  -->
                <div class="input-wrapper current-phone">
                  <div class="row-group phone-group justify-content-start">
                    <VueCountryCode
                      class="country-code-input"
                      :disabledFetchingCountry="false"
                      @onSelect="onSelectUserCountryCode"
                      :enabledCountryCode="true"
                      :preferredCountries="['GB', 'US', 'CN']"
                    />
                    <div class="form-group m-d-gruop w-100 mb-0">
                      <b-form-input
                        id="phone"
                        v-model.trim="phone_input"
                        type="number"
                        required
                        @input="$v.phone_input.$touch()"
                        @keypress="onPhoneInputTyping"
                      />
                      <label for="phone">Phone Number</label>
                    </div>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="phoneInputTyping && !$v.phone_input.required">
                      <span class="error-value"
                        >Phone number or email is required</span
                      >
                    </div>
                    <div
                      v-else-if="
                        phoneInputTyping &&
                        phone_input &&
                        getPhoneDuplicatedCheck &&
                        !getPhoneDuplicatedCheck.available &&
                        getPhoneDuplicatedCheck.msg.length == 0
                      "
                    >
                      <span class="error-value"
                        >Phone number already exists, register with a different
                        one or
                        <router-link tag="a" to="/login" class="redirect-login"
                          >LOGIN</router-link
                        ></span
                      >
                    </div>
                    <div
                      v-else-if="
                        phoneInputTyping &&
                        phone_input &&
                        getPhoneDuplicatedCheck &&
                        getPhoneDuplicatedCheck.msg.length > 0
                      "
                    >
                      <span class="error-value"
                        >A deactivated account with this phone number already
                        exists, login to reactivate your account.
                        <router-link tag="a" to="/login" class="redirect-login"
                          >LOGIN</router-link
                        ></span
                      >
                    </div>
                    <div v-else-if="submitted && !$v.phone_input.numeric">
                      <span class="error-value">
                        Phone number should contain only digits.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="passport-email-phone" v-else>
                <!-- email   -->
                <div class="email-wrapper">
                  <div
                    class="form-group m-d-gruop"
                    :class="$v.form.email.$error && 'invalid-value'"
                  >
                    <b-form-input
                      id="email"
                      v-model.trim="form.email"
                      type="text"
                      required
                      class="form-control"
                      @input="$v.form.email.$touch()"
                    />
                    <label for="email">Email Address</label>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="email_typing && !$v.form.email.email">
                      <span class="error-value">Please enter valid email.</span>
                    </div>
                  </div>
                </div>
                <!-- phone  -->
                <div class="input-wrapper current-phone">
                  <div class="row-group phone-group justify-content-start">
                    <VueCountryCode
                      class="country-code-input"
                      :disabledFetchingCountry="false"
                      @onSelect="onSelectUserCountryCode"
                      :enabledCountryCode="true"
                      :preferredCountries="['GB', 'US', 'CN']"
                    />
                    <div class="form-group m-d-gruop w-100 mb-0">
                      <b-form-input
                        class="input-hide-arrow"
                        id="phone"
                        v-model.trim="phone_input"
                        type="number"
                        required
                      />
                      <label for="phone">Phone Number</label>
                    </div>
                  </div>
                  <div class="err-wrapper">
                    <div v-if="submitted && !$v.phone_input.numeric">
                      <span class="error-value">
                        Phone number should contain only digits.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- register account check  -->
              <div class="register-account-check-wrapper register-checkbox">
                <b-form-checkbox
                  class="custom-checkbox-dark custom-checkbox"
                  v-model="form.register_check"
                >
                </b-form-checkbox>
                <p class="text">
                  Register for a VisiPoint Passport and get an indefinitely
                  valid QR code to sign in at any VisiPoint ready location
                </p>
              </div>
            </b-form>
          </div>
        </div>
      </tab-content>
      <!-- actions  -->
      <span slot="next"></span>
      <!-- submit btn  -->
      <b-button
        v-if="!form.register_check"
        slot="finish"
        variant="primary"
        type="submit"
        class="generate-btn activ-btn"
        :disabled="
          disableSubmitBtn ||
          (form.register_check && hasAnyValidationErr) ||
          $v.$anyError
        "
      >
        Generate
      </b-button>
      <!-- Register -->
      <b-button
        v-if="form.register_check"
        slot="finish"
        variant="primary"
        type="submit"
        class="generate-btn activ-btn"
        :disabled="
          disableSubmitBtn ||
          (form.register_check && hasAnyValidationErr) ||
          $v.$anyError
        "
      >
        Register
      </b-button>
      <span slot="back"></span>
    </Form-wizard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import {
  numeric,
  required,
  email,
  maxLength,
  requiredIf,
} from "vuelidate/lib/validators";
import VueCountryCode from "vue-country-code";
export default {
  page: {
    title: "Pre-Registration form",
  },
  components: {
    FormWizard,
    TabContent,
    VueCountryCode,
  },

  beforeMount() {
    this.fetchRegistrationTypes(this.$route.params.id);
  },
  mounted() {
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";
      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 1200);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  },
  name: "PreRegistrationForm",
  watch: {
    pre_registration_method() {
      this.handelNextStep();
    },
    timeValue() {
      this.handelNextStep();
    },
    dateValue() {
      this.handelNextStep();
    },

    phone_input(phone_input) {
      if (phone_input && phone_input.length > 0) {
        this.form.phone = `${this.userCountryCode}${phone_input}`;
        if (this.form.register_check) {
          // enable api if the register check is true
          this.phoneInputTyping = true;
          setTimeout(() => {
            this.checkDuplicated({
              field: "phone",
              value: `${this.userCountryCode}${phone_input}`,
            });
          }, 500);
        }
      } else {
        this.form.phone = null;
      }
    },
    "form.email"(email) {
      if (email && email.length > 0 && this.form.register_check) {
        this.email_typing = true;
        setTimeout(() => {
          this.checkDuplicated({
            field: "email",
            value: email,
          });
        }, 500);
      }
    },
  },
  data() {
    return {
      checkValidation: false,
      timeValidation: false,
      dateValidation: false,
      toggleValue: null,
      dateValue: null,
      timeValue: null,
      open: false,
      selected_user_type: [],
      pre_registration_method: null,
      // Tab 2
      form: {
        first_name: null,
        last_name: null,
        email: null,
        company_name: null,
        phone: null,
        register_check: false,
      },
      submitted: false,
      email_typing: false,
      phoneInputTyping: false,
      phone_input: null,
      userCountryCode: null,
    };
  },
  validations: {
    form: {
      first_name: {
        required,
        maxLength: maxLength(30),
      },
      last_name: {
        required,
        maxLength: maxLength(30),
      },
      company_name: {
        maxLength: maxLength(30),
      },
      email: {
        email,
        required: requiredIf(function () {
          const {
            form: { register_check },
            phone_input,
          } = this;
          return register_check && !phone_input;
        }),
      },
    },
    phone_input: {
      required: requiredIf(function () {
        const {
          form: { email, register_check },
        } = this;
        return register_check && !email;
      }),
      numeric,
      maxLength: maxLength(30),
    },
  },
  computed: {
    ...mapGetters("userType", ["getPreRegistrationTypes"]),
    availableHours: function () {
      let todayDate = new Date();
      let dateString = todayDate.toISOString().slice(0, 10);
      if (this.dateValue?.toISOString().slice(0, 10) === dateString) {
        let cTime = new Date().getHours();
        return this.range(cTime, 23);
      }
      return this.range(0, 23);
    },
    availableMinuts: function () {
      let todayDate = new Date();
      let dateString = todayDate.toISOString().slice(0, 10);
      if (this.dateValue?.toISOString().slice(0, 10) === dateString) {
        let cTime = new Date().getHours();
        let selectedHour = this.timeValue?.getHours();
        if (cTime === selectedHour) {
          return this.range(new Date().getMinutes() + 5, 59);
        }
      }
      return this.range(0, 59);
    },
    disableSubmitBtn() {
      const {
        form: { first_name, last_name, email, phone, register_check },
        getEmailDuplicatedCheck,
        getPhoneDuplicatedCheck,
      } = this;
      const checkEmailValidation =
        email && getEmailDuplicatedCheck && getEmailDuplicatedCheck.available;
      const checkPhoneValidation =
        phone && getPhoneDuplicatedCheck && getPhoneDuplicatedCheck.available;
      return register_check
        ? !(
            first_name &&
            last_name &&
            (checkEmailValidation || checkPhoneValidation)
          )
        : !(first_name && last_name);
    },
    hasAnyValidationErr() {
      return (this.form.email &&
      this.getEmailDuplicatedCheck &&
      !this.getEmailDuplicatedCheck.available
        ? true
        : false) ||
        (this.form.phone &&
          this.getPhoneDuplicatedCheck &&
          !this.getPhoneDuplicatedCheck.available)
        ? true
        : false;
    },
  },
  methods: {
    switchBtn() {
      this.$refs.pre_reg_form.nextTab();
    },
    range: (start, end) => {
      return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    },
    ...mapActions("userType", ["fetchRegistrationTypes"]),
    selectNextThreeDay(emit) {
      const start = new Date();
      const end = new Date();
      end.setTime(end.getTime() + 3 * 24 * 3600 * 1000);
      const date = [start, end];
      emit(date);
    },
    // time picker
    handleTimeChange(value, type) {
      if (type === "second") {
        this.open = false;
      }
      this.handelNextStep();
    },
    handelClick(type) {
      this.toggleValue = type.id;
      this.handelNextStep();
      this.selected_user_type.push(type);
      this.pre_registration_method =
        this.selected_user_type[
          this.selected_user_type.length - 1
        ].pre_registration_method;
    },
    handelNextStep() {
      this.timeValidation = false;
      this.dateValidation = false;
      const { dateValue, timeValue, pre_registration_method } = this;
      if (pre_registration_method == "REGISTRATION_ALLOWED" && timeValue) {
        this.checkValidation = true;
      } else if (
        pre_registration_method == "REGISTRATION_ALLOWED" &&
        !dateValue
      ) {
        this.checkValidation = true;
      } else if (
        (pre_registration_method === "PRE_REGISTERED_WITH_APPROVAL_REQUIRED" ||
          pre_registration_method === "PRE_REGISTERED_ONLY") &&
        dateValue &&
        timeValue
      ) {
        this.checkValidation = true;
      } else {
        this.checkValidation = false;
      }
    },
    handelNextClick() {
      let todayDate = new Date();
      let selectedDateTime = this.dateValue;
      selectedDateTime.setHours(
        this.timeValue.getHours(),
        this.timeValue.getMinutes(),
        this.timeValue.getSeconds()
      );
      // time validation
      let dateString = todayDate.toISOString().slice(0, 10);
      if (this.dateValue?.toISOString().slice(0, 10) === dateString) {
        let cHours = new Date().getHours();
        let cMinutes = new Date().getMinutes() + 5;
        if (cHours === this.timeValue?.getHours()) {
          if (this.timeValue?.getMinutes() < cMinutes) {
            this.checkValidation = false;
            this.timeValidation = true;
            return;
          }
        } else if (this.timeValue?.getHours() < cHours) {
          this.checkValidation = false;
          this.timeValidation = true;
          return;
        }
      }
      if (selectedDateTime < todayDate) {
        this.dateValidation = false;
        this.timeValidation = false;
        return;
      }
      this.$router.push({ path: "/test" });
    },
    disableDateBeforeCurrent(date) {
      let cDate = new Date();
      let currentYear = cDate.getFullYear();
      let currentMonth = cDate.getMonth();
      let currentDay = cDate.getDate();
      return date < new Date(currentYear, currentMonth, currentDay);
    },
    onSubmit() {
      console.log("onSubmit");
    },
    onPhoneInputTyping() {
      this.phoneInputTyping = true;
    },
    onEmailTyping() {
      this.email_typing = true;
    },
    onSelectUserCountryCode({ dialCode }) {
      this.userCountryCode = dialCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.pre-register-wrapper {
  display: flex;
  margin: auto;
  align-items: center;
  padding-top: 0;
  justify-content: center;
  .pre-register-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 491px;
    height: 100%;
    max-height: 100%;
    text-align: center;
    padding: 0 6px 0 6px;
    background-color: #fff;
    margin: 0;
    margin-bottom: 40px;
    .pre-reg-head-tab1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      max-width: 491px;
      text-align: center;
      background-color: #fff;
      margin-top: 84px;
    }
    .wizard-tab-content {
      padding-top: 0 !important;
    }
  }
  .no-usr-pre-reg-head-tab1 {
    margin-top: 84px;
  }
  .no-usr-margin-box {
    height: 160px;
  }
  .logo {
    display: block;
    width: 116px;
    height: 22px;
    margin: 0 auto;
    margin-bottom: 24px;
  }
  .welcome-msg {
    font-weight: 500;
    font-size: 17px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #000000;
    margin-bottom: 21px;
  }
  .reg-msg-tab1 {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    color: #000000;
    margin-bottom: 61px;
  }
  .select-type-msg {
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    text-align: left;
    margin-bottom: 31px;
    color: #787878;
    padding-left: 11px;
  }
  .btns-grid {
    text-align: left;
  }
  .btns-grid button {
    margin: 0 16px 16px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 17px;
    text-align: center;
    padding: 10px 17px;
  }
  .h-line-tab1 {
    margin: 38px auto 38px auto;
    opacity: 0.08;
    border: 1px solid #000;
  }
  .date-time-lable {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.25px;
    color: #787878;
    text-align: left;
    margin-bottom: 31px;
    padding-left: 11px;
  }
  .date-piker-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .time-error {
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0.25px;
    text-align: center;
    color: #f46a6a;
    margin-top: 20px;
  }
  .date-p {
    margin-right: 15px;
  }
  .date-time-wrappers {
    width: 200px;
    height: 50px;
    float: left;
    .selected-date-lable {
      margin-bottom: -3px;
      text-align: left;
      background-color: #f2f2f2;
      padding-top: 8px;
      padding-left: 12px;
      font-size: 10px;
      font-weight: 700;
      color: #103f5e;
    }
    .invaled-top-half {
      border: 1.5px solid #f46a6a;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }
  }
  .next-btn {
    display: block;
    width: 415px;
    max-width: 95%;
    height: 44px;
    margin: 0 auto 80px auto;
    border-radius: 18.5px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #fff;
  }
  .dimmed-btn {
    background-color: #96abb8;
    cursor: not-allowed;
  }
  .activ-btn {
    background-color: #103f5e;
    pointer-events: auto;
  }
  .reg-not-available-msg {
    width: 245px;
    text-align: center;
    margin: 195px auto;
  }
  .is-invalid {
    border: 1.5px solid #f46a6a;
    border-radius: 4px;
  }
}
@media (min-width: 440px) {
  .pre-register-wrapper {
    padding-top: 65px;
    min-height: 100vh;
    .pre-register-form {
      padding: 0 18px 0 18px;
      .pre-reg-head-tab1 {
        margin-top: 46px;
      }
    }
    .next-btn {
      width: 309px;
      height: 37px;
      margin: 0 auto 38px auto;
    }
  }
  .date-time-wrappers {
    width: 147px;
    height: 49px;
    float: left;
  }
  .pre-register-wrapper {
    .no-usr-margin-box {
      height: 80px !important;
    }
    .no-usr-pre-reg-head-tab1 {
      margin-top: 46px !important;
    }
  }
}
// tab 2
.register-email-phone .register-hint .hint-label {
  font-size: 12px;
  text-align: left;
  margin-left: 10px;
  color: #000;
}
.visit-register {
  margin-top: 33px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 491px;
  text-align: center;
  background-color: #fff;
  .visit-register-header {
    .logo-2 {
      display: block;
      width: 116px;
      height: 22px;
      margin: 0 auto;
      margin-bottom: 20px;
    }
    .form-title {
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      color: #000;
      margin-bottom: 28px;
    }
    .sub-title {
      font-weight: 400;
      font-size: 14px;
      text-align: center;
      color: #666666;
      margin-bottom: 26px;
      .login-btn {
        color: #103f5e;
      }
    }
  }
  .content {
    font-size: 16px;
    .first-last-name-wrapper {
      display: flex;
      flex-direction: column;
      .required-star {
        position: relative;
        .required {
          color: #e51414;
          position: absolute;
          right: 10px;
          top: 18px;
          z-index: 1000;
          font-size: 1.2rem;
        }
      }
      .first-name {
        margin-right: 14px;
        width: 100%;
      }
      .last-name {
        width: 100%;
      }
    }
    .current-phone {
      margin-bottom: 36px;
      .phone-group {
        display: flex;
      }
      .country-code-input {
        margin-right: 14px;
      }
    }
    .current-phone .phone-group .country-code-input {
      width: 106px;
      height: 55px;
      background-color: #f2f2f2;
      border-radius: 4px;
      border: none;
    }
    .passport-email-phone {
      margin-bottom: 32px;
    }
    .register-account-check-wrapper {
      display: flex;
      padding: 0 28px 0 18px;
      margin-bottom: 131px;
      .custom-checkbox-dark {
        margin-right: 16px;
      }
      .text {
        margin: 0;
        text-align: left;
        color: #666666;
        font-size: 16px;
      }
    }
  }
}
.generate-btn {
  display: block;
  width: 415px;
  max-width: 95%;
  height: 44px;
  margin: 0 auto 28px auto;
  border-radius: 18.5px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #fff;
}
@media (min-width: 440px) {
  // tab 2
  .row-group {
    display: flex;
    justify-content: space-between;
    .col-50 {
      width: 100%;
    }
    .first-name-wrapper {
      margin-right: 1rem;
    }
  }
  .pre-register-form {
    max-width: 491px;
    border-radius: 26px;
    min-height: unset;
    .wizard-tab-content {
      padding-top: 0 !important;
    }
  }
  .first-last-name-wrapper {
    flex-direction: row !important;
    .first-name {
      margin-right: 14px;
      width: 30%;
    }
    .last-name {
      width: 30%;
    }
  }
  .register-account-check-wrapper {
    padding: 0 12px 0 12px;
  }
  .visit-register {
    margin-top: 46px;
  }
  .generate-btn {
    width: 309px;
    height: 37px;
    margin: 0 auto 38px auto;
  }
}
</style>


