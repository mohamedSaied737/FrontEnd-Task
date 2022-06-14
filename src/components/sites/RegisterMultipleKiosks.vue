<script>
import { mapGetters } from "vuex";
import JsPDF from "jspdf";

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
      state && this.$bvModal.hide("registerMultiKiosks");
    },
  },
  methods: {
    downloadMultiFiles(e) {
      e.preventDefault();
      const { getModalInfo, baseURL } = this;
      getModalInfo &&
        getModalInfo.length > 0 &&
        getModalInfo.map((kiosk) => {
          return window.open(`${baseURL}${kiosk.Kiosk.file}`);
        });
    },
    downloadQRPdf() {
      const doc = new JsPDF("p", "pt", "A4");
      const contentHtml = this.$refs.testHtml;
      doc.html(contentHtml, {
        callback: function (doc) {
          doc.save("QRcode.pdf");
        },
      });
    },
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <section class="container">
      <div class="header d-flex align-items-start justify-content-between">
        <div class="info">
          <h4 class="text-dark no-wrap">Mutliple Kiosk Registeration</h4>
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
      <section class="d-none" v-if="getModalInfo.length > 0">
        <div class="text-center" ref="testHtml">
          <div
            class="pl-5 mt-1 mx-auto"
            v-for="kiosk in getModalInfo"
            :key="kiosk.id"
            style="height: 850px"
          >
            <h3 class="text-primary no-wrap text-center">
              Kiosk Name : {{ kiosk.Kiosk.name }}
            </h3>
            <div class="qr-wrapper border-bottom">
              <vue-qrcode
                :value="kiosk.Kiosk.qr"
                :options="{ width: 180 }"
              ></vue-qrcode>
            </div>
          </div>
        </div>
      </section>
      <div class="body text-center mt-3 py-4 border">
        <h5 class="mb-4">Download QR for Multiple Kiosks</h5>
        <b-button
          @click="downloadQRPdf"
          class="w-lg mb-2"
          variant="primary"
          pill
          target="_blank"
        >
          Download PDF
        </b-button>
        <h5 class="mb-4 mt-5">Download multiple kiosks files</h5>
        <b-button
          class="w-lg mb-3"
          variant="outline-primary"
          pill
          @click="downloadMultiFiles"
          target="_blank"
          download
        >
          Download Files
        </b-button>
      </div>
    </section>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-primary px-3 mr-2"
        @click="$bvModal.hide('registerMultiKiosks')"
      >
        ok
      </button>
    </div>
  </div>
</template>