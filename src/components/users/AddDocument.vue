<script>
import { mapActions, mapGetters } from "vuex";
import { required, requiredIf } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";

export default {
  name: "AddDocument",
  components: { Multiselect, DatePicker },
  data() {
    return {
      form: {
        document: null,
        vaccine_pcr: "vaccine",
        notes: "",
      },
      vaccine: {
        vaccine_name: null,
        vaccine_number: null,
        vaccine_given_date: null,
        vaccine_expire_date: null,
      },
      pcr: {
        pcr_result: null,
        pcr_date: null,
      },
      pcrResultOptions: [
        {
          id: "positive",
          name: "Positive PCR",
        },
        {
          id: "negative",
          name: "Negative PCR",
        },
      ],
      submitted: false,
    };
  },
  validations: {
    form: {
      document: { required },
    },
    vaccine: {
      vaccine_name: {
        required: requiredIf(function () {
          return this.form.vaccine_pcr === "vaccine";
        }),
      },
      vaccine_given_date: {
        required: requiredIf(function () {
          return this.form.vaccine_pcr === "vaccine";
        }),
      },
      vaccine_expire_date: {
        required: requiredIf(function () {
          return this.form.vaccine_pcr === "vaccine";
        }),
      },
    },
    pcr: {
      pcr_result: {
        required: requiredIf(function () {
          return this.form.vaccine_pcr === "pcr";
        }),
      },
      pcr_date: {
        required: requiredIf(function () {
          return this.form.vaccine_pcr === "pcr";
        }),
      },
    },
  },
  computed: {
    ...mapGetters("users", ["getDocuments", "getLoading", "getModalState"]),
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("authfack", ["currentEntity"]),
  },
  methods: {
    ...mapActions("users", ["createDocument", "resetLoading", "onSelectDocument"]),
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
    onSubmit(e) {
      e.preventDefault();
      const {
        form,
        vaccine,
        pcr,
        currentEntity,
        getModalInfo,
        handleCovidType,
        createDocument,
      } = this;
      const { document, notes, vaccine_pcr } = form;
      const {
        vaccine_name,
        vaccine_number,
        vaccine_given_date,
        vaccine_expire_date,
      } = vaccine;
      const { pcr_result, pcr_date } = pcr;
      const {first_name,last_name,id} = getModalInfo;
      //   validation
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        const vaccineData = {
          certificateModel: {
            extraData: {},
            dateOfBirth: "",
            kid: "",
            person: {
              familyName: last_name,
              givenName: first_name,
              standardisedFamilyName: last_name,
              standardisedGivenName: first_name,
            },
            signature: "",
            vaccinations: [
              {
                certificateIdentifier: "",
                certificateIssuer: "",
                countryOfVaccination: "",
                dateOfVaccination: vaccine_given_date,
                disease: "COVID-19",
                doseNumber: "",
                manufacturer: "",
                medicinalProduct: "",
                totalSeriesOfDoses: "",
                batchNumber:vaccine_number,
                vaccine: vaccine_name,
              },
            ],
          },
          generalVerificationResult: "",
          greenCertificatData: {
            expirationTime: vaccine_expire_date,
            issuedAt: "",
            issuingCountry: "",
          },
          type: "",
          notes,
        };
        const pcrData = {
          certificateModel: {
            dateOfBirth: "",
            kid: "",
            person: {
              familyName: last_name,
              givenName: first_name,
              standardisedFamilyName: last_name,
              standardisedGivenName:first_name,
            },
            signature: "",
            tests: [
              {
                disease: "",
                typeOfTest: "",
                testName: "",
                testNameAndManufacturer: null,
                dateTimeOfCollection: "",
                dateTimeOfTestResult: pcr_date,
                testResult: (pcr_result&&pcr_result.id =="positive")?"Detected":"Not detected",
                testResultCode:(pcr_result&&pcr_result.id =="positive")?"260373001":"260415000",
                testingCentre: "",
                countryOfVaccination: "",
                certificateIssuer: "",
                certificateIdentifier: "",
                countryCode: "",
              },
            ],
          },
          generalVerificationResult: "",
          greenCertificatData: {
            expirationTime: "",
            issuedAt: "",
            issuingCountry: "",
          },
          type: "INTERNATIONAL",
          notes,
        };
        const data = {
          entity_id: currentEntity.id,
          user_id: id,
          document: document && document.id,
          expiry_date: vaccine_expire_date,
          start_date :vaccine_pcr == "vaccine" ? null :pcr_date,
          type: handleCovidType(),
          notes,
          metadata: vaccine_pcr == "vaccine" ? vaccineData : pcrData,
        };
        createDocument(data);
      }
    },
    disabledExpiredDate(date){
      const givenDate = new Date(this.vaccine.vaccine_given_date);
      givenDate.setHours(0, 0, 0, 0);
      return date < givenDate;
    },
    disableDateAfterCurrent(date){
      return date > new Date
    }
  },
  watch:{
    'form.document'(value){
      value && this.onSelectDocument(true);
    },
    getModalState(modalState) {
      modalState && this.$bvModal.hide("addDocument");
    },
  },
  beforeMount() {
    this.resetLoading();
  },
};
</script>

