<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "ChangeUserType",
  components: { Multiselect },
  data() {
    return {
      id: null,
      selectedUserType: null,
      entity_id: null,
      user_type: null,
      selecedIds: null,
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("userType", ["getUserTypeList"]),
    ...mapGetters("users", ["getLoading"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("changeUserType");
    },
    selectedUserType(userTpye) {
      if (Array.isArray(this.getModalInfo)) {
        this.selecedIds = this.getModalInfo.map((user) => {
          return {
            user_id: user.Data.id,
            user_type_id: userTpye && userTpye.id,
          };
        });
      }
    },
  },
  methods: {
    ...mapActions("userType", ["fetchUserTypeList"]),
    ...mapActions("users", ["moveUser","resetLoading"]),
    onSubmit() {
      this.moveUser(
        Array.isArray(this.getModalInfo)
          ? [...new Set(this.selecedIds)]
          : [
              {
                user_id: this.id,
                user_type_id: this.selectedUserType && this.selectedUserType.id,
              },
            ]
      );
    },
  },
  beforeMount() {
    const {resetLoading,fetchUserTypeList,getModalInfo,} = this;
    resetLoading()
    fetchUserTypeList();
    if (!Array.isArray(getModalInfo)) {
      const { id, user_type } = getModalInfo;
      this.id = id;
      this.user_type = user_type;
    }
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <h5 class="text-secondary mb-3">Change User Type</h5>
    <div class="form-groups">
      <p class="font-weight-normal mb-3 border-bottom border-top py-3" v-if="!Array.isArray(this.getModalInfo)">
        Currnet Parent is :
        <span class="text-primary font-weight-bold ml-4">{{
          user_type && user_type.name
        }}</span>
      </p>
      <!-- name   -->
      <div class="input-box d-flex align-items-center">
        <label for="parent" class="mb-0 no-wrap input-label mr-5"
          >Select Parent :</label
        >
        <multiselect
          id="parent"
          v-model="selectedUserType"
          label="name"
          :options="getUserTypeList"
          placeholder="select parent you want to move to.."
          :show-labels="false"
        />
      </div>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-3">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('changeUserType')"
      >
        Cancel
      </button>
      <button
        :disabled="!selectedUserType || getLoading"
        class="submit-btn btn btn-primary px-4"
        size="md"
        @click="onSubmit"
      >
        <i
          v-if="getLoading"
          class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
        ></i>
        Confirm
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.update-user-type-wrapper {
  .input-label {
    width: 130px;
  }
}
</style>
