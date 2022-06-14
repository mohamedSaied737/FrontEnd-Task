<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "UpdateActionForm",
  components: { Multiselect },
  data() {
    return {
      id: null,
      selectedParent: null,
      entity_id: null,
      parent_id: null,
      selecedIds: null,
      parentName: null,
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("userType", [
      "getParentsList",
      "getModalState",
      "getLoading",
    ]),
  },
  watch:{
    getModalState(state) {
      state && this.$bvModal.hide("moveUserTypes");
    },
  },
  methods: {
    ...mapActions("userType", ["moveUserType", "fetchParentsList"]),
    onSubmit() {
      this.moveUserType({
        parentId: this.selectedParent.id,
        userTypeIds: this.getModalInfo.length > 1 ?  [...new Set(this.selecedIds)]  : [this.id],
      });
      this.getModalState && this.$bvModal.hide("moveUserTypes");
    },

  },
  beforeMount() {
    this.fetchParentsList();
    if (Array.isArray(this.getModalInfo)) {
      this.parent_id = this.getModalInfo[0].parent_id;
      this.entity_id = this.getModalInfo[0].entity_id;
      this.selecedIds = this.getModalInfo.map((row) => row.id);
    } else {
    const { id, entity_id, parent_id, parent_name } = this.getModalInfo;
    this.id = id;
    this.entity_id = entity_id;
    this.parent_id = parent_id;
    this.parentName = parent_name;
    }
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-secondary mb-3">Move User Type</p>
    <div class="form-groups">
      <p class="font-weight-normal" v-if="!Array.isArray(this.getModalInfo)">
        Currnet Parent is :
        <span class="text-primary ml-4">{{ parentName&&parentName }}</span>
      </p>
      <!-- name   -->
      <div class="input-box mb-3 d-flex align-items-center pb-5 mb-5">
        <label for="parent" class="mb-0 no-wrap input-label mr-5"
          >Select Parent :</label
        >
        <multiselect
          id="parent"
          v-model="selectedParent"
          label="name"
          :options="getParentsList"
          placeholder="select parent you want to move to.."
          :show-labels="false"
        />
      </div>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-5">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('moveUserTypes')"
      >
        Cancel
      </button>
      <button
        :disabled="!selectedParent || getLoading"
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
  .header {
    background-color: #f8f8fb;
    padding: 1.5% 0px;
    margin-bottom: 1%;
  }
  .modal-title {
    text-align: center;
    font-size: 19px;
  }
  .input-label {
    width: 130px;
  }
}
</style>
