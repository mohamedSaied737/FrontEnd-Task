<template>
  <Layout>
    <section class="container pt-5 px-4">
      <div class="header d-flex align-items-center justify-content-between">
        <div class="info">
          {{getKioskData.file}}
          <h4 class="text-dark">Kiosk Registeration</h4>
          <p>To register offline kiosks please follow the steps below</p>
        </div>
        <div class="logo-wrapper d-flex justify-content-end">
          <img
            src="@/assets/images/logo-lg.svg"
            alt
            class="img-fluid unselectable"
            draggable="false"
            width="60%"
          />
        </div>
      </div>
      <div class="body text-center mt-5 py-1">
        <h4 class="mb-4">Scan this QR code on the kiosk</h4>
        <vue-qrcode
          class="mb-4"
          :value="getKioskData.qr"
          :options="{ width: 150 }"
        ></vue-qrcode>
        <p class="h4 mb-5">or</p>
        <b-button 
        class="w-lg mb-5"
        variant="outline-primary" 
        pill 
        
        :href='getKioskData.file'
        target="_blank"
        >
          Download
        </b-button>
        <h4 class="mb-4">Registration file via USB to then upload onto kiosk</h4>
        <p class="mb-4">
          The above has been sent to the user email address provided and is also
          available in the Offline Registration page at the top of your
          dashboard
        </p>
        <b-button 
        class="w-sm"
        variant="primary" 
        pill 
        >
          ok
        </b-button>
      </div>
    </section>
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex';
import Layout from "../../layouts/auth";
export default {
  name: "KioskRegisteration",
  data(){
    return {
      baseURL:process.env.VUE_APP_BASE_URL
    }
  },
  components: { Layout },
  computed:{
    ...mapGetters('authfack',['getKioskData'])
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  height: 100vh;
}

</style>

