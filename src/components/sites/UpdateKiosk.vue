<script>
import { mapActions, mapGetters } from "vuex";
import { required, sameAs, minLength, requiredIf } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import Collapsible from "vue-collapsible-component";
import moment from "moment";

export default {
  name: "UpdateActionForm",
  components: { Multiselect, DatePicker, Collapsible },
  data() {
    return {
      kioskId: null,
      serial_number: null,
      timeZoneName: null,
      current_kiosk_password: null,
      old_kiosk_password: null,
      form: {
        kiosk: {
          name: null,
          area_id: null,
        },
        kiosk_setting: {
          temperature_offset: 0,
          kiosk_brightness: 65,
          schedule_reboot: null,
          kiosk_volume: 50,
          kiosk_password: null,
          confirm_kiosk_password: null,
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
      },
      submitted: false,
      timezoneObject: null,
    };
  },
  validations: {
    form: {
      kiosk: {
        name: { required },
        area_id: { required },
      },
      kiosk_setting: {
        kiosk_password: { minLength: minLength(6) },
        confirm_kiosk_password: { sameAsPassword: sameAs("kiosk_password") },
        smtp_port: {
        required: requiredIf(function () {
          return this.form.kiosk_setting.custom_smtp_server;
        }),
      },
       smtp_address: {
        required: requiredIf(function () {
          return this.form.kiosk_setting.custom_smtp_server;

        }),
      },
      smtp_username: {
        required: requiredIf(function () {
         return this.form.kiosk_setting.custom_smtp_server;

        }),
      },
        smtp_password: {
        required: requiredIf(function () {
             return this.form.kiosk_setting.custom_smtp_server;
        }),
      },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", ["getLoading", "getSites", "getAreas"]),
    ...mapGetters("kiosks", ["getLoading", "getKiosksSettings"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("authfack", ["currentEntity"]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("updateKiosk");
    },
  },
  methods: {
    ...mapActions("sites", ["fetchAreasBySite"]),
    ...mapActions("kiosks", ["updateKiosk"]),
    onSubmit() {
      this.form.kiosk_setting.time_zone = this.timeZoneName
        ? this.timeZoneName
        : null;

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        if (
          this.current_kiosk_password || this.form.kiosk_setting.kiosk_password || this.form.kiosk_setting.confirm_kiosk_password
        ) {
          if (
            !this.current_kiosk_password ||
            !this.form.kiosk_setting.kiosk_password ||
            !this.form.kiosk_setting.confirm_kiosk_password
          ) {
            this.$toast.error(
              "To update the password please ensure all fields are filled.",
              {
                position: "top-right",
              }
            );
          } if (this.current_kiosk_password != this.form.kiosk_setting.kiosk_password){
            this.$toast.error(
              "Current kiosk password is not correct",
              {
                position: "top-right",
              }
            );
          }
           else  {
            this.updateKiosk({
              id: this.kioskId,
              params: this.form,
            });
          }
        } else {
          this.updateKiosk({
            id: this.kioskId,
            params: this.form,
          });
        }
      }
    },
  },
  beforeMount() {
    this.siteInfoLength =
      this.getModalInfo && Object.keys(this.getModalInfo).length > 0
        ? true
        : false;
    if (this.siteInfoLength) {
      const { id, name, area_id, setting, serial_number } = this.getModalInfo;
      this.kioskId = id;
      this.serial_number = serial_number;
      this.form.kiosk.name = name;
      this.form.kiosk.area_id = area_id;
      this.form.kiosk.package = this.getModalInfo.package;
      setting &&
        setting.length > 0 &&
        setting.map((item) => {
          item.name == "kiosk_password"
            ? (this.old_kiosk_password = item.pivot.value)
            : "";
          item.name == "temperature_display_unit"
            ? (this.form.kiosk_setting.temperature_display_unit =
                item.pivot.value)
            : "";
          item.name == "temperature_offset"
            ? (this.form.kiosk_setting.temperature_offset = Number(item.pivot.value))
            : "";
          item.name == "schedule_reboot"
            ? (this.form.kiosk_setting.schedule_reboot =
                item.pivot.value == 1 ? true : false)
            : "";
          item.name == "kiosk_volume"
            ? (this.form.kiosk_setting.kiosk_volume = Number(item.pivot.value))
            : "";
          item.name == "kiosk_brightness"
            ? (this.form.kiosk_setting.kiosk_brightness = Number(item.pivot.value))
            : "";
          // new settings
          item.name == "time_zone"
            ? (this.timeZoneName = item.pivot.value)
            : "";
          item.name == "schedule_reboot_time"
            ? (this.form.kiosk_setting.schedule_reboot_time = item.pivot.value)
            : "";
          item.name == "system_fan"
            ? (this.form.kiosk_setting.system_fan =
                item.pivot.value == 1 ? true : false)
            : "";
          item.name == "enable_company_logo"
            ? (this.form.kiosk_setting.enable_company_logo = item.pivot.value)
            : "";
          item.name == "living_body"
            ? (this.form.kiosk_setting.living_body =
                item.pivot.value == 1 ? true : false)
            : "";
          item.name == "date_format"
            ? (this.form.kiosk_setting.date_format = 
            item.pivot.value == 'yyyy-MM-dd'
            ?
            'yyyy-mm-dd'
            :
            item.pivot.value
            )
            : "";
          item.name == "show_status_bar"
            ? (this.form.kiosk_setting.show_status_bar =
                item.pivot.value == 1 ? true : false)
            : "";
          item.name == "kiosk_brightness"
            ? (this.form.kiosk_setting.kiosk_brightness = Number(item.pivot.value))
            : "";
          item.name == "rfid_counter"
            ? (this.form.kiosk_setting.rfid_counter = Number(item.pivot.value))
            : "";
          item.name == "weigand_output_type"
            ? (this.form.kiosk_setting.weigand_output_type = item.pivot.value)
            : "";
          item.name == "smtp_address"
            ? (this.form.kiosk_setting.smtp_address = item.pivot.value)
            : "";
          item.name == "smtp_port"
            ? (this.form.kiosk_setting.smtp_port = item.pivot.value)
            : "";
          item.name == "smtp_username"
            ? (this.form.kiosk_setting.smtp_username = item.pivot.value)
            : "";
          item.name == "smtp_password"
            ? (this.form.kiosk_setting.smtp_password = item.pivot.value)
            : "";
          item.name == "smtp_tls"
            ? (this.form.kiosk_setting.smtp_tls = item.pivot.value == 1 ? true : false)
            : "";
          item.name == "smtp_ssl"
            ? (this.form.kiosk_setting.smtp_ssl = item.pivot.value == 1 ? true : false)
            : "";
          item.name == "custom_smtp_server"
            ? (this.form.kiosk_setting.custom_smtp_server = item.pivot.value == 1 ? true : false)
            : "";
        });
    }
    this.timezoneObject = moment.tz.names();
  },
};
</script>

<template>
  <div class="kiosk-form-wrapper">
    <p class="text-dark mb-3">Edit Kiosk Settings</p>
    <div v-if="getPackageType == 'Standalone'">
      <p class="text-danger">
        You have access to update kiosk name only, upgrade to one of our
        <span class="font-weight-bold">cloud</span> packages to access all kiosk
        settings
      </p>
    </div>
    <!-- switchs  -->
    <div class="switchs-wrapper" v-if="getPackageType == 'Cloud'">
      <div class="d-flex align-items-center justify-content-between flex-wrap">
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
            v-model="form.kiosk_setting.system_fan"
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
            v-model="form.kiosk_setting.schedule_reboot"
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
            v-model="form.kiosk_setting.living_body"
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
            v-model="form.kiosk_setting.show_status_bar"
          ></b-form-checkbox>
        </b-form-group>
      </div>
    </div>
    <!-- name   -->
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="4"
      class="text-muted"
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="form.kiosk.name"
        type="text"
        placeholder="Enter Name"
        :class="{
          'is-invalid': submitted && $v.form.kiosk.name.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosk.name.required"
        class="invalid-feedback"
      >
        Name is required.
      </div>
    </b-form-group>
    <!-- date format   -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
      class="text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Date Format"
      label-for="date"
    >
      <b-form-input
        id="date"
        v-model="form.kiosk_setting.date_format"
        type="text"
        placeholder="Enter Date Format"
      ></b-form-input>
    </b-form-group>
    <!-- timezone  -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
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
        placeholder="Select Timezone"
        :show-labels="false"
        :allowEmpty="true"
        :disabled="true"
      />
    </b-form-group>
    <!-- schedule_reboot_time  -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
      class="font-weight-normal text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Reboot Time"
      label-for="time_reboot"
    >
      <date-picker
        v-model="form.kiosk_setting.schedule_reboot_time"
        type="time"
        value-type="format"
        placeholder="Select Time"
      ></date-picker>
    </b-form-group>
    <!-- temp  -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
      class="text-muted align-items-center border-top pt-1"
      label="Temperature Type"
      label-for="temperature"
      label-cols-sm="4"
      label-cols-lg="4"
    >
      <div class="d-flex align-items-center">
        <b-form-radio
          v-model="form.kiosk_setting.temperature_display_unit"
          value="f"
          >°F</b-form-radio
        >
        <b-form-radio
          class="mx-4"
          v-model="form.kiosk_setting.temperature_display_unit"
          value="c"
          >°C</b-form-radio
        >
      </div>
    </b-form-group>
    <!-- weigand output type  -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
      class="text-muted align-items-center border-bottom pb-1"
      label="Weigand Output Type"
      label-for="temperature"
      label-cols-sm="4"
      label-cols-lg="4"
    >
      <div class="d-flex align-items-center">
        <b-form-radio
          v-model="form.kiosk_setting.weigand_output_type"
          value="26"
          >26</b-form-radio
        >
        <b-form-radio
          class="mx-4"
          v-model="form.kiosk_setting.weigand_output_type"
          value="34"
          >34</b-form-radio
        >
      </div>
    </b-form-group>
    <!-- temperature offset  -->
    <b-form-group
      v-if="getPackageType == 'Cloud'"
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
          v-model="form.kiosk_setting.temperature_offset"
          :min="form.kiosk_setting.temperature_display_unit=='c'?-10:-20"
          :max="form.kiosk_setting.temperature_display_unit=='c'?10:20"
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
      v-if="getPackageType == 'Cloud'"
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      id="brightness"
      label="Brightness"
      label-for="area"
    >
      <div class="d-flex align-items-center">
        <i class="bx bxs-brightness-half setting-icon mr-2"></i>
        <b-slider 
          v-model="form.kiosk_setting.kiosk_brightness"
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
      v-if="getPackageType == 'Cloud'"
      class="align-items-center text-muted"
      label-cols-sm="4"
      label-cols-lg="4"
      id="volume:"
      label="Volume"
      label-for="area"
    >
      <div class="d-flex align-items-center" variant="primary">
        <i class="bx bxs-volume-mute setting-icon mr-2"></i>
        <b-slider 
          v-model="form.kiosk_setting.kiosk_volume"
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
      v-if="getPackageType == 'Cloud'"
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
          v-model="form.kiosk_setting.rfid_counter"
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
      v-if="getPackageType == 'Cloud'"
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
            v-model="form.kiosk_setting.custom_smtp_server"
          ></b-form-checkbox>
    </b-form-group>
    <!-- smtp settings  -->
    <div class="smtp_settings" v-if="form.kiosk_setting.custom_smtp_server && getPackageType == 'Cloud'">
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
        v-model="form.kiosk_setting.smtp_address"
        type="text"
        placeholder="Enter Server Address"
        :class="{
          'is-invalid': submitted && $v.form.kiosk_setting.smtp_address.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosk_setting.smtp_address.required"
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
        v-model="form.kiosk_setting.smtp_port"
        type="text"
        placeholder="Enter Port"
        :class="{
          'is-invalid': submitted && $v.form.kiosk_setting.smtp_port.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosk_setting.smtp_port.required"
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
        v-model="form.kiosk_setting.smtp_username"
        type="text"
        placeholder="Enter User Name"
        :class="{
          'is-invalid': submitted && $v.form.kiosk_setting.smtp_username.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosk_setting.smtp_username.required"
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
        v-model="form.kiosk_setting.smtp_password"
        type="password"
        placeholder="Enter Password"
        :class="{
          'is-invalid': submitted && $v.form.kiosk_setting.smtp_password.$error,
        }"
      ></b-form-input>
      <div
        v-if="submitted && !$v.form.kiosk_setting.smtp_password.required"
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
            v-model="form.kiosk_setting.smtp_tls"
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
            v-model="form.kiosk_setting.smtp_ssl"
          ></b-form-checkbox>
    </b-form-group>
    </div>
    <!-- password setting  -->
    <b-form-group v-if="getPackageType == 'Cloud'">
      <Collapsible
        class="Collapsible"
        openLabel="Close Builder Settings"
        closedLabel="Open Builder Settings"
        :isOpen="false"
      >
        <div slot="trigger">
          <div class="customTrigger">
            <h4 class="collapse-trigger mb-0 d-flex align-items-center">
              Kiosk Password Settings
            </h4>
          </div>
        </div>
        <div class="content mt-4 py-1">
          <!-- current password  -->
          <b-form-group
            v-if="getPackageType == 'Cloud'"
            class="text-muted"
            label-cols-sm="4"
            label-cols-lg="4"
            label="Current Password"
            label-for="current_password"
          >
            <b-input-group>
              <b-form-input
                autocomplete="new-password"
                v-model="current_kiosk_password"
                type="password"
                id="kiosk_password"
                name="kiosk_password"
                placeholder="Enter Current Password"
              />
            </b-input-group>
          </b-form-group>
          <!-- new password  -->
          <b-form-group
            v-if="getPackageType == 'Cloud'"
            class="text-muted"
            label-cols-sm="4"
            label-cols-lg="4"
            label="New Password"
            label-for="new_kiosk_password"
          >
            <b-form-input
              autocomplete="new-password"
              v-model="form.kiosk_setting.kiosk_password"
              :state="
                $v.form.kiosk_setting.kiosk_password.$dirty
                  ? !$v.form.kiosk_setting.kiosk_password.$error
                  : null
              "
              :class="{
                'is-invalid': $v.form.kiosk_setting.kiosk_password.$error,
              }"
              type="password"
              id="new_kiosk_password"
              name="new_kiosk_password"
              placeholder="Enter New Password"
            />
            <div
              v-if="$v.form.kiosk_setting.kiosk_password.$error"
              class="invalid-feedback"
            >
              <span v-if="!$v.form.kiosk_setting.kiosk_password.minLength"
                >Password must be at least 6 characters.</span
              >
            </div>
          </b-form-group>
          <!-- confirm new password  -->
          <b-form-group
            v-if="getPackageType == 'Cloud'"
            class="text-muted"
            label-cols-sm="4"
            label-cols-lg="4"
            label="Confirm New Password"
            label-for="confirm_kiosk_password"
          >
            <b-form-input
            autocomplete="new-password"
              v-model="form.kiosk_setting.confirm_kiosk_password"
              :class="{
                'is-invalid':
                  $v.form.kiosk_setting.confirm_kiosk_password.$error,
              }"
              :state="
                $v.form.kiosk_setting.confirm_kiosk_password.$dirty
                  ? !$v.form.kiosk_setting.confirm_kiosk_password.$error
                  : null
              "
              type="password"
              id="confirm_kiosk_password"
              name="confirm_kiosk_password"
              placeholder="Confirm New Password"
            />
            <div
              v-if="$v.form.kiosk_setting.confirm_kiosk_password.$error"
              class="invalid-feedback"
            >
              <span
                v-if="
                  !$v.form.kiosk_setting.confirm_kiosk_password.sameAsPassword
                "
              >
                Password and confirmation password do not match
              </span>
            </div>
          </b-form-group>
        </div>
      </Collapsible>
    </b-form-group>
    <div class="d-flex justify-content-end align-items-center mt-1">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('updateKiosk')"
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
        {{ siteInfoLength > 0 ? "Update" : "Submit" }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.kiosk-form-wrapper {
  .Collapsible {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    .collapse-trigger {
      background-color: #f9f9f9;
      padding-top: 5px;
      padding-bottom: 5px;
      // padding-left: 15px;
      color: #74788d;
      font-size: 1rem;
      // border: 1px solid #ccc;
      cursor: pointer;
      &:hover {
        background-color: #103f5e;
        color: #fff;
      }
      .menu-icon {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
