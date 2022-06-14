<script>
import { mapActions, mapGetters } from "vuex";
import {
  required,
  alphaNum,
  numeric,
  minLength,
  email,
} from "vuelidate/lib/validators";
import DatePicker from "vue2-datepicker";
import isValidDomain from "is-valid-domain";
import Multiselect from "vue-multiselect";
import VueCountryCode from "vue-country-code";

export default {
  name: "AddKiosk",
  components: { DatePicker, Multiselect, VueCountryCode },
  data() {
    return {
      device: "",
      companyCountryCode: null,
      deviceOptions: [
        { id: "LT-Zentron8", name: "LT-Zentron8" },
        { id: "LD-AITemp", name: "LD-AITemp" },
      ],
      entity: {
        name: null,
        subdomain: null,
        company_phone: null,
        company_email: null,
        package: "Standalone",
      },
      kiosk: {
        name: null,
        mac_address: null,
        lamasatech_serial: null,
        date_of_purchase: null,
        android_serial: null,
        purchased_from: "LamasaTech",
        partner_name: null,
      },
      submitted: false,
      inputTyping: false,
      subdomain: "",
    };
  },
  validations: {
    entity: {
      name: { required },
      subdomain: { required },
      company_phone: { required, numeric },
      company_email: { required, email },
      package: { required },
    },
    kiosk: {
      name: { required },
      date_of_purchase: { required },
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
      purchased_from: { required },
      lamasatech_serial: {
        required,
        numeric,
        minLength: minLength(14),
      },
    },
  },
  mounted() {
    let domain = window.location.hostname;
    this.subdomain = "." + domain;
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("authfack", [
      "userDetails",
      "userEntities",
      "loadingStatus",
      "currentEntity",
    ]),
    ...mapGetters("entity", [
      "getEntities",
      "getLoading",
      "getIsValidSubdomian",
    ]),
    userId() {
      return this.userDetails && this.userDetails.user_id;
    },
    checkSubdomain() {
      if (
        isValidDomain(this.entity.subdomain + this.subdomain, {
          subdomain: true,
        })
      ) {
        this.checkEntitySubdomain(this.entity.subdomain + this.subdomain);
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("entityForm");
    },
  },
  methods: {
    ...mapActions("entity", ["createEntity", "checkEntitySubdomain"]),
    onSubmit() {
      this.entity.company_phone =
        this.entity.company_phone.length > 0
          ? `${this.companyCountryCode}${this.entity.company_phone}`
          : null;
      this.entity.subdomain = this.entity.subdomain + this.subdomain;
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        const { userId, entity, kiosk, createEntity } = this;
        if (this.checkSubdomain && this.getIsValidSubdomian) {
          createEntity({
            user: { id: userId },
            entity,
            kiosk,
            lamasatech_serial: { id: kiosk.lamasatech_serial },
          });
        } else {
          this.$toast.error("Please add a valid subdomain!.", {
            position: "top-right",
          });
        }
      }
    },
    addLamasatechSerial(selectedOption) {
      if (selectedOption.name == "LD-AITemp") {
        this.kiosk.lamasatech_serial = "7091135919162XXXXX";
      }
      if (selectedOption.name == "LT-Zentron8") {
        this.kiosk.lamasatech_serial = "7091136435555XXXXX";
      }
    },
    oninputTyping() {
      return (this.inputTyping = true);
    },
    onSelectCompanyCountryCode({ dialCode }) {
      this.companyCountryCode = dialCode;
    },
  },
};
</script>

