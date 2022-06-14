<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "UpdateApp",
  components: { Multiselect },
  data() {
    return {
      selectedVersion: '',
      macAddress: '',
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("daemon", ["getLoading", "getAppVersions"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("updateApp");
    }
  },
  methods: {
    ...mapActions("daemon", ["updateApp", "fetchAppVersions"]),
    ...mapActions("grid", ["getSelectedRows",]),
    onSubmit() {
      this.updateApp({ macAddress: this.macAddress, version: this.selectedVersion.name })
        .then(() => this.$bvModal.hide("updateApp"))
        .catch(() => this.$bvModal.hide("updateApp"))      
    },
  },
  beforeMount() {
    this.macAddress = this.getModalInfo.mac_address
    this.fetchAppVersions();
  }
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-muted mb-3">Update App</p>
    <div class="form-groups">
      <!-- site  -->
      <b-form-group
        label-cols-sm="4"
        label-cols-lg="3"
        id="name-group"
        label="App Versions"
        label-for="selectedVersion"
      >
        <multiselect
          id="selectedVersion"
          v-model="selectedVersion"
          :options="getAppVersions"
          placeholder="Select Version"
          :show-labels="true"
          label="name"
        />
      </b-form-group>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('updateApp')"
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
        Update App
      </button>
    </div>
  </div>
</template>
