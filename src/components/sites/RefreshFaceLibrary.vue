<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RefreshFaceLibrary",
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
  },
  methods: {
    ...mapActions("daemon", ["refreshFaceLibrary"]),
    onSubmit() {
      this.refreshFaceLibrary(this.getModalInfo.mac_address);
      this.$bvModal.hide("refreshFaceLibrary");
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("refreshFaceLibrary");
    },
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-muted mb-3">Refresh Face Library</p>
    <div class="card task-box">
      <div class="card-body">
        <h3>Are you sure you want to refresh face library?</h3>

        <div class="d-flex justify-content-end align-items-center mt-4">
          <button
            class="btn btn-outline-secondary px-3 mr-2"
            @click="$bvModal.hide('refreshFaceLibrary')"
          >
            Cancel
          </button>
          <button
            class="submit-btn btn btn-primary px-4"
            size="md"
            @click="onSubmit"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
