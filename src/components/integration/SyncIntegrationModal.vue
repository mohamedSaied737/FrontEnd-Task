<template>
  <div>
    <div class="sync-container" >
      <h6 class="mb-4">Sync Records</h6>
      <div class="d-block text-center mb-4">
        <p>
          Are you sure you want to<b> “Sync” </b>these records with your list?
        </p>
      </div>
      <hr class="mt-1" />
      <div class="action-btns">
        <button
          class="submit-btn btn btn-primary"
          :disabled="getLoading"
          @click="StartSync"
          size="md"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          <span>Sync</span>
        </button>
        <button @click="$bvModal.hide('syncIntegration')" class="btn btn-outline-danger cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
         isLoading: true,
    };
  },
  methods: {
    ...mapActions("integration", ["StartSyncUsers"]),
    StartSync(){
        this.StartSyncUsers({id: this.getIntegId, isFailed: false, redirect: true });
        this.$bvModal.hide("syncIntegration");
    }
  },
  computed: {
    ...mapGetters("integration", [
      "getLoading",
      "getIntegId",
      "getMigrateStatusText",
      "getMigrateStatusStage",
      "getMigrateStatusmsg",
      
    ]),
  },
  beforeMount() {},
};
</script>
<style lang="scss" scoped>
.sync-container {
  background-color: white;
  border-radius: 50px;
  h6 {
    font-size: 17px;
    font-weight: bold;
  }
  p {
    color: #787878;
    font-size: 18px;
  }
  .action-btns .submit-btn {
    margin-right: 30px;
  }
}
</style>
