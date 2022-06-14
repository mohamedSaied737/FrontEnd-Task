<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Multiselect from "vue-multiselect";
import { FormWizard, TabContent } from "vue-form-wizard";
import ComplianceForm from "./ComplianceForm";
import DocumentForm from "./DocumentForm";
import { requiredIf } from "vuelidate/lib/validators";

export default {
  name: "ActionForm",
  components: {
    Multiselect,
    FormWizard,
    TabContent,
    ComplianceForm,
    DocumentForm,
  },
  data() {
    return {
      site: null,
      area: null,
      mask_check: false,
      scan: {
        temperature: null,
        temperature_type: "c",
        has_mask: 0,
        area_id: null,
        data_type_id: null,
      },
      visit: {
        user_id: null,
        entity_id: null,
        scan_data_type_id: null,
        timezone: null,
      },
      vaccine_pcr: {
        flow_has_vaccien: null,
        document: null,
        documentOptions: [
          {
            id: 1,
            name: "document_1",
          },
          {
            id: 2,
            name: "document_2",
          },
        ],
        vaccine_pcr: "vaccine",
        vaccine_name: null,
        vaccine_number: null,
        vaccine_given_date: null,
        vaccine_expire_date: null,
        pcr_result: true,
        pcr_date: null,
        notes: "",
      },
      complinaces: null,
      submitted: null,
      user_id: null,
      default_walk_in: false,
    };
  },
  validations: {
    vaccine_pcr: {
      vaccine_name: {
        required: requiredIf(function () {
          return (
            this.vaccine_pcr.vaccine_pcr === "vaccine" &&
            this.vaccine_pcr.flow_has_vaccien &&
            !this.vaccine_pcr.document
          );
        }),
      },
      vaccine_given_date: {
        required: requiredIf(function () {
          return (
            this.vaccine_pcr.vaccine_pcr === "vaccine" &&
            this.vaccine_pcr.flow_has_vaccien &&
            !this.vaccine_pcr.document
          );
        }),
      },
      vaccine_expire_date: {
        required: requiredIf(function () {
          return (
            this.vaccine_pcr.vaccine_pcr === "vaccine" &&
            this.vaccine_pcr.flow_has_vaccien &&
            !this.vaccine_pcr.document
          );
        }),
      },
      pcr_date: {
        required: requiredIf(function () {
          return (
            this.vaccine_pcr.vaccine_pcr === "pcr" &&
            this.vaccine_pcr.flow_has_vaccien &&
            !this.vaccine_pcr.document
          );
        }),
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", [
      "getSites",
      "getAreas",
      "getStatusForArea",
      "getCompliances",
      "getAreaDocuments",
      "getHasVisit",
      "getCheckInMsg",
      "getLoader"
    ]),
    ...mapGetters("dailyLogbook", ["getScanDataTypes", "getLoadingStatus"]),
    ...mapGetters("authfack", ["currentEntity"]),
  },
  watch: {
    getModalState(state) {
      state == true && this.$bvModal.hide("dashboardAction");
    },
    getLoader(getLoader) {
       console.log('getLoader', getLoader);
     },
    site(site) {
      site && this.fetchAreasHaskiosks(site.id);
      this.area = null;
      this.submitted = null;
    },
    area(area) {
      if (area && area.id) {
        this.checkUserHasVisitInArea({
          user_id: this.getModalInfo.entity_id
            ? this.getModalInfo.user_id
            : this.getModalInfo.id,
          area_id: area.id,
        });
      }
      this.getScanDataTypes.length > 0 &&
        this.getScanDataTypes.map((scan) => {
          scan.name == "Checked in"
            ? ((this.visit.scan_data_type_id = scan.id),
              (this.scan.data_type_id = scan.id))
            : "check out";
        });
      const { id, user_id } = this.getModalInfo;
      // fill scan state
      this.scan.area_id = area && area.id ? area.id : "";
      // fill visit state
      this.visit.user_id =
        this.$route.name == "users" || this.$route.name == "usersTypes"
          ? id
          : user_id;
      this.visit.entity_id = this.currentEntity.id;
      // set time zone
      let userTimezone = moment.tz.guess();
      this.visit.timezone = moment()
        .tz(userTimezone)
        .format("YYYY-MM-DD hh:mm:ss");
        if (area && area.id) {
      this.fetchStatusForArea({
        area_id: area.id,
        user_id:
          this.$route.name == "users" || this.$route.name == "usersTypes"
            ? id
            : user_id,
      });
      // fetch compliance by area
      this.fetchAreaCompliances({
        area_id: area.id,
        user_id:
          this.$route.name == "users" || this.$route.name == "usersTypes"
            ? id
            : user_id,
      });
      this.fetchAreaDocument({
        area_id: area.id,
        user_id:
          this.$route.name == "users" || this.$route.name == "usersTypes"
            ? id
            : user_id,
      });
        }
    },
    getCompliances(data) {
      const convertComplinaces = JSON.parse(JSON.stringify(data));
      this.complinaces =
        convertComplinaces.length > 0
          ? convertComplinaces.map((complinace) => {
              return {
                name: complinace.name,
                id: complinace.id,
                answer: complinace.form_metadata.data
                  ? complinace.form_metadata.data
                  : complinace.form_metadata.questions,
              };
            })
          : [];
      if (this.getStatusForArea && !this.getStatusForArea.signedOut) {
        this.complinaces = [];
      }
    },
    mask_check(value) {
      value ? (this.scan.has_mask = 1) : (this.scan.has_mask = 0);
    },
    getAreaDocuments(documents) {
      const { flow_has_vaccien, user_documents } = documents;
      this.vaccine_pcr.flow_has_vaccien = flow_has_vaccien;
      this.vaccine_pcr.documentOptions = user_documents.map((item) => {
        if (item.type == "covid_pcr") {
          const {
            metadata: {
              certificateModel: { tests },
            },
          } = item;
          return {
            id: item.id,
            name:
              tests[0].testResult == "Not detected"
                ? "Negative PCR"
                : "Positive PCR",
            date: tests[0].dateTimeOfTestResult,
            value: `${
              tests[0].testResult == "Not detected"
                ? "Negative PCR"
                : "Positive PCR"
            }  (${tests[0].dateTimeOfTestResult.substring(0, 10)})`,
          };
        } else if (item.type == "covid_vaccine") {
          const {
            metadata: {
              certificateModel: { vaccinations },
              greenCertificatData: { expirationTime },
            },
          } = item;
          return {
            id: item.id,
            name:
              vaccinations[0].vaccine && vaccinations[0].vaccine.length
                ? vaccinations[0].vaccine
                : "Vaccine",
            date: expirationTime,
            value: `${
              vaccinations[0].vaccine && vaccinations[0].vaccine.length
                ? vaccinations[0].vaccine
                : "Vaccine"
            }  (${expirationTime.substring(0, 10)})`,
          };
        }
      });
    },
  },
  methods: {
    ...mapActions("sites", [
      "fetchSites",
      "fetchAreasHaskiosks",
      "fetchStatusForArea",
      "fetchAreaCompliances",
      "fetchAreaDocument",
      "checkUserHasVisitInArea",
    ]),
    ...mapActions("dailyLogbook", [
      "dashboardAction",
      "fetchScanDatatypes",
      "resetState",
    ]),
    handleCovidType() {
      switch (this.vaccine_pcr.vaccine_pcr) {
        case "vaccine":
          return "covid_vaccine";
        case "pcr":
          return "covid_pcr";
        default:
          break;
      }
    },
    beforeTabOneSwitch(element) {
      let status = true;
      element.answer.map((item) => {
        return (item.yesAnswer && item.yesAnswer == true) ||
          (item.noAnswer && item.noAnswer == true)
          ? (status = true)
          : (status = false);
      });
      this.submitted = status;
      return this.submitted;
    },
    onSubmit() {
      console.log('out');
      let answeredCompliance =
        JSON.parse(JSON.stringify(this.complinaces)).length > 0
          ? JSON.parse(JSON.stringify(this.complinaces)).map((answer) => {
              return {
                id: answer.id,
                name: answer.name,
                answer: answer.answer.map((item) => {
                  return {
                    type: item.type,
                    body: item.body,
                    answer:
                      item.yesAnswer && item.noAnswer
                        ? item.answers
                        : item.yesAnswer
                        ? item.answers[0]
                        : item.answers[1],
                  };
                }),
              };
            })
          : [];
      //   validation
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid || (this.getStatusForArea && !this.getStatusForArea.signedOut)) {
        const { currentEntity, getModalInfo, vaccine_pcr, handleCovidType } =
          this;
        const { first_name, last_name } =
          this.$route.name == "users" ? getModalInfo : getModalInfo.user;
        const {
          flow_has_vaccien,
          document,
          vaccine_name,
          vaccine_number,
          vaccine_given_date,
          vaccine_expire_date,
          pcr_date,
          notes,
        } = vaccine_pcr;
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
                batchNumber: vaccine_number,
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
              standardisedGivenName: first_name,
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
                testResult: "Not detected",
                testResultCode: "260415000",
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
          user_id:
            this.$route.name == "users"
              ? getModalInfo.id
              : getModalInfo.user.id,
          document: document && document.id,
          expiry_date: vaccine_expire_date,
          start_date: vaccine_pcr.vaccine_pcr == "vaccine" ? null : pcr_date,
          type: handleCovidType(),
          notes,
          metadata:
            vaccine_pcr.vaccine_pcr == "vaccine" ? vaccineData : pcrData,
        };
        if (this.getStatusForArea && !this.getStatusForArea.signedOut) {
          this.scan.temperature = 0;
          this.scan.has_mask = 0;
          this.scan.temperature_type = "c";
        }
        this.dashboardAction({
          scan: this.scan,
          visit: this.visit,
          complinaces: answeredCompliance,
          document: flow_has_vaccien
            ? {
                document_id: document ? document.id : null,
                data,
              }
            : null,
        });
      }
    },
  },
  beforeMount() {
    this.fetchScanDatatypes();
    this.fetchSites();
    this.resetState();
    this.$route.name == "users"
      ? (this.user_id = this.getModalInfo.id)
      : (this.user_id = this.getModalInfo.user_id);
  },
  mounted() {
    // user is default walk in
    if (this.currentEntity.id == this.user_id) {
      this.default_walk_in = true;
    }
  },
};
</script>

