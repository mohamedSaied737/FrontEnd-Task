<template>
  <!-- multiple selection dropdown  -->
  <b-dropdown size="sm" variant="primary" v-if="selectType">
    <template v-slot:button-content>
      Actions For Selection
      <i class="mdi mdi-chevron-down"></i>
    </template>
    <b-dropdown-item v-b-modal="'deleteUserTypeNow'" @click="setActionData()"
      >Bulk Delete All Data & Scans
      </b-dropdown-item>
  </b-dropdown>
  <!-- single selection dropdown  -->
  <b-dropdown
    v-else
    size="sm"
    variant="outline-secondary"
    class="action-dropdown border text-primary"
  >
    <template v-slot:button-content>
      Available Actions
      <i class="mdi mdi-chevron-down text-secondary"></i>
    </template>
    <b-dropdown-item v-b-modal="'editData&Scans'" @click="setEditData()"
      >Edit
    </b-dropdown-item>
    <b-dropdown-item-button
      v-b-modal="'deleteUserTypeNow'"
      @click="setActionData()"
    >
      Bulk Delete All Scans & Data
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ActionsUserTypePrivicyManager",
  props: ["data", "selectType", "dataRetention", "scansRetention"],
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    setActionData() {
      this.setData({
        from:'action',
        params: {
          name:this.data.name,
          beforeDate: null,
          type: "both",
          userTypeIds: this.selectType ? this.data : [this.data.id],
          entity_id: this.currentEntity.id,
        },
      });
    },
    setEditData() {
      this.setData({
          dataRetention: this.dataRetention,
          scansRetention: this.scansRetention,
          data:this.data,
      });
    },
  },
};
</script>
