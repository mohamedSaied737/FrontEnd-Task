<template>
  <section class="d-flex align-items-center">
      <span class="no-wrap border py-1 px-2 data-scan-value">{{ inputValue }} Days</span>
    <div
      class="delete-action mx-2 d-flex align-items-center"
      v-b-modal="'deleteUserTypeNow'"
      @click="setModalData()"
    >
      <i class="mdi mdi-delete-forever-outline trash-icon"></i>
      <span class="delete-text text-uppercase mx-1 text-primary no-wrap"
        >Delete</span
      >
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Cell",
  props: ["value", "data", "type"],
  data() {
    return {
      inputValue: this.value[0].value.toString(),
    };
  },
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("userType", ["getUserTypeList"]),
  },
  methods: {
    ...mapActions("privacyManager", ["editUserType", "deleteNowUserType"]),
    ...mapActions("userType", ["updateUserType"]),
    ...mapActions("modal", ["setData"]),
    setModalData() {
      this.setData({
        params: {
          beforeDate: null,
          type: this.type,
          userTypeIds: [this.data.id],
          entity_id: this.currentEntity.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.trash-icon {
  font-size: 1.3rem;
}
.delete-text {
  font-size: 13px;
  font-weight: 500;
  @media (min-width: 576px) {
    font-size: 8px;
  }
  @media (min-width: 768px) {
    font-size: 9px;
  }
  @media (min-width: 992px) {
    font-size: 11px;
  }
}
.delete-action {
  cursor: pointer;
}
.data-scan-value{
    cursor: text;
}
</style>