<template>
  <form class="document-form-wrapper" @submit="onSubmit">
    <p class="text-muted mb-3">Add Document</p>
    <!-- document  -->
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="4"
      label="Document"
      label-for="document"
    >
      <multiselect
        id="document"
        :class="{
          'is-invalid invalid-select-input':
            submitted && $v.form.document.$error,
        }"
        v-model="form.document"
        :options="getDocuments"
        placeholder="Select Document"
        :show-labels="false"
        label="name"
        :allowEmpty="true"
      />
      <div
        v-if="submitted && !$v.form.document.required"
        class="invalid-feedback"
      >
        Document is required.
      </div>
    </b-form-group>
    <div v-if="form.document">
    <!-- vaccine-pcr toggle -->
    <b-form-group
      class="checkbox-wrapper"
      label-cols-sm="4"
      label-cols-lg="4"
      label="Vaccine/PCR"
    >
      <div class="d-flex align-items-center align-content-center">
        <b-form-radio v-model="form.vaccine_pcr" value="vaccine"
          >Vaccine</b-form-radio
        >
        <b-form-radio class="mx-4" v-model="form.vaccine_pcr" value="pcr"
          >PCR</b-form-radio
        >
      </div>
    </b-form-group>
    <!-- vaccine data  -->
    <div v-if="form.vaccine_pcr == 'vaccine'" class="vaccine-inputs-wrapper">
      <!-- name   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="Vaccine Name"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="vaccine.vaccine_name"
          type="text"
          placeholder="Enter Name"
          :class="{
            'is-invalid': submitted && $v.vaccine.vaccine_name.$error,
          }"
        ></b-form-input>
        <div
          v-if="submitted && !$v.vaccine.vaccine_name.required"
          class="invalid-feedback"
        >
          Vaccine name is required.
        </div>
      </b-form-group>
      <!-- number   -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="Batch Number"
        label-for="number"
      >
        <b-form-input
          id="number"
          v-model="vaccine.vaccine_number"
          type="text"
          placeholder="Enter Batch Number"
        ></b-form-input>
        <!-- <div
          v-if="submitted && !$v.vaccine.vaccine_number.required"
          class="invalid-feedback"
        >
          Vaccine Batch Number is required.
        </div> -->
      </b-form-group>
      <!-- given date  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="Date Vaccine Given"
        label-for="date"
      >
        <date-picker
          id="date"
          :class="{
            'is-invalid invalid-date-input':
              submitted && $v.vaccine.vaccine_expire_date.$error,
          }"
          v-model="vaccine.vaccine_given_date"
          :first-day-of-week="1"
          lang="en"
          placeholder="Select Date"
          value-type="format"
          format="YYYY-MM-DD"
          :disabledDate='disableDateAfterCurrent'
        ></date-picker>
        <div
          v-if="submitted && !$v.vaccine.vaccine_given_date.required"
          class="invalid-feedback"
        >
          Vaccine given date is required.
        </div>
      </b-form-group>
      <!-- expire date  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="Vaccine Expiry Date"
        label-for="expire_date"
      >
        <date-picker
          id="expire_date"
          :class="{
            'is-invalid invalid-date-input':
              submitted && $v.vaccine.vaccine_expire_date.$error,
          }"
          v-model="vaccine.vaccine_expire_date"
          :first-day-of-week="1"
          lang="en"
          placeholder="Select Date"
          type="datetime"
          value-type="format"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled='!vaccine.vaccine_given_date'
          :disabledDate='disabledExpiredDate'
        ></date-picker>
        <div
          v-if="submitted && !$v.vaccine.vaccine_expire_date.required"
          class="invalid-feedback"
        >
          Vaccine expire date is required.
        </div>
      </b-form-group>
    </div>
    <!-- pcr data  -->
    <div v-if="form.vaccine_pcr == 'pcr'" class="pcr-inputs-wrapper">
      <!-- result  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="PCR Results"
        label-for="result"
      >
        <multiselect
          id="result"
          :class="{
            'is-invalid invalid-select-input':
              submitted && $v.pcr.pcr_result.$error,
          }"
          v-model="pcr.pcr_result"
          :options="pcrResultOptions"
          placeholder="Select PCR Result"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
        />
        <div
          v-if="submitted && !$v.pcr.pcr_result.required"
          class="invalid-feedback"
        >
          PCR result is required.
        </div>
      </b-form-group>
      <!-- pcr date  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="4"
        label="PCR Date"
        label-for="pcr_date"
      >
        <date-picker
          id="pcr_date"
          v-model="pcr.pcr_date"
          :class="{
            'is-invalid invalid-date-input':
              submitted && $v.pcr.pcr_date.$error,
          }"
          :first-day-of-week="1"
          lang="en"
          placeholder="Select Date"
          type="datetime"
          value-type="format"
          format="YYYY-MM-DD HH:mm:ss"
        ></date-picker>
        <div
          v-if="submitted && !$v.pcr.pcr_date.required"
          class="invalid-feedback"
        >
          PCR date is required.
        </div>
      </b-form-group>
    </div>
    <!-- notes  -->
    <b-form-group
      label-cols-sm="4"
      label-cols-lg="4"
      label="Notes"
      label-for="notes"
    >
      <b-form-textarea
        id="notes"
        class="form-control"
        v-model="form.notes"
        type="text"
        placeholder="Notes"
        rows="3"
    no-resize
      ></b-form-textarea>
    </b-form-group>
    <!-- action btns  -->
    <div class="d-flex justify-content-end align-items-center mt-2">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('addDocument')"
      >
        Cancel
      </button>
      <button
        class="submit-btn btn btn-primary px-4"
        size="md"
        type="submit"
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
  </form>
</template>
