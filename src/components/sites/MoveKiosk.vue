<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  name: "MoveKiosk",
  components: { Multiselect },
  data() {
    return {
      site: null,
      area: null,
      kioskId: null,
      selectedIds:null,
      areaOptions: [],
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
      update: false,
      action: null,
      hasParent: false,
      sites: [],
      areas: [],
      siteId: null,
      parentId: null,
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
    ...mapGetters("sites", ["getLoading","getSites","getAreas"]),
    ...mapGetters("kiosks", ["getLoading"]),
    disableBtn() {
      return (this.site && this.area)  ? false : true;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("moveKiosk");
    },
    site(site) {
      this.fetchAreasBySite(site.id);
    },
    getAreas(getAreas){
      const {getModalInfo} = this;
      const {area_id} = getModalInfo;
      this.areaOptions = getAreas.filter(item => item.id !== area_id);
    }
  },
  methods: {
    ...mapActions("sites", [
      "moveKiosk",
      "fetchSites",
      "fetchAreasBySite",
    ]),
    ...mapActions("grid", [
    "getSelectedRows",
    ]),
    ...mapActions("kiosks", ["moveKiosk","moveMultipleKiosks"]),
    onSubmit() {
      let singleKiosk = {
        id:this.kioskId,
        params: {kiosk:{
        area_id: this.area.id,
        }}
      };
      let multipleKiosks = {
          params: {kiosk:{
          area_id: this.area.id,
          kioskIds: this.selectedIds 
        }}
      };
      this.selectedIds
      ?
      this.moveMultipleKiosks(multipleKiosks)
      :
      this.moveKiosk(singleKiosk);
    },
  },
  beforeMount() {
    this.fetchSites();
    if(Array.isArray(this.getModalInfo)){
      this.selectedIds = this.getModalInfo.map((row) => row.id)
    }
      const { id, site_id } = this.getModalInfo;
      this.kioskId = id;
      // set site
      this.getSites.length > 0 &&
        this.getSites.map((site) => {
          site.id == site_id ? (this.site = site) : "";
        });
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-muted mb-3">Move Kiosk</p>
    <div class="form-groups">
      <!-- site  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label="Assigned Site"
        label-for="site"
      >
        <multiselect
          id="site"
          v-model="site"
          :options="getSites"
          placeholder="Select Site"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
        />
        <div v-if="submitted && !$v.form.area.site_id.required" class="invalid-feedback">
          Site is required.
        </div>
      </b-form-group>
      <!-- area  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label="Assigned Area"
        label-for="area"
      >
        <multiselect
          id="area"
          v-model="area"
          :options="areaOptions"
          placeholder="Select Area"
          :show-labels="false"
          label="name"
          :allowEmpty="true"
          :disabled="!site"
        />
      </b-form-group>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('moveKiosk')"
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
        Move
      </button>
    </div>
  </div>
</template>
