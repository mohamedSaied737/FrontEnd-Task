<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import { required, email } from "vuelidate/lib/validators";
import moment from "moment";

export default {
  name: "SiteActionForm",
  components: { Multiselect },
  data() {
    return {
      siteInfoLength: null,
      siteId: null,
      timezone: null,
      form: {
        site: {
          name: "",
          reception_email: "",
          entity_id: "",
        },
      },
      timezoneObject: null,
      submitted: false,
    };
  },
  validations: {
    form: {
      site: {
        reception_email: { required, email },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", ["getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
    disableBtn() {
      const { name, reception_email } = this.form.site;
      return name && reception_email && this.timezone ? false : true;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("updateSite");
    },
  },
  methods: {
    ...mapActions("sites", ["updateSite", "createSite"]),
    onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        this.form.site.timezone = this.timezone ? this.timezone : null;
        this.siteInfoLength
          ? this.updateSite({
              id: this.siteId,
              params: this.form,
            })
          : this.createSite({
              params: this.form,
            });
      }
    },
  },
  beforeMount() {
    this.timezoneObject = moment.tz.names();
    // set site data
    this.form.site.entity_id = this.currentEntity.id;
    this.siteInfoLength =
      this.getModalInfo && Object.keys(this.getModalInfo).length > 0;
    if (this.getModalInfo && Object.keys(this.getModalInfo).length > 0) {
      const { id, name, timezone, reception_email } = this.getModalInfo;
      this.form.site.name = name;
      this.form.site.reception_email = reception_email;
      this.siteId = id;
      timezone && (this.timezone = timezone);
    }
  },
};
</script>

<template>
  <div class="site-action-form">
    <p class="text-secondary mb-3">
      {{ siteInfoLength > 0 ? "Edit Site" : "Add Site" }}
    </p>
    <div class="form-groups">
      <!-- name   -->
      <b-form-group
        label-cols-sm="5"
        label-cols-lg="4"
        id="siteName"
        label="Site Name"
        label-for="name"
      >
        <b-form-input
          id="siteName"
          v-model="form.site.name"
          type="text"
          placeholder="Enter Name"
        ></b-form-input>
      </b-form-group>
      <!-- Email Reception Address  -->
      <b-form-group
        class="no-wrap"
        label-cols-sm="5"
        label-cols-lg="4"
        id="email"
        label="Reception Email"
        label-for="name"
      >
        <b-form-input
          id="email"
          v-model="form.site.reception_email"
          type="email"
          placeholder="Enter Reception Email"
          :class="{
            'is-invalid': submitted && $v.form.site.reception_email.$error,
            'is-valid': !$v.form.site.reception_email.$invalid,
          }"
        ></b-form-input>
        <div
          v-if="submitted && $v.form.site.reception_email.$error"
          class="invalid-feedback"
        >
          <span v-if="!$v.form.site.reception_email.email">
            Please enter a valid email address.</span
          >
        </div>
      </b-form-group>
      <!-- timezone  -->
      <b-form-group
        class="font-weight-normal"
        label-cols-sm="5"
        label-cols-lg="4"
        id="timezone"
        label="Time Zone"
      >
        <multiselect
          id="timezone"
          v-model="timezone"
          :options="timezoneObject"
          placeholder="Select Time Zone"
          :show-labels="false"
          :allowEmpty="true"
        />
      </b-form-group>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('updateSite')"
      >
        Cancel
      </button>
      <button
        :disabled="getLoading || disableBtn"
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
