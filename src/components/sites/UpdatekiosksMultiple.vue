<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import { requiredIf } from "vuelidate/lib/validators";
import moment from "moment";

export default {
  name: "UpdatekiosksMultiple",
  components: { Multiselect, DatePicker },
  data() {
    return {
      timeZoneName: null,
      form: {
        kiosks_setting: {
          temperature_offset: 0,
          kiosk_brightness: 65,
          schedule_reboot: null,
          kiosk_volume: 50,
          temperature_display_unit: null,
          time_zone: null,
          schedule_reboot_time: "03:00",
          system_fan: 0,
          enable_company_logo: 1,
          living_body: 1,
          card_logo_image: "",
          date_format: "yyyy-mm-dd",
          show_status_bar: 0,
          rfid_counter: 5,
          weigand_output_type: 26,
          custom_smtp_server:0,
          smtp_address:null,
          smtp_username:null,
          smtp_password:null,
          smtp_port:null,
          smtp_tls:0,
          smtp_ssl:0,
        },
        site_id: null,
        area_id: null,
      },
      submitted: false,
      timezoneObject: null,
      confirmUpdate: false,
    };
  },
  validations: {
    form: {
      kiosks_setting: {
        smtp_port: {
        required: requiredIf(function () {
          return this.form.kiosks_setting.custom_smtp_server;
        }),
      },
       smtp_address: {
        required: requiredIf(function () {
          return this.form.kiosks_setting.custom_smtp_server;

        }),
      },
      smtp_username: {
        required: requiredIf(function () {
         return this.form.kiosks_setting.custom_smtp_server;

        }),
      },
        smtp_password: {
        required: requiredIf(function () {
             return this.form.kiosks_setting.custom_smtp_server;
        }),
      },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("kiosks", ["getLoading", "getKiosksSettings"]),
    ...mapGetters("authfack", ["currentEntity"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("UpdatekiosksMultiple");
    },
  },
  methods: {
    ...mapActions("kiosks", ["updateKiosksSettings"]),
    onSubmit() {
      this.form.kiosks_setting.time_zone = this.timeZoneName
        ? this.timeZoneName
        : null;
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.updateKiosksSettings({
        params: this.form,
      });
      }

    },
    allowUpdate() {
      return (this.confirmUpdate = true);
    },
  },
  beforeMount() {
    if (this.getModalInfo.hasOwnProperty("parent_id")) {
      this.form.area_id = this.getModalInfo["id"];
    } else {
      this.form.site_id = this.getModalInfo["id"];
    }
    this.timezoneObject = moment.tz.names();
    let massKiosksettings = this.getModalInfo.mass_kiosksetting;
    massKiosksettings &&
      massKiosksettings.length > 0 &&
      massKiosksettings.map((item) => {
        item.name == "temperature_display_unit"
          ? (this.form.kiosks_setting.temperature_display_unit =
              item.pivot.value)
          : "";
        item.name == "temperature_offset"
          ? (this.form.kiosks_setting.temperature_offset = Number(item.pivot.value))
          : "";
        item.name == "schedule_reboot"
          ? (this.form.kiosks_setting.schedule_reboot =
              item.pivot.value == 1 ? true : false)
          : "";
        item.name == "kiosk_volume"
          ? (this.form.kiosks_setting.kiosk_volume = Number(item.pivot.value))
          : "";
        item.name == "kiosk_brightness"
          ? (this.form.kiosks_setting.kiosk_brightness = Number(item.pivot.value))
          : "";
        // new settings
        item.name == "time_zone" ? (this.timeZoneName = item.pivot.value) : "";
        item.name == "schedule_reboot_time"
          ? (this.form.kiosks_setting.schedule_reboot_time = item.pivot.value)
          : "";
        item.name == "system_fan"
          ? (this.form.kiosks_setting.system_fan =
              item.pivot.value == 1 ? true : false)
          : "";
        item.name == "enable_company_logo"
          ? (this.form.kiosks_setting.enable_company_logo = item.pivot.value)
          : "";
        item.name == "living_body"
          ? (this.form.kiosks_setting.living_body =
              item.pivot.value == 1 ? true : false)
          : "";
        item.name == "date_format"
          ? (this.form.kiosks_setting.date_format = item.pivot.value)
          : "";
        item.name == "show_status_bar"
          ? (this.form.kiosks_setting.show_status_bar =
              item.pivot.value == 1 ? true : false)
          : "";
        item.name == "kiosk_brightness"
          ? (this.form.kiosks_setting.kiosk_brightness = Number(item.pivot.value))
          : "";
        item.name == "rfid_counter"
          ? (this.form.kiosks_setting.rfid_counter = Number(item.pivot.value))
          : "";
        item.name == "weigand_output_type"
          ? (this.form.kiosks_setting.weigand_output_type = item.pivot.value)
          : "";
        item.name == "smtp_address"
          ? (this.form.kiosks_setting.smtp_address = item.pivot.value)
          : "";
        item.name == "smtp_port"
          ? (this.form.kiosks_setting.smtp_port = item.pivot.value)
          : "";
        item.name == "smtp_username"
          ? (this.form.kiosks_setting.smtp_username = item.pivot.value)
          : "";
        item.name == "smtp_password"
          ? (this.form.kiosks_setting.smtp_password = item.pivot.value)
          : "";
        item.name == "smtp_tls"
          ? (this.form.kiosks_setting.smtp_tls = item.pivot.value == 1 ? true : false)
          : "";
        item.name == "smtp_ssl"
          ? (this.form.kiosks_setting.smtp_ssl = item.pivot.value == 1 ? true : false)
          : "";
        item.name == "custom_smtp_server"
          ? (this.form.kiosks_setting.custom_smtp_server = item.pivot.value == 1 ? true : false)
          : "";
      });
  },
};
</script>

<template>
  <section>
    <div v-if="!confirmUpdate" class="confirmation-warning">
      <p class="text-secondary mb-3">Edit Kiosks Settings</p>
      <h4 class="text-center my-5 border border-danger p-3">
        Are you sure you want to edit the settings for all of the selected
        kiosks? This will override any custom settings that are in place!
      </h4>
      <div class="d-flex justify-content-end align-items-center mt-1">
        <button
          class="btn btn-outline-secondary px-3 mr-2"
          @click="$bvModal.hide('UpdatekiosksMultiple')"
        >
          Cancel
        </button>
        <button
          :disabled="getLoading"
          class="submit-btn btn btn-primary px-4"
          size="md"
          @click="allowUpdate"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          Continue
        </button>
      </div>
    </div>
    <div v-else class="kiosk-form-wrapper">
      <p class="text-secondary mb-3">Edit Kiosks Settings</p>
      <!-- switchs  -->
      <div class="switchs-wrapper">
        <div
          class="d-flex align-items-center justify-content-between flex-wrap"
        >
          <!-- system fan -->
          <b-form-group
            class="text-muted border p-1"
            label="System Fan"
            label-for="system_fan"
          >
            <b-form-checkbox
              size="md"
              class="text-center"
              id="system_fan"
              switch
              v-model="form.kiosks_setting.system_fan"
            ></b-form-checkbox>
          </b-form-group>
          <!-- schedule reboot -->
          <b-form-group
            class="text-muted border p-1"
            label="Schedule Reboot"
            label-for="schedule_reboot"
          >
            <b-form-checkbox
              class="text-center"
              id="schedule_reboot"
              switch
              size="md"
              v-model="form.kiosks_setting.schedule_reboot"
            ></b-form-checkbox>
          </b-form-group>
          <!-- living body -->
          <b-form-group
            class="text-muted border p-1"
            label="Living Body"
            label-for="living_body"
          >
            <b-form-checkbox
              class="text-center"
              id="living_body"
              switch
              size="md"
              v-model="form.kiosks_setting.living_body"
            ></b-form-checkbox>
          </b-form-group>
          <!-- status bar -->
          <b-form-group
            class="text-muted border p-1"
            label="Hide Status Bar"
            label-for="status_bar"
          >
            <b-form-checkbox
              class="text-center"
              id="status_bar"
              switch
              size="md"
              v-model="form.kiosks_setting.show_status_bar"
            ></b-form-checkbox>
          </b-form-group>
        </div>
      </div>
      <!-- date format   -->
      <b-form-group
        class="text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Date Format"
        label-for="date"
      >
        <b-form-input
          id="date"
          v-model="form.kiosks_setting.date_format"
          type="text"
          placeholder="Enter date format"
        ></b-form-input>
      </b-form-group>
      <!-- timezone  -->
      <b-form-group
        class="font-weight-normal text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        id="timezone"
        label="Time Zone"
      >
        <multiselect
          id="timezone"
          v-model="timeZoneName"
          :options="timezoneObject"
          placeholder="Select timezone.."
          :show-labels="false"
          :allowEmpty="true"
          :disabled="true"
        />
      </b-form-group>
      <!-- schedule_reboot_time  -->
      <b-form-group
        class="font-weight-normal text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Reboot Time"
      >
        <date-picker
          v-model="form.kiosks_setting.schedule_reboot_time"
          type="time"
          value-type="format"
          placeholder="Select Time"
        ></date-picker>
      </b-form-group>
      <!-- temp  -->
      <b-form-group
        class="text-muted align-items-center border-top pt-1"
        label="Temperature Type"
        label-for="temperature"
        label-cols-sm="4"
        label-cols-lg="4"
      >
        <div class="d-flex align-items-center">
          <b-form-radio
            v-model="form.kiosks_setting.temperature_display_unit"
            value="f"
            >°F</b-form-radio
          >
          <b-form-radio
            class="mx-4"
            v-model="form.kiosks_setting.temperature_display_unit"
            value="c"
            >°C</b-form-radio
          >
        </div>
      </b-form-group>
      <!-- weigand output type  -->
      <b-form-group
        class="text-muted align-items-center border-bottom pb-1"
        label="Weigand Output Type"
        label-for="temperature"
        label-cols-sm="4"
        label-cols-lg="4"
      >
        <div class="d-flex align-items-center">
          <b-form-radio
            v-model="form.kiosks_setting.weigand_output_type"
            value="26"
            >26</b-form-radio
          >
          <b-form-radio
            class="mx-4"
            v-model="form.kiosks_setting.weigand_output_type"
            value="34"
            >34</b-form-radio
          >
        </div>
      </b-form-group>
      <!-- temperature offset  -->
      <b-form-group
        class="align-items-center text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        id="offset"
        label="Temperature Offset"
        label-for="offset"
      >
        <div class="d-flex align-items-center w-100">
          <i class="mdi mdi-thermometer-low setting-icon mr-2"></i>
        <b-slider 
          v-model="form.kiosks_setting.temperature_offset"
          :min="form.kiosks_setting.temperature_display_unit=='c'?-10:-20"
          :max="form.kiosks_setting.temperature_display_unit=='c'?10:20"
                :tooltip-always='false'
                :indicator='false'
                :step="0.1"
                size="is-small"
                :rounded="true"
        ></b-slider>
          <i class="mdi mdi-thermometer-high setting-icon ml-2"></i>
        </div>
      </b-form-group>
      <!-- brightness  -->
      <b-form-group
        class="align-items-center text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        id="brightness"
        label="Brightness:"
        label-for="area"
      >
        <div class="d-flex align-items-center">
          <i class="bx bxs-brightness-half setting-icon mr-2"></i>
        <b-slider 
          v-model="form.kiosks_setting.kiosk_brightness"
          :min="0"
          :max="100"
          :tooltip-always='false'
          :indicator='false'
          size="is-small"
          :rounded="true"
        ></b-slider>
          <i class="bx bx-brightness setting-icon ml-2"></i>
        </div>
      </b-form-group>
      <!-- volume  -->
      <b-form-group
        class="align-items-center text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        id="volume:"
        label="Volume:"
        label-for="area"
      >
        <div class="d-flex align-items-center" variant="primary">
          <i class="bx bxs-volume-mute setting-icon mr-2"></i>
          <b-slider 
          v-model="form.kiosks_setting.kiosk_volume"
          :min="0"
          :max="100"
          :tooltip-always='false'
          :indicator='false'
          size="is-small"
          :rounded="true"
        ></b-slider>
          <i class="bx bxs-volume-full setting-icon ml-2"></i>
        </div>
      </b-form-group>
      <!-- rfid counter  -->
      <b-form-group
        class="align-items-center text-muted"
        label-cols-sm="4"
        label-cols-lg="4"
        id="rfid_counter:"
        label="RFID Counter (Seconds)"
        label-for="area"
      >
        <div class="d-flex align-items-center" variant="primary">
          <i class="mdi mdi-arrow-down-thick setting-icon mr-2"></i>
          <b-slider 
          v-model="form.kiosks_setting.rfid_counter"
          :min="0"
          :max="10"
          :tooltip-always='false'
          :indicator='false'
          size="is-small"
          :rounded="true"
        ></b-slider>
          <i class="mdi mdi-arrow-up-thick setting-icon ml-2"></i>
        </div>
      </b-form-group>
      <!-- custom_smtp_server  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      id="rfid_counter:"
      label="Custom Smtp Server"
      label-for="custom_smtp_server"
    >
          <b-form-checkbox
            size="md"
            id="custom_smtp_server"
            switch
            v-model="form.kiosks_setting.custom_smtp_server"
          ></b-form-checkbox>
    </b-form-group>
    <!-- smtp settings  -->
    <div class="smtp_settings" v-if="form.kiosks_setting.custom_smtp_server">
    <!-- server address  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Server Address"
      label-for="smtp_address"
    >
        <b-form-input
        id="smtp_address"
        v-model="form.kiosks_setting.smtp_address"
        type="text"
        placeholder="Enter Server Address"
          :class="{
          'is-invalid': submitted && $v.form.kiosks_setting.smtp_address.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosks_setting.smtp_address.required"
        class="invalid-feedback"
      >
        Smtp address is required.
      </div>

    </b-form-group>
    <!-- port  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Port"
      label-for="smtp_address"
    >
        <b-form-input
        id="smtp_port"
        v-model="form.kiosks_setting.smtp_port"
        type="text"
        placeholder="Enter Port"
        :class="{
          'is-invalid': submitted && $v.form.kiosks_setting.smtp_port.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosks_setting.smtp_port.required"
        class="invalid-feedback"
      >
        Smtp port is required.
      </div>
    </b-form-group>
    <!-- user name  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="User Name"
      label-for="smtp_username"
    >
        <b-form-input
        id="smtp_username"
        v-model="form.kiosks_setting.smtp_username"
        type="text"
        placeholder="Enter User Name"
        :class="{
          'is-invalid': submitted && $v.form.kiosks_setting.smtp_username.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosks_setting.smtp_username.required"
        class="invalid-feedback"
      >
        User Name is required.
      </div>
    </b-form-group>
    <!-- smtp password  -->
    <b-form-group
      autocomplete="off"
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Smtp Password"
      label-for="smtp_password"
    >
        <b-form-input
        autocomplete="new-password"
        id="smtp_password"
        v-model="form.kiosks_setting.smtp_password"
        type="password"
        placeholder="Enter Password"
        :class="{
          'is-invalid': submitted && $v.form.kiosks_setting.smtp_password.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosks_setting.smtp_password.required"
        class="invalid-feedback"
      >
        Smtp password is required.
      </div>
    </b-form-group>
    <!-- smtp_tls  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      id="rfid_counter:"
      label="Enable TLS"
      label-for="smtp_tls"
    >
          <b-form-checkbox
            size="md"
            id="smtp_tls"
            switch
            v-model="form.kiosks_setting.smtp_tls"
          ></b-form-checkbox>
    </b-form-group>
      <!-- smtp_ssl  -->
    <b-form-group
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      id="rfid_counter:"
      label="Enable ssl"
      label-for="smtp_ssl"
    >
          <b-form-checkbox
            size="md"
            id="smtp_ssl"
            switch
            v-model="form.kiosks_setting.smtp_ssl"
          ></b-form-checkbox>
    </b-form-group>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-1">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('UpdatekiosksMultiple')"
      >
        Cancel
      </button>
      <button
        :disabled="getLoading"
        class="submit-btn btn btn-primary px-4"
        size="md"
        @click="onSubmit"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Update
      </button>
    </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.kiosk-form-wrapper {
  .header {
    background-color: #f8f8fb;
    padding: 1% 0px;
    margin-bottom: 3%;
  }
  .form-groups {
    padding-bottom: 1%;
  }
  .input-label {
    width: 400px;
  }
  .setting-icon {
    color: rgb(66, 101, 143);
    font-size: 1.3rem;
  }
  .flex-item {
    flex: 0 0 50%;
  }
}
</style>