<template>
  <div class="kiosk-form-wrapper">
    <div class="form-groups">
      <p class="text-secondary mb-3">Company Information</p>
      <!-- name   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Company Name:"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="entity.name"
          type="text"
          placeholder="Enter Name"
          :class="{
            'is-invalid': submitted && $v.entity.name.$error,
          }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.entity.name.required"
          class="invalid-feedback"
        >
          Name is required.
        </div>
      </b-form-group>
      <!-- subdomain  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Company Subdomain:"
        label-for="subdomain"
      >
        <b-input-group :append="subdomain">
          <b-form-input
            id="subdomain"
            v-model="entity.subdomain"
            type="text"
            placeholder="Enter Subdomain"
            :class="{
              'is-invalid':
                $v.entity.subdomain.$error ||
                (inputTyping && !checkSubdomain && getIsValidSubdomian),
            }"
            @keypress="oninputTyping"
            @input="$v.entity.subdomain.$touch()"
            :state="
              inputTyping && checkSubdomain && getIsValidSubdomian ? true : null
            "
          ></b-form-input>
          <div
            v-if="!$v.entity.subdomain.required"
            class="invalid-feedback invalid-subdomain"
          >
            Subdomain is required.
          </div>
          <div
            v-if="inputTyping && !checkSubdomain"
            class="invalid-feedback invalid-subdomain"
          >
            Subdomain is not valid.
          </div>
        </b-input-group>
      </b-form-group>
      <!-- phone  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Company Phone:"
        label-for="phone"
      >
        <div class="phone-input-wrapper">
          <VueCountryCode
            :disabledFetchingCountry="false"
            @onSelect="onSelectCompanyCountryCode"
            :enabledCountryCode="true"
            :preferredCountries="['GB', 'US', 'CN']"
          />
          <b-form-input
            id="phone"
            v-model="entity.company_phone"
            type="text"
            placeholder="Enter Phone"
            class="phone-input"
            :class="{
              'is-invalid': submitted && $v.entity.company_phone.$error,
            }"
          ></b-form-input>
          <div
            v-if="submitted && !$v.entity.company_phone.required"
            class="invalid-feedback"
          >
            <span class="no-wrap">Phone is required.</span>
          </div>
          <div
            v-if="submitted && !$v.entity.company_phone.numeric"
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
        label-cols-lg="4"
        id="name-group"
        label="Company Email:"
        label-for="email"
      >
        <b-form-input
          id="email"
          v-model="entity.company_email"
          type="text"
          placeholder="Enter Email"
          :class="{ 'is-invalid': submitted && $v.entity.company_email.$error }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.entity.company_email.required"
          class="invalid-feedback"
        >
          Email is required.
        </div>
      </b-form-group>
      <!-- package  -->
      <b-form-group
        hidden
        label-cols-sm="4"
        label-cols-lg="4"
        label="Company Service:"
        :class="{
          'is-invalid': submitted && $v.entity.package.$error,
          'is-valid': !$v.entity.package.$invalid,
        }"
        disabled
      >
        <div class="form-radio-wrapper mt-2 d-flex align-items-center">
          <b-form-radio
            v-model="entity.package"
            name="standalone"
            value="Standalone"
            :class="{
              'is-invalid': submitted && !$v.entity.package.required,
            }"
            >Standalone</b-form-radio
          >
          <b-form-radio
            class="mx-3"
            :class="{
              'is-invalid': submitted && !$v.entity.package.required,
            }"
            v-model="entity.package"
            name="cloud"
            value="Cloud"
            >Cloud</b-form-radio
          >
          <div
            v-if="submitted && !$v.entity.package.required"
            class="invalid-feedback"
          >
            Service From is required.
          </div>
        </div>
      </b-form-group>
    </div>
    <div class="form-groups">
      <p class="text-secondary mb-3">Kiosk Information</p>
      <!-- name   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Kiosk Name:"
        label-for="kiosk_name"
      >
        <b-form-input
          id="kiosk_name"
          v-model="kiosk.name"
          type="text"
          placeholder="Enter Kiosk Name"
          :class="{
            'is-invalid': submitted && $v.kiosk.name.$error,
          }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.kiosk.name.required"
          class="invalid-feedback"
        >
          Name is required.
        </div>
      </b-form-group>
      <!-- date of purchase  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="date_of_purchase-group"
        label="Date of Purchase:"
        label-for="date_of_purchase"
      >
        <date-picker
          id="date_of_purchase"
          v-model="kiosk.date_of_purchase"
          :first-day-of-week="1"
          lang="en"
          placeholder="Select Date"
          value-type="format"
          format="YYYY-MM-DD"
        ></date-picker>
        <div
          v-if="submitted && !$v.kiosk.date_of_purchase.required"
          class="invalid-feedback"
        >
          Date Of Purchase is required.
        </div>
      </b-form-group>
      <!-- android serial -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="android_serial-group"
        label="Android Serial:"
        label-for="android_serial"
      >
        <b-form-input
          id="android_serial"
          v-model="kiosk.android_serial"
          type="text"
          placeholder="Enter Android Serial"
          :class="{
            'is-invalid': submitted && $v.kiosk.android_serial.$error,
            'is-valid': !$v.kiosk.android_serial.$invalid,
          }"
        ></b-form-input>
        <div
          v-if="submitted && $v.kiosk.android_serial.$error"
          class="invalid-feedback"
        >
          <span v-if="!$v.kiosk.android_serial.required"
            >Android serial is required.</span
          >
          <span v-if="!$v.kiosk.android_serial.alphaNum"
            >Please enter android serial alphaNum.</span
          >
          <span v-if="!$v.kiosk.android_serial.minLength"
            >Please enter android serial 12 charcter.</span
          >
        </div>
      </b-form-group>
      <!-- mac_address  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="mac_address"
        label="MAC Address:"
        label-for="mac_address"
      >
        <b-form-input
          id="mac_address"
          v-model="kiosk.mac_address"
          type="text"
          placeholder="Enter MAC Address"
          :class="{
            'is-invalid': submitted && $v.kiosk.mac_address.$error,
            'is-valid': !$v.kiosk.mac_address.$invalid,
          }"
        ></b-form-input>
        <div
          v-if="submitted && $v.kiosk.mac_address.$error"
          class="invalid-feedback"
        >
          <span v-if="!$v.kiosk.mac_address.required"
            >mac address is required.</span
          >
          <span v-if="!$v.kiosk.mac_address.alphaNum"
            >Please enter mac address alphaNum.</span
          >
          <span v-if="!$v.kiosk.mac_address.minLength"
            >Please enter mac address 12 charcter.</span
          >
        </div>
      </b-form-group>
      <!-- Purchased Device -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="Purchased Device"
        label="Purchased Device:"
        label-for="purchased_device"
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
      </b-form-group>
      <!-- lamasatech serial  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="lamasatech_serial-group"
        label="LamasaTech serial:"
        label-for="lamasatech_serial"
      >
        <b-form-input
          id="lamasatech_serial"
          v-model="kiosk.lamasatech_serial"
          type="text"
          placeholder="Enter LamasaTech Serial"
          :class="{
            'is-invalid': submitted && $v.kiosk.lamasatech_serial.$error,
            'is-valid': !$v.kiosk.lamasatech_serial.$invalid,
          }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.kiosk.lamasatech_serial.required"
          class="invalid-feedback"
        >
          LamasaTech Serial is required.
        </div>
      </b-form-group>
      <!-- purchased from  -->
      <b-form-group
        class="align-items-center"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Purchased from:"
        label-for="purchased_from"
      >
        <div class="d-flex align-items-center">
          <b-form-radio
            class="text-muted"
            v-model="kiosk.purchased_from"
            value="LamasaTech"
            :class="{
              'is-invalid': submitted && !$v.kiosk.purchased_from.required,
            }"
            >LamasaTech</b-form-radio
          >
          <b-form-radio
            class="mx-4 text-muted"
            :class="{
              'is-invalid': submitted && !$v.kiosk.purchased_from.required,
            }"
            v-model="kiosk.purchased_from"
            value="Partner"
            >Partner</b-form-radio
          >
          <div
            v-if="submitted && !$v.kiosk.purchased_from.required"
            class="invalid-feedback"
          >
            Purchased From is required.
          </div>
        </div>
      </b-form-group>
      <!-- parent name  -->
      <b-form-group
        v-if="kiosk.purchased_from == 'Partner'"
        label-cols-sm="4"
        label-cols-lg="4"
        id="partner_name-group"
        label="Partner name:"
        label-for="partner_name"
      >
        <b-form-input
          id="partner_name"
          v-model="kiosk.partner_name"
          type="text"
          placeholder="Enter Partner Name"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- action btns  -->
    <div class="d-flex justify-content-end align-items-center mt-2">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('entityForm')"
      >
        Cancel
      </button>
      <button
        class="submit-btn btn btn-primary px-4"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Submit
      </button>
    </div>
  </div>
</template>
