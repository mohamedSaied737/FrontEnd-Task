<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  name: "ChangeJourney",
  components: { Multiselect },
  data() {
    return {
      filteredJourneyList: [],
      inherit: false,
      journey_id: "",
      site: null,
      area: null,
      submitted: false,
      action: null,
      sites: [],
      areas: [],
    };
  },
  validations: {
    form: {
      area: {
        name: { required },
        site_id: { required },
      },
    },
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("sites", ["getLoading", "getSites", "getAreas"]),
    ...mapGetters("kiosks", ["getLoading"]),
    ...mapGetters("journey", ["getJourneyList"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("changeJourney");
    },
    inherit(inherit) {
      this.journey_id = inherit ? "" : this.journey_id;
    },
  },
  methods: {
    ...mapActions("journey", ["fetchJourneyList", "changeJourney"]),
    requestAreas() {
      this.fetchJourneyList();
    },
    onSubmit() {
      this.submitted = true;
      if(!this.inherit && !this.journey_id) {
        return;
      }
      console.log(this.getModalInfo);
      this.changeJourney({
          kiosk_id: this.getModalInfo.id,
          journey_id: this.journey_id ? this.journey_id : this.getModalInfo.area.journey_id,
          area_id: this.getModalInfo.area_id,
      });
      this.$bvModal.hide('changeJourney');
    },
  },
  beforeMount() {
    this.fetchJourneyList();
    console.log("data", this.getModalInfo);
    console.log('getJourneyList', this.getJourneyList);
    this.getJourneyList.map(item => {
      if (item.id !== this.getModalInfo.area.journey_id)
      this.filteredJourneyList.push(item);
    });
    console.log('this.filteredJourneyList', this.filteredJourneyList);
    this.inherit = this.getModalInfo.is_inherit;
    this.journey_id = !this.inherit ? this.getModalInfo.journey_id : "";
  },
};
</script>

<template>
  <div>
    <div class="modalHeader">
            <h4 class="modal-title">
              <slot name="modal-title"> Change Journey </slot>
            </h4>
          </div>
    <b-form-group>
      <b-form-checkbox name="check-button" v-model="inherit"
        >Inherit journey from the assigned area</b-form-checkbox
      >
    </b-form-group>
    <!-- journey  -->
    <b-form-group
      v-if="!inherit"
      label-cols-sm="4"
      label-cols-lg="3"
      id="journey"
      label="Journey"
      label-for="journey"
    >
      <multiselect
        id="journey"
        v-model="journey_id"
        placeholder="Select Journey"
        :show-labels="false"
        :options="filteredJourneyList.map((story) => story.id)"
        :custom-label="(opt) => filteredJourneyList.find((x) => x.id == opt).name"
        :allowEmpty="true"
        @open="requestAreas"
        :class="{ 'invalid-input': submitted && !inherit && !journey_id }"
      />
    </b-form-group>
    <!-- action btns  -->
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-color px-3 mr-2"
        @click="$bvModal.hide('changeJourney')"
      >
        Cancel
      </button>
      <button
        class="submit-btn btn btn-primary px-4"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
      >
        
        Confirm
      </button>
    </div>
  </div>
</template>
<style lang="scss">
div#changeJourney___BV_modal_content_{
  // width:579px!important;
  // height: 275.38px!important;
  h4.modal-title{
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    color: #888b9d;
    text-align: left;
    margin-bottom: 35px!important;
  }
  .btn-color{
    border:solid 1px #888b9d!important;
    color:#888b9d!important;
  }
  .modal-buttonSize{
    width: 111.69px!important;
    height: 33.26;
    margin-top: 20px!important;
    margin-bottom: 19.75px!important;
  }
}


</style>