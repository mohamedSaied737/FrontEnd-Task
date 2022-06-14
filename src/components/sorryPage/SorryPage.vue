<template>
  <div class="container">
    <!-- modal  -->
    <b-modal id="reactivePassportAccount" hide-footer hide-header size="lg">
      <ReactiveUser />
    </b-modal>
    <div class="content">
      <div class="header-icon">
        <div class="icon"><span>:(</span></div>
      </div>
      <p class="text-title">
        Sorry your dashboard access has been revoked
      </p>
      <p class="sub-title">
        You are not allowed to access this dashboard. For more information,
        please contact your system admin
      </p>
      <div class="action-wrapper">
        <button class="btn submit-btn" @click="onBackToPassport">
          <i class="mdi mdi-chevron-left icon"></i>
          <span>
            back to passport
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ReactiveUser from "../reactiveUser/ReactiveUser";

export default {
  components: { ReactiveUser },
  beforeMount() {
    this.resetState();
  },
  computed:{
        ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("passport", ["getPassportData"]),
  },
    watch: {
    getPassportData(data) {
      if (data && !data.active) {
        this.$bvModal.show("reactivePassportAccount");
      }
    },
  },
  methods: {
    ...mapActions("passport", ["checkPassportStatus", "resetState"]),
    onBackToPassport() {
      this.resetState();
      const passportId =
        JSON.parse(localStorage.getItem("userDetails")) &&
        JSON.parse(localStorage.getItem("userDetails")).passport_id;
      this.checkPassportStatus({ id: passportId });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .content {
    width: 661px;
    background-color: #fff;
    padding: 72px 56px 37px 56px;
    box-shadow: 0px 1px 40px 3px rgba(0, 0, 0, 0.05);
    border-radius: 26px;
    position: relative;
    text-align: center;
    .header-icon {
      position: absolute;
      top: -55px;
      left: 43%;
      .icon {
        height: 100px;
        width: 100px;
        line-height: 100px;
        color: #fff;
        background-color: rgba(16, 63, 94, 1);
        border-radius: 50%;
        text-align: center;
        position: relative;
        span {
          position: absolute;
          top: 47%;
          left: 47%;
          transform: translate(-50%, -50%);
          font-size: 3.8rem;
        }
      }
    }
    .text-title {
      font-weight: bold;
      font-size: 20px;
      color: #000000;
      margin-bottom: 23px;
    }
    .sub-title {
      font-weight: normal;
      font-size: 17px;
      margin-bottom: 46px;
      color: #787878;
    }
    .action-wrapper {
      display: flex;
      justify-content: center;
    }
    .submit-btn {
      background: #103f5e;
      border-radius: 22px;
      height: 44px;
      width: 415px;
      font-size: 16px;
      color: #fff;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        color: #fff;
        font-size: 30px;
        margin-right: 8px;
      }
    }
  }
}
</style>
