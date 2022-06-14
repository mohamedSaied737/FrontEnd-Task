<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "VaccineDetails",
  data() {
    return {
      user_name: null,
      first_name: null,
      last_name: null,
      type: null,
      // vaccine
      vaccine_name: null,
      batch_number: null,
      given_date: null,
      expiry_date: null,
      // pcr
      pcr_name: null,
      pcr_date: null,
      notes: null,
      status: false,
      document_Id: null,
      metadata: null,
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("users", [
      "getVaccineToggleLoading",
      "getVaccineDeleteLoading",
      "getModalState",
    ]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("vaccineDetails");
    },
  },
  methods: {
    ...mapActions("users", ["userDocumentStatus", "resetLoading"]),
    handleCovidType() {
      switch (this.form.vaccine_pcr) {
        case "vaccine":
          return "covid_vaccine";
        case "pcr":
          return "covid_pcr";
        default:
          break;
      }
    },
    onSubmit(status) {
      const { userDocumentStatus, document_Id } = this;
      userDocumentStatus({
        id: document_Id,
        status,
      });
    },
    getPageTitle(type) {
      switch (type) {
        case "covid_vaccine":
          return "Vaccine Details";
        case "covid_pcr":
          return "PCR Details";
        case "covid_recovery":
          return "Vaccine Recovery Details";
        default:
          return "Details";
      }
    },
  },
  beforeMount() {
    this.resetLoading();
  },
  mounted() {
    if (this.getModalInfo) {
      const {
        LastVaccine: {
          type,
          status,
          id,
          expiry_date,
          metadata,
          metadata: { certificateModel, notes },
        },
      } = this.getModalInfo.data;
      this.metadata = metadata;
      this.first_name =
        certificateModel &&
        (certificateModel.person.givenName
          ? certificateModel.person.givenName.toLowerCase()
          : certificateModel.person.givenName);
      this.last_name =
        certificateModel &&
        (certificateModel.person.familyName
          ? certificateModel.person.familyName.toLowerCase()
          : certificateModel.person.familyName);
      this.user_name =
        this.first_name && this.last_name
          ? `${this.first_name} ${this.last_name}`
          : this.first_name;
      this.notes = notes;
      this.type = type;
      this.status = status;
      this.document_Id = id;
      if (type == "covid_pcr") {
        (this.pcr_name = certificateModel.tests
          ? certificateModel.tests[0].testResult.name
          : null),
          (this.pcr_date = certificateModel.tests
            ? certificateModel.tests[0].dateTimeOfTestResult
            : null);
      } else {
        this.vaccine_name = certificateModel.vaccinations
          ? certificateModel.vaccinations[0].vaccine
          : null;
        this.expiry_date = expiry_date;
        this.given_date = certificateModel.vaccinations
          ? certificateModel.vaccinations[0].dateOfVaccination
          : null;
        this.batch_number = certificateModel.vaccinations
          ? certificateModel.vaccinations[0].totalSeriesOfDoses
          : null;
      }
    }
  },
};
</script>

<template>
  <form class="vaccine-form-wrapper" v-if="metadata">
    <div class="header d-flex align-items-center justify-content-between">
      <p class="mb-3 font-weight-bold">
        {{ getPageTitle(type) }}
      </p>
      <i
        @click="$bvModal.hide('vaccineDetails')"
        class="mdi mdi-close-thick close-icon mb-3"
      ></i>
    </div>
    <!-- user name  -->
    <!-- vaccine name  -->
    <b-form-group
      v-if="user_name"
      class="text-muted border-bottom text-capitalize"
      label="Person Name"
      label-for="vaccine"
    >
      <p class="text-value">{{ user_name }}</p>
    </b-form-group>
    <!-- vaccine  -->
    <div v-if="type == 'covid_vaccine' || type == 'covid_recovery'" class="vaccine-inputs">
      <!-- vaccine name  -->
      <b-form-group
        v-if="vaccine_name"
        class="text-muted border-bottom"
        label="Vaccine Name"
        label-for="vaccine"
      >
        <p class="text-value">{{ vaccine_name }}</p>
      </b-form-group>
      <!-- batch number  -->
      <b-form-group
        v-if="batch_number"
        class="text-muted border-bottom"
        label="Batch Number"
        label-for="number"
      >
        <p class="text-value">{{ batch_number }}</p>
      </b-form-group>
      <!-- given date  -->
      <b-form-group
        v-if="given_date"
        class="text-muted border-bottom"
        label="Date Vaccine Given"
        label-for="given_date"
      >
        <p class="text-value">{{ given_date }}</p>
      </b-form-group>
      <!-- date  -->
      <b-form-group
        v-if="expiry_date"
        class="text-muted border-bottom"
        label="Expiry Date"
        label-for="vaccine"
      >
        <p class="text-value">{{ expiry_date }}</p>
      </b-form-group>
    </div>
    <!-- pcr  -->
    <div v-else class="pcr-inputs">
      <!-- pcr name  -->
      <b-form-group
        v-if="pcr_name"
        class="text-muted border-bottom"
        label="PCR"
        label-for="pcr"
      >
        <p class="text-value">{{ pcr_name }}</p>
      </b-form-group>
      <!-- date  -->
      <b-form-group
        v-if="pcr_date"
        class="text-muted border-bottom"
        label="PCR Date"
        label-for="pcr_date"
      >
        <p class="text-value">{{ pcr_date }}</p>
      </b-form-group>
    </div>
    <!-- notes  -->
    <b-form-group
      v-if="notes"
      class="text-muted border-bottom"
      label="Notes:"
      label-for="notes"
    >
      <p class="text-value">{{ notes }}</p>
    </b-form-group>
    <!-- action btns  -->
    <div
      v-if="getModalInfo.type == 'user_document'"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <button
        class="btn btn-primary px-4 mr-2"
        type="button"
        @click="onSubmit('DELETED')"
        :disabled="status == 'deleted' || getVaccineDeleteLoading"
      >
        <i
          v-if="getVaccineDeleteLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Delete
      </button>
      <button
        v-if="status == 'enabled' && status != 'deleted'"
        class="submit-btn btn btn-outline-primary px-4"
        size="md"
        type="button"
        :disabled="getVaccineToggleLoading"
        @click="onSubmit('DISABLED')"
      >
        <i
          v-if="getVaccineToggleLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Disable
      </button>
      <button
        v-else-if="status == 'disabled' && status != 'deleted'"
        class="submit-btn btn btn-outline-primary px-4"
        size="md"
        type="button"
        :disabled="getVaccineToggleLoading"
        @click="onSubmit('ENABLED')"
      >
        <i
          v-if="getVaccineToggleLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Enable
      </button>
    </div>
  </form>
  <h3 class="mb-0 text-center" v-else>No Data to Display</h3>
</template>
<style lang="scss" scoped>
.vaccine-form-wrapper {
  .close-icon {
    font-size: 1.2rem;
    cursor: pointer;
  }
  .text-value {
    color: #000;
  }
}
</style>
