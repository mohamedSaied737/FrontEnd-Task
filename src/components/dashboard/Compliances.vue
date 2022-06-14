<script>
import { mapGetters } from "vuex";
import ComplianceForm from "./ComplianceForm";

export default {
  name: "UpdateActionForm",
  components: { ComplianceForm },
  data() {
    return {
      data: null,
      complinaces: [],
      complinaceItems:[],
    };
  },
  computed: {
    ...mapGetters("modal", ["getModalInfo"]),
  },
  beforeMount() {
    const convertComplinaces = JSON.parse(JSON.stringify(this.getModalInfo));
    this.complinaces =
      convertComplinaces.length > 0
        ? convertComplinaces.map(complinance => {
            let pivot = JSON.parse(complinance.pivot.form_metadata);
            return {
              name: complinance.name,
              id: complinance.id,
              answer: complinance.form_metadata.data,
              pivot:pivot
            };
          })
        : [];
  },
};
</script>

<template>
  <div class="site-details-wrapper">
        <p class="text-secondary mb-3">
          Compliance Details
        </p>
    <div v-for="(el, i) in complinaces" :key="i">
      <ComplianceForm :element="el" :index="i" />
    </div>
    <div class="d-flex justify-content-end align-items-center">
      <button
        class="btn btn-primary px-3"
        @click="$bvModal.hide('dashboardCompliances')"
      >
        Close
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.site-details-wrapper {
  .header {
    background-color: #f8f8fb;
    padding: 1% 0px;
    margin-bottom: 5%;
  }
  .form-groups {
    padding-bottom: 1%;
  }
  .modal-title {
    text-align: center;
    font-size: 19px;
    font-weight: 700;
  }
  .input-label {
    width: 130px;
  }
}
</style>
