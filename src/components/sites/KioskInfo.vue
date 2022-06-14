<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "KioskInfo",
  data() {
    return {
      macAddress: "",
      loading: true,
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("daemon", ["getLoading", "getKioskInfo"]),
  },
  methods: {
    ...mapActions("daemon", ["fetchKioskInfo"])
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("kioskInfo");
    },
  },
  beforeMount() {
    this.macAddress = this.getModalInfo.mac_address;
    this.fetchKioskInfo(this.macAddress);
    this.loading = false;
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-muted mb-3">Kiosk Info</p>
    <div class="card task-box">
      <div class="card-body">
        <b-form-group
          class="align-items-center text-muted h5 no-wrap"
          label-cols-sm="3"
          label-cols-lg="2"
          v-for="(value, key) in getKioskInfo"
          :key="key"
          :label="key+': '"
          :label-for="key"
        >
          <h5 :id="key" class="text-primary mb-0 no-wrap">
            {{ value }}
          </h5>
        </b-form-group>
        <h5 v-if="Object.keys(getKioskInfo).length == 0 && !loading" class="text-primary mb-0 no-wrap">No Info Found</h5>
        <h5 v-if="loading" class="text-primary mb-0 no-wrap">Loading...</h5>
      </div>
    </div>
  </div>
</template>
