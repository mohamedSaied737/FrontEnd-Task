<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  name: "UpdateActionForm",
  components: { Multiselect },
  data() {
    return {
      siteInfoLength: null,
      journey: null,
      site: null,
      area: null,
      areaId: null,
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
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders"]),
    disableBtn() {
      return (this.site && this.area)  ? false : true;
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("moveArea");
    },
    site(site) {
      console.log('site', this.areaId);
      this.fetchAreasBySiteWithoutSignOut({ area_id: this.areaId, site_id: site.id });
    },
    getAreas(areas){
      this.areaOptions = JSON.parse(JSON.stringify(areas));
      this.areaOptions.push({ id: null, name: "Assigned as parent" });
      this.areaOptions = this.areaOptions.filter(item => item.id !== this.areaId);
    },
  },
  methods: {
    ...mapActions("sites", [
      "moveArea",
      "fetchSites",
      "fetchAreasBySite",
      "fetchAreasBySiteWithoutSignOut"
    ]),
    onSubmit() {
      this.moveArea({
        id: this.areaId,
        params: {area:{
          site_id: this.site.id,
          parent_id: this.area.id,
        }},
      });
    },
  },
  beforeMount() {
    this.fetchSites();
      const { id, site_id } = this.getModalInfo;
      this.areaId = id;
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
    <p class="text-muted mb-3">Move Area</p>
    <div class="form-groups">
      <!-- site  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label=" Assigned Site"
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
        label=" Assigned Area"
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
        @click="$bvModal.hide('moveArea')"
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

