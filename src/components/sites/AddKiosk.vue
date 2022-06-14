<script>
import { mapActions, mapGetters } from "vuex";
import {
  required,
  alphaNum,
  numeric,
  minLength,
} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";

export default {
  name: "AddKiosk",
  components: { Multiselect, DatePicker },
  data() {
    return {
      device: "",
      deviceOptions: [
        { id: "LT-Zentron8", name: "LT-Zentron8" },
        { id: "LD-AITemp", name: "LD-AITemp" },
        { id: "Zentron 15", name: "Zentron 15" },
      ],
      kioskId: null,
      name: null,
      area: null,
      mac_address: null,
      lamasatech_serial: null,
      date_of_purchase: null,
      android_serial: null,
      purchased_from: "LamasaTech",
      partner_name: null,
      inherit: true,
      journey_id: "",
      submitted: false,
      checkMac: false,
    };
  },
  validations: {
    name: { required },
    area: { required },
    device: { required },
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
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", ["getLoading", "getAreas"]),
    ...mapGetters("kiosks", ["getLoading", "getKiosksSettings"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("journey", ["getJourneyList"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("addKiosk");
    },
  },
  methods: {
    ...mapActions("sites", ["fetchAreasBySite"]),
    ...mapActions("kiosks", ["addKiosk"]),
    ...mapActions("journey", ["fetchJourneyList"]),
    requestAreas() {
      this.fetchJourneyList();
    },
    onSubmit() {
      console.log(this.journey_id, this.inherit);
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid || (!this.inherit && !this.journey_id)) {
        return;
      } else {
        this.addKiosk({
          params: {
            kiosk: {
              name: this.name,
              area_id: this.area && this.area.id,
              entity_id: this.currentEntity.id,
              // journey_id: this.area.journey_id,
              android_serial: this.android_serial,
              mac_address: this.mac_address,
              partner_name: this.partner_name,
              is_inherit: this.inherit,
              journey_id: this.journey_id ? this.journey_id : this.area.journey_id,
              date_of_purchase: this.date_of_purchase,
              purchased_from: this.purchased_from,
              lamasatech_serial: this.lamasatech_serial,
            },
            lamasatech_serial: {
              id: this.lamasatech_serial,
            },
          },
        });
      }
    },
    addLamasatechSerial(selectedOption) {
      switch (selectedOption.name) {
        case "LD-AITemp":
          return (this.lamasatech_serial = "7091135919162XXXXX");
        case "LT-Zentron8":
          return (this.lamasatech_serial = "7091136435555XXXXX");
        case "Zentron 15":
          return (this.lamasatech_serial = "5060861160027XXXXX");
        default:
          "";
      }
    },
  },
  beforeMount() {
    this.fetchJourneyList();
    if (localStorage.getItem("mac") && localStorage.getItem("serial")) {
      this.mac_address = localStorage.getItem("mac");
      this.android_serial = localStorage.getItem("serial");
      this.checkMac = true;
      localStorage.removeItem("mac");
      localStorage.removeItem("serial");
    }
    this.fetchAreasBySite(this.$route.params.id);
  },
};
</script>

<template>
  <div class="kiosk-form-wrapper">
    <p class="text-secondary mb-3">Add Kiosk</p>
    <div class="form-groups">
      <!-- name   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label="Name:"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          type="text"
          placeholder="Enter Name"
          :class="{
            'is-invalid': submitted && $v.name.$error,
          }"
        ></b-form-input>
        <div v-if="submitted && !$v.name.required" class="invalid-feedback">
          Name is required.
        </div>
      </b-form-group>
      <!-- area  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        id="name-group"
        label=" Assigned Area:"
        label-for="area"
      >
        <multiselect
          id="area"
          v-model="area"
          :options="getAreas"
          placeholder="Select Area"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
          :class="{ 'invalid-input': submitted && !$v.area.required }"
        />
        <div v-if="submitted && !$v.area.required" class="invalid-feedback">
          Area is required.
        </div>
      </b-form-group>
    </div>
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
        v-model="date_of_purchase"
        :first-day-of-week="1"
        lang="en"
        placeholder="Select Date"
        :class="{ 'invalid-input': submitted && !$v.date_of_purchase.required }"
      ></date-picker>

      <div
        v-if="submitted && !$v.date_of_purchase.required"
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
        v-model="android_serial"
        type="text"
        :disabled="checkMac"
        placeholder="Enter Android Serial"
        :class="{
          'is-invalid': submitted && $v.android_serial.$error,
          'is-valid': !$v.android_serial.$invalid,
        }"
      ></b-form-input>
      <div
        v-if="submitted && $v.android_serial.$error"
        class="invalid-feedback"
      >
        <span v-if="!$v.android_serial.required"
          >Android serial is required.</span
        >
        <span v-if="!$v.android_serial.alphaNum"
          >Please enter android erial alphaNum.</span
        >
        <span v-if="!$v.android_serial.minLength"
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
        v-model="mac_address"
        type="text"
        :disabled="checkMac"
        placeholder="Enter MAC Address"
        :class="{
          'is-invalid': submitted && $v.mac_address.$error,
          'is-valid': !$v.mac_address.$invalid,
        }"
      ></b-form-input>
      <div v-if="submitted && $v.mac_address.$error" class="invalid-feedback">
        <span v-if="!$v.mac_address.required">mac address is required.</span>
        <span v-if="!$v.mac_address.alphaNum"
          >Please enter mac address alphaNum.</span
        >
        <span v-if="!$v.mac_address.minLength"
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
        :class="{ 'invalid-input': submitted && !$v.device.required }"
      />
    </b-form-group>
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="4"
      id="lamasatech_serial-group"
      label="LamasaTech Serial:"
      label-for="lamasatech_serial"
    >
      <b-form-input
        id="lamasatech_serial"
        v-model="lamasatech_serial"
        type="text"
        placeholder="Enter LamasaTech Serial"
        :class="{
          'is-invalid': submitted && $v.lamasatech_serial.$error,
          'is-valid': !$v.lamasatech_serial.$invalid,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.lamasatech_serial.required"
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
      label="Purchased From:"
      label-for="purchased_from"
    >
      <div class="d-flex align-items-center">
        <b-form-radio
          class="text-muted"
          v-model="purchased_from"
          value="LamasaTech"
          :class="{
            'is-invalid': submitted && !$v.purchased_from.required,
          }"
          >LamasaTech</b-form-radio
        >
        <b-form-radio
          class="mx-4 text-muted"
          :class="{
            'is-invalid': submitted && !$v.purchased_from.required,
          }"
          v-model="purchased_from"
          value="Partner"
          >Partner</b-form-radio
        >
        <div
          v-if="submitted && !$v.purchased_from.required"
          class="invalid-feedback"
        >
          Purchased From is required.
        </div>
      </div>
    </b-form-group>

    <b-form-group
      v-if="purchased_from == 'Partner'"
      label-cols-sm="4"
      label-cols-lg="4"
      id="partner_name-group"
      label="Partner Name:"
      label-for="partner_name"
    >
      <b-form-input
        id="partner_name"
        v-model="partner_name"
        type="text"
        placeholder="Enter Partner Name"
      ></b-form-input>
    </b-form-group>
    <b-form-group>
      <b-form-checkbox
        name="check-button"
        v-model="inherit"
        @change="journey_id = !inherit ? journey_id : ''"
        >Inherit journey from the assigned area
      </b-form-checkbox>
    </b-form-group>
    <!-- journey  -->
    <b-form-group
      v-if="!inherit"
      label-cols-sm="4"
      label-cols-lg="3"
      id="journey"
      label="Select Journey"
      label-for="journey"
    >
      <multiselect
        id="journey"
        v-model="journey_id"
        placeholder="Select Journey"
        :show-labels="false"
        :options="getJourneyList.map((story) => story.id)"
        :custom-label="(opt) => getJourneyList.find((x) => x.id == opt).name"
        :allowEmpty="true"
        @open="requestAreas"
        :class="{ 'invalid-input': submitted && !inherit && !journey_id }"
      />
    </b-form-group>
    <!-- action btns  -->
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('addKiosk')"
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
<style lang="scss" scoped>
.kiosk-form-wrapper {
  // width:auto;
  // overflow-y:scroll!important ;
  .header {
    background-color: #f8f8fb;
    margin-bottom: 1%;
  }
  .form-groups {
    padding-bottom: 1%;
  }
  .modal-title {
    text-align: center;
    font-size: 19px;
    font-weight: 700;
  }
  .input-label {
    width: 400px;
  }
  .setting-icon {
    color: rgb(66, 101, 143);
    font-size: 1.3rem;
  }
}
</style>
<style lang="scss">
.invalid-input {
  .multiselect__tags {
    border-color: #f46a6a !important;
  }
  input.mx-input{
    border-color: #f46a6a !important;
  }
}
</style>
