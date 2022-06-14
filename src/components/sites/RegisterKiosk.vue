<script>
import { mapGetters } from "vuex";
export default {
  name: "RegisterKiosk",
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_URL,
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("registerKiosk");
    },
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <section class="container">
      <div class="header d-flex align-items-start justify-content-between">
        <div class="info">
          <h4 class="text-dark">Kiosk Registeration</h4>
          <p>To register offline kiosks please follow the steps below</p>
        </div>
        <div class="logo-wrapper d-flex justify-content-end">
          <img
            src="@/assets/images/logo-lg.svg"
            alt
            class="img-fluid unselectable"
            draggable="false"
            width="50%"
          />
        </div>
      </div>
      <div class="body text-center mt-2 py-1 border">
        <h5 class="mb-4">Scan this QR code on the kiosk</h5>
        <vue-qrcode
          class="mb-2"
          :value="getModalInfo && getModalInfo.qr"
          :options="{ width: 150 }"
        ></vue-qrcode>
        <p class="h4 mb-3">or</p>
        <b-button
          class="w-lg mb-3"
          variant="outline-primary"
          pill
          :href="`${baseURL}${getModalInfo && getModalInfo.file}`"
          target="_blank"
        >
          Download
        </b-button>
        <h5 class="mb-3">
          Registration file via USB to then upload onto kiosk
        </h5>
        <p class="mb-3 text-muted">
          The above has been sent to the user email address provided and is also
          available in the Offline Registration page at the top of your
          dashboard
        </p>
      </div>
    </section>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-primary px-3 mr-2"
        @click="$bvModal.hide('registerKiosk')"
      >
        ok
      </button>
    </div>
  </div>
</template>

