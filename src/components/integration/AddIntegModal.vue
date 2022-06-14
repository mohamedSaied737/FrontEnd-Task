<template>
  <div class="wrapper">
    <p class="title">New Integration for {{ getModalInfo.name }}</p>
    <div class="content main-error">
      <div v-for="(error, index) in getResponseErrors" :key="index">
        <div class="generalErr" v-if="error.general_error && submitted">
          <span class="error-value">{{ error.message }}</span>
        </div>
      </div>
      <div v-for="(el, index) in dir_array" :key="index">
        <InputSettings
          :element="el"
          :index="index"
          :submitted="submitted"
          :errors="getResponseErrors"
        />
      </div>
    </div>
    <!-- action btns  -->
    <hr class="h-line" />
    <div class="action-btns">
      <button
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
        v-if="!getReAuth"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span>Add</span>
      </button>

      <button
        class="submit-btn btn btn-primary"
        size="md"
        @click="onSubmit"
        :disabled="getLoading"
        v-if="getReAuth"
        style="width: 138px"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        <span>Authenticate</span>
      </button>

      <button
        class="btn btn-outline-danger"
        @click="$bvModal.hide('addIntegration')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import InputSettings from "./InputSettings";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    InputSettings,
  },
  data: function () {
    return {
      submitted: false,
      apiObjec: [],
      dir_array: [],
      errors: {},
      requiredErro: false,
      configData: [],
    };
  },

  methods: {
    ...mapActions("integration", [
      "createIntegration",
      "reAuthIntegration",
      "createConfigData",
    ]),
    onSubmit() {
      this.submitted = true;
      for (var index = 0; index < this.dir_array.length; index++) {
        if (!this.dir_array[index].value) {
          this.requiredErro = true;
        } else {
          this.requiredErro = false;
        }
      }
      if (!this.requiredErro) {
        const obj = {};
        this.apiObjec = this.dir_array.map((item) => {
          obj[item.key_code] = item.value;
        });
        this.getReAuth
          ? this.reAuthIntegration({
              directory_type: this.getModalInfo.code,
              obj,
              integId: this.getIntegId,
            })
          : this.createIntegration({
              directory_type: this.getModalInfo.code,
              obj,
            });
      }
      this.configData = this.dir_array.map((item) => {
        return {
          key_id: item.id,
          value: item.value,
          Key_code: item.key_code,
        };
      });
      this.createConfigData(this.configData);
    },
  },
  // watch: {
  //   getModalState(state) {
  //     console.log('watch', state);
  //     state && this.$bvModal.hide("addIntegration");
  //   },
  // },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
    ...mapGetters("integration", [
      "getLoading",
      "getModalState",
      "getResponseErrors",
      "getReAuth",
      "getIntegId",
    ]),
    getModalState() {
      console.log("computed", this.getModalState);
      return false;
      // return state && this.$bvModal.hide("addIntegration")
    },
  },
  mounted() {},
  beforeMount() {
    const { dir_keys } = this.getModalInfo;
    this.dir_array = dir_keys.map((item) => {
      return {
        key_code: item.key_code,
        value: null,
        name: item.key_name,
        id: item.id,
      };
    });
  },
};
</script>
<style lang="scss" scoped>
.generalErr {
  .error-value {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700 !important;
    font-size: 14px !important;
    line-height: 19px !important;
    text-align: center !important;
    letter-spacing: 0.25px !important;
    color: #f46a6a !important;
  }
}
.wrapper {
  .title {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;

    color: #000000;
  }
  .content {
    .err-wrapper {
      padding-left: 20px;

      div {
        margin-bottom: 1rem;
      }
    }
    // .main-error{
    //   font-family: 'Lato';
    // font-style: normal;
    // font-weight: 700;
    // font-size: 14px;
    // line-height: 19px;
    // text-align: center;
    // letter-spacing: 0.25px;
    // }
  }
}

.generalErr {
  width: 360px;
  height: 38px;
  margin-bottom: 38px;
  // margin-left: 20%;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.25px;
  color: #f46a6a;
}
</style>
