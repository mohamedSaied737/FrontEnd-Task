<script>
import { mapActions, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "UserMerge",
  components: { Multiselect },
  data() {
    return {
      id: null,
      reason: null,
      user: null,
      userOptins: [],
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("users", ["getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("userMerge");
    },
  },
  methods: {
    ...mapActions("users", [
      "mergeDuplicatedUser",
      "generateFaceIDforDuplicatedUser",
    ]),
    onSubmit() {
      const params = {
        user_id: this.reason == 4 ? this.id : (this.user && this.user.id),
        reason: this.reason,
        entity_id: this.currentEntity.id,
      };
      this.reason == 4
        ? this.generateFaceIDforDuplicatedUser(params)
        : this.mergeDuplicatedUser(params);
    },
  },
  beforeMount() {
    this.id = this.getModalInfo.id;
    this.reason = this.getModalInfo.reason;
    let parentUser = {
      id: this.getModalInfo.id,
      name: `${this.getModalInfo.first_name} ${this.getModalInfo.last_name}`,
    };
    this.userOptins.push(parentUser); // push parent user
    this.getModalInfo.children &&
      this.getModalInfo.children.length > 0 &&
      this.getModalInfo.children.map((user) => {
        this.userOptins.push({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
        }); // push nested user
      });
  },
};
</script>

<template>
  <div class="update-user-type-wrapper">
    <p class="text-secondary mb-3">Duplication Control</p>
    <p v-if="reason == 4" class="font-weight-normal text-center mb-0">
      Are You Sure You Want to Generate Face ID For this User ?
    </p>
    <!-- select user  -->
    <div v-else class="user-select">
      <label class="text-muted label" for="user"
        >Select The User You Want to Merge on him</label
      >
      <multiselect
        id="user"
        v-model="user"
        :options="userOptins"
        placeholder="Select User"
        :show-labels="false"
        label="name"
        :allowEmpty="true"
      />
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-outline-secondary px-3 mr-2"
        @click="$bvModal.hide('userMerge')"
      >
        Cancel
      </button>
      <button
        :disabled="getLoading || (reason != 4 && !user)"
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
.label {
  font-size: 0.8rem;
  font-weight: normal;
}
</style>
