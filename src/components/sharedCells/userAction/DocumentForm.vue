<template>
  <div>
    <div class="form-group">
      <h5 class="title-text mb-3">Vaccine/PCR</h5>
      <!-- document  -->
      <div v-if="!default_walk_in" class="mb-3 d-flex align-items-center">
        <multiselect
          id="document"
          v-model="vaccine_pcr.document"
          :options="vaccine_pcr.documentOptions"
          placeholder="Select Valid Document"
          :show-labels="false"
          label="value"
          :allowEmpty="true"
          :taggable="true"
          deselectLabel
        />
        <i
          v-if="vaccine_pcr.document"
          class="mdi mdi-close-thick mx-1 clear-icon"
          @click="clearDocument"
        ></i>
      </div>
      <div class="info-wrapper mb-4 text-center">
        <p v-if="!default_walk_in" class="text-muted mb-1">Or</p>
        <p class="text-muted mb-1">Add document details manually</p>
      </div>
      <!-- vaccine-pcr toggle -->
      <b-form-group
        :class="vaccine_pcr.document && 'disabled-item'"
        class="checkbox-wrapper"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Vaccine/PCR"
      >
        <div class="d-flex align-items-center align-content-center">
          <b-form-radio
            :disabled="vaccine_pcr.document"
            v-model="vaccine_pcr.vaccine_pcr"
            value="vaccine"
            >Vaccine</b-form-radio
          >
          <b-form-radio
            class="mx-4"
            :disabled="vaccine_pcr.document"
            v-model="vaccine_pcr.vaccine_pcr"
            value="pcr"
            >PCR</b-form-radio
          >
        </div>
      </b-form-group>
      <!-- vaccine data  -->
      <div
        v-if="vaccine_pcr.vaccine_pcr == 'vaccine'"
        class="vaccine-inputs-wrapper"
      >
        <!-- name   -->
        <b-form-group
          :class="vaccine_pcr.document && 'disabled-item'"
          label-cols-sm="4"
          label-cols-lg="4"
          label="Vaccine Name"
          label-for="name"
        >
          <b-form-input
            :disabled="vaccine_pcr.document"
            id="name"
            v-model="vaccine_pcr.vaccine_name"
            type="text"
            placeholder="Enter Name"
            :class="{
              'is-invalid':
                submitted && validation.vaccine_pcr.vaccine_name.$error,
            }"
          ></b-form-input>
          <div
            v-if="submitted && !validation.vaccine_pcr.vaccine_name.required"
            class="invalid-feedback"
          >
            Vaccine name is required.
          </div>
        </b-form-group>
        <!-- number   -->
        <b-form-group
          :class="vaccine_pcr.document && 'disabled-item'"
          label-cols-sm="4"
          label-cols-lg="4"
          label="Batch Number"
          label-for="number"
        >
          <b-form-input
            :disabled="vaccine_pcr.document"
            id="number"
            v-model="vaccine_pcr.vaccine_number"
            type="text"
            placeholder="Enter Batch Number"
          ></b-form-input>
        </b-form-group>
        <!-- given date  -->
        <b-form-group
          :class="vaccine_pcr.document && 'disabled-item'"
          label-cols-sm="4"
          label-cols-lg="4"
          label="Date Vaccine Given"
          label-for="date"
        >
          <date-picker
            id="date"
            :class="{
              'is-invalid invalid-date-input':
                submitted && validation.vaccine_pcr.vaccine_expire_date.$error,
            }"
            v-model="vaccine_pcr.vaccine_given_date"
            :first-day-of-week="1"
            lang="en"
            placeholder="Select Date"
            value-type="format"
            format="YYYY-MM-DD"
            :disabledDate="disableDateAfterCurrent"
            :disabled="vaccine_pcr.document"
          ></date-picker>
          <div
            v-if="
              submitted && !validation.vaccine_pcr.vaccine_given_date.required
            "
            class="invalid-feedback"
          >
            Vaccine given date is required.
          </div>
        </b-form-group>
        <!-- expire date  -->
        <b-form-group
          :class="vaccine_pcr.document && 'disabled-item'"
          label-cols-sm="4"
          label-cols-lg="4"
          label="Vaccine Expiry Date"
          label-for="expire_date"
        >
          <date-picker
            id="expire_date"
            :class="{
              'is-invalid invalid-date-input':
                submitted && validation.vaccine_pcr.vaccine_expire_date.$error,
            }"
            v-model="vaccine_pcr.vaccine_expire_date"
            :first-day-of-week="1"
            lang="en"
            placeholder="Select Date"
            type="datetime"
            value-type="format"
            format="YYYY-MM-DD HH:mm:ss"
            :disabledDate="disabledExpiredDate"
          :disabled='!vaccine_pcr.vaccine_given_date'
          ></date-picker>
          <div
            v-if="
              submitted && !validation.vaccine_pcr.vaccine_expire_date.required
            "
            class="invalid-feedback"
          >
            Vaccine expire date is required.
          </div>
        </b-form-group>
      </div>
      <!-- pcr data  -->
      <div v-if="vaccine_pcr.vaccine_pcr == 'pcr'" class="pcr-inputs-wrapper">
        <!-- result  -->
        <b-form-group
          :class="vaccine_pcr.document && 'disabled-item'"
          label-cols-sm="4"
          label-cols-lg="4"
          label="PCR Results"
          label-for="result"
        >
          <b-form-checkbox
            class="comp-checkbox"
            v-model="vaccine_pcr.pcr_result"
            disabled
          >
            Negative PCR
          </b-form-checkbox>
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
            v-model="vaccine_pcr.pcr_date"
            :class="{
              'is-invalid invalid-date-input':
                submitted && validation.vaccine_pcr.pcr_date.$error,
            }"
            :first-day-of-week="1"
            lang="en"
            placeholder="Select Date"
            type="datetime"
            value-type="format"
            format="YYYY-MM-DD HH:mm:ss"
            :disabled="vaccine_pcr.document"
          ></date-picker>
          <div
            v-if="submitted && !validation.vaccine_pcr.pcr_date.required"
            class="invalid-feedback"
          >
            PCR date is required.
          </div>
        </b-form-group>
      </div>
      <!-- notes  -->
      <b-form-group
        :class="vaccine_pcr.document && 'disabled-item'"
        label-cols-sm="4"
        label-cols-lg="4"
        label="Notes"
        label-for="notes"
      >
        <textarea
          class="form-control"
          id="notes"
          v-model="vaccine_pcr.notes"
          type="text"
          placeholder="Notes"
          rows="1"
          :disabled="vaccine_pcr.document"
        ></textarea>
      </b-form-group>
    </div>
  </div>
</template>

<script >
export default {
  props: ["vaccine_pcr", "submitted", "validation", "default_walk_in"],
  methods: {
    disabledExpiredDate(date) {
      const givenDate = new Date();
      givenDate.setHours(0, 0, 0, 0);
      return date <= givenDate;
    },
    disableDateAfterCurrent(date) {
      return date > new Date();
    },
    clearDocument() {
      this.vaccine_pcr.document = null;
    },
  },
};
</script>
<style style="scss" scoped>
.title-text {
  color: #bebebe;
  font-weight: bold;
}
.disabled-item {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
