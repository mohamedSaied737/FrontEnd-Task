<template>
  <div>
    <b-dropdown
      size="sm"
      variant="outline-secondary"
      class="action-dropdown border text-primary"
    >
      <template v-slot:button-content class="action-text">
        Available Actions
        <i class="mdi mdi-chevron-down text-secondary"></i>
      </template>
      <b-dropdown-item-button
        v-if="type =='parent'"
        v-b-modal="'userMerge'"
        @click="setUserData(data)"
      >
        {{ data.reason == 4 ? "Generate FaceID" : "Merge" }}
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="$router.push(`/users?id=${data.id}`)">
        Edit User
      </b-dropdown-item-button>
      <b-dropdown-item-button>Ignore</b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "UsersDuplicatedActions",
  props: ["data","type"],
  methods: {
    ...mapActions("modal", ["setData"]),
    sendDataToModal(data) {
      this.status == "Active"
        ? this.setData(data)
        : this.$toast.error(
            "Check in can only be performed on activated users!",
            {
              position: "top-right",
            }
          );
    },
    setUserData(data) {
      this.setData(data);
    },
  },
};
</script>
