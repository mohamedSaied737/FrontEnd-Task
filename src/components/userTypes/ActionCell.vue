<template>
  <!-- multiple selection dropdown  -->
  <b-dropdown size="sm" variant="primary" v-if="type">
    <template v-slot:button-content>
      Actions for selections
      <i class="mdi mdi-chevron-down"></i>
    </template>
    <b-dropdown-item v-b-modal="'moveUserTypes'" @click="setActionData(data)"
      >Move</b-dropdown-item
    >
    <b-dropdown-item @click="deleteModal">Delete</b-dropdown-item>
  </b-dropdown>
  <!-- single selection dropdown  -->
  <b-dropdown
  size="sm"
    v-else
    variant="outline-secondary"
    class="action-dropdown border text-primary"
  >
    <template v-slot:button-content>
      Available Actions
      <i class="mdi mdi-chevron-down text-secondary"></i>
    </template>
    <b-dropdown-item-button
      v-b-modal="'updateUserTypes'"
      @click="setActionData(data)"
    >
      Edit
    </b-dropdown-item-button>
    <b-dropdown-item-button
      v-if="data.parent_id"
      v-b-modal="'moveUserTypes'"
      @click="setActionData(data)"
    >
      Move
    </b-dropdown-item-button>
    <b-dropdown-item-button v-if="data.can_delete" @click="deleteModal">
      Delete
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ActionsUserType",
  props: ["data", "type"],
  methods: {
    ...mapActions("userType", ["deleteUserType"]),
    ...mapActions("modal", ["setData"]),
    setActionData(data) {
      this.setData(data);
    },
    // update
    deleteModal() {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete ${
            this.data.length > 1 ? "all selection" : this.data.name
          }?`,
          {
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            okTitle: "Confirm",
            cancelVariant: "outline-secondary",
            centered: true,
          }
        )
        .then((proceed) => {
          proceed &&
            this.deleteUserType(
                 { userTypeIds: this.data.length > 1 ?  [...new Set(this.data.map((row) => row.id))] : [this.data.id] }
            );
        });
    },
  },
};
</script>