<template>
  <div class="dashboard-action-wrapper" :class="{ hideBorder: !getStatusForArea || !getStatusForArea.signedOut || getLoader }">
    <p class="text-secondary mb-3">Check-in User</p>
    <div class="form-groups pt-2" :class="area ? '' : 'custom-padding'">
      <!-- sites  -->
      <div class="input-box mb-3 d-flex align-items-center">
        <label for="site" class="mb-0 font-weight-normal no-wrap input-label"
          >Select Site :</label
        >
        <multiselect
          class="site-select"
          id="site"
          v-model="site"
          :options="getSites"
          placeholder="select site.."
          :show-labels="false"
          label="name"
          :allowEmpty="true"
        />
      </div>
      <!-- areas  -->
      <div class="input-box mb-3 d-flex align-items-center">
        <label for="area" class="mb-0 font-weight-normal no-wrap input-label"
          >Select Area :</label
        >
        <multiselect
          class="area-select"
          id="area"
          v-model="area"
          :options="getAreas"
          placeholder="select area.."
          :show-labels="false"
          label="name"
          :allowEmpty="true"
          :disabled="!site"
        />
      </div>
      <p
        class="h5 mb-2"
        style="color: #f46a6a; font-size: 14px"
        v-if="getHasVisit && area && !getLoader"
      >
        <b-icon icon="info-circle-fill"></b-icon>
        {{ getCheckInMsg }}
      </p>
      <p
        class="h5 mb-2"
        style="color: DODGERBLUE; font-size: 14px"
        v-if="area && getStatusForArea && !getStatusForArea.signedOut && !getLoader"
      >
        <b-icon icon="info-circle"></b-icon> This user will be "Signed out" from
        this area.
      </p>
      <!-- form wizred  -->
      <div class="compliance-wizred mt-1" v-if="area">
        <form-wizard
          color="#103F5E"
          step-size="xs"
          @on-complete="onSubmit"
          v-if="getStatusForArea && getStatusForArea.signedOut && !getLoader"
        >
          <!-- Step 1  -->
          <tab-content
            icon="mdi mdi-account-cog-outline"
            v-if="getStatusForArea && getStatusForArea.signedOut"
          >
            <div class="scan-wrapper py-2">
              <div class="form-group mb-3">
                <p class="text-muted font-weight-normal mb-1">
                  Please Add The Following Information
                </p>
              </div>
              <!-- tempreture type -->
              <b-form-group
                label-cols-sm="5"
                label-cols-lg="5"
                label="Temperature Unit:"
                label-for="temperature"
                class="align-items-center input-wrapper no-wrap mb-2"
              >
                <div class="d-flex align-items-center">
                  <b-form-radio v-model="scan.temperature_type" value="f"
                    >°F</b-form-radio
                  >
                  <b-form-radio
                    class="mx-3"
                    v-model="scan.temperature_type"
                    value="c"
                    >°C</b-form-radio
                  >
                </div>
              </b-form-group>
              <!-- tempreture  -->
              <b-form-group
                label-cols-sm="5"
                label-cols-lg="5"
                :label="`Temperature: ${scan.temperature}`"
                label-for="temperature"
                class="align-items-center input-wrapper mb-2"
              >
                <div class="d-flex align-items-center">
                  <b-slider
                    v-model="scan.temperature"
                    :min="scan.temperature_type == 'c' ? 35 : 95"
                    :max="scan.temperature_type == 'c' ? 40 : 100"
                    ticks
                    :indicator="false"
                    :step="0.1"
                    size="is-small"
                    :rounded="true"
                  ></b-slider>
                </div>
              </b-form-group>
              <!-- mask  -->
              <b-form-group
                label-cols-sm="5"
                label-cols-lg="5"
                label="Has Mask?"
                label-for="mask"
                class="align-items-center input-wrapper"
              >
                <b-form-checkbox
                  class="success"
                  switch
                  size="lg"
                  v-model="mask_check"
                ></b-form-checkbox>
              </b-form-group>
            </div>
          </tab-content>
          <!-- Step 2  -->
          <tab-content
            v-for="(el, i) in complinaces"
            :key="i"
            icon="mdi mdi-account-details-outline"
            :before-change="() => beforeTabOneSwitch(el)"
          >
            <ComplianceForm :element="el" :index="i" />
            <span
              v-if="submitted != null && !submitted"
              style="color: #8b0000; font-size: 0.9rem"
              >* Please answer the following questions!
            </span>
          </tab-content>
          <!-- Step 3  -->
          <tab-content
            v-if="vaccine_pcr.flow_has_vaccien"
            icon="mdi mdi-account-check-outline"
          >
            <div class="scan-wrapper py-2">
              <DocumentForm
                :vaccine_pcr="vaccine_pcr"
                :submitted="submitted"
                :validation="$v"
                :default_walk_in="default_walk_in"
              />
            </div>
          </tab-content>
          <button class="btn btn-outline-primary px-5" slot="prev">Back</button>
          <button class="btn btn-primary px-5" slot="next">Next</button>
          <b-button
            class="w-lg"
            :disabled="getLoadingStatus"
            variant="primary"
            slot="finish"
          >
            <i
              v-if="getLoadingStatus"
              class="bx bx-hourglass bx-spin font-size-16 align-middle mr-2"
            ></i>
            {{ getStatusForArea && getStatusForArea.signedOut ? "Check-in" : "Sign out" }}
          </b-button>
        </form-wizard>

        <button
          v-if="getStatusForArea && !getStatusForArea.signedOut && !getLoader"
          class="btn btn-primary px-5"
          style="float: right"
          @click="onSubmit"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dashboard-action-wrapper {
  .input-label {
    width: 300px;
  }
  .input-wrapper {
    border-bottom: 0.5px solid #dddbda;
    padding-bottom: 2%;
  }
  .compliance-wizred {
    border: 1px solid #dddbda;
  }
  .title-text {
    color: #bbb8b8;
  }
  @media only screen and (max-width: 700px) {
    font-size: 0.6rem !important;
  }
}
</style>

<style lang="scss">
.hideBorder {
  .compliance-wizred.mt-1 {
    border: none !important;
  }
}
</style>
