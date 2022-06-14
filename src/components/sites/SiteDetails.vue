<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UpdateActionForm",
  data() {
    return {
      type: null,
      data: null,
      areaJourney: null,
    };
  },
  methods: {
    ...mapActions("journey", ["fetchJourneyList"]),
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("journey", ["getJourneyList"]),
  },
  beforeMount() {
    this.type = this.getModalInfo.type;
    this.data = this.getModalInfo.data;
    // set area journey
    this.type == "area" && this.fetchJourneyList();
  },
  mounted() {
    this.type == "area" &&
      this.getJourneyList &&
      this.getJourneyList.length > 0 &&
      this.getJourneyList.map(journey => {
        journey.id == this.data.journey_id ? (this.areaJourney = journey) : "";
      });
  },
};
</script>

<template>
  <div class="site-details-wrapper">
    <div class="header">
      <h5 class="modal-title mb-4">
        {{
          type == "site"
            ? "Site Details"
            : type == "area"
            ? "Area Details"
            : "Kiosk Details"
        }}
      </h5>
    </div>
    <div class="form-groups">
      <!-- site email  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'site'">
        <label
          for="reception_email"
          class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Reception email:</label
        >
        <span id="reception_email">{{ this.data.reception_email }}</span>
      </div>
      <!-- site timezone  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'site'">
        <label for="timezone" class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Timezone:</label
        >
        <span id="timezone">{{ this.data.timezone }}</span>
      </div>
      <!-- area desc  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'area'">
        <label for="description" class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Description:</label
        >
        <span id="description">{{ this.data.description }}</span>
      </div>
      <!-- area journey  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'area'">
        <label for="journey" class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Journey:</label
        >
        <span id="journey">{{ this.areaJourney && this.areaJourney.name }}</span>
      </div>
      <!-- kiosk mac_address  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'kiosk'">
        <label for="mac_address" class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Mac address:</label
        >
        <span id="mac_address">{{ this.data.mac_address }}</span>
      </div>
            <!-- kiosk serial_number  -->
      <div class="input-box mb-3 d-flex align-items-center" v-if="type == 'kiosk'">
        <label for="serial_number" class="mb-0 font-weight-normal no-wrap input-label mr-2"
          >Serial number:</label
        >
        <span id="serial_number">{{ this.data.serial_number }}</span>
      </div>

    </div>
    <div class="d-flex justify-content-end align-items-center">
      <button class="btn btn-primary px-3" @click="$bvModal.hide('siteDetails')">
        Close
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.site-details-wrapper {
  .header {
    background-color: #f8f8fb;
    padding: 1% 0px;
    margin-bottom: 5%;
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
    width: 130px;
  }
}
</style>
