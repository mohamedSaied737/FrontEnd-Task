<template>
  <section class="d-flex align-items-center">
    <div class="edit-action">
      <date-picker
        class="datepicker-size-sm"
        v-model="date"
        value-type="format"
        format="YYYY-MM-DD"
        type="date"
        placeholder="Select Date"
      ></date-picker>
    </div>
    <div
      class="delete-action mx-2 d-flex align-items-center"
      v-b-modal="date && 'deleteUserTypeNow'"
      @click="date && setModalData()"
    >
      <i class="mdi mdi-delete-forever-outline trash-icon"></i>
      <span
        class="delete-text text-uppercase mx-1 no-wrap"
        :class="date ? 'text-primary' : 'text-muted'"
        >Delete Now</span
      >
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DatePicker from "vue2-datepicker";

export default {
  name: "DatePickerCell",
  props: ["data", "type"],
  components: { DatePicker },
  data() {
    return {
      date: null,
    };
  },
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    setModalData() {
      this.setData({
        params: {
          name:this.data.name,
          beforeDate: this.date,
          type: this.type,
          userTypeIds: [this.data.id],
          entity_id: this.currentEntity.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" >
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
</style>