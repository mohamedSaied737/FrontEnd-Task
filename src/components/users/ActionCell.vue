<template>
  <div>
    <!-- multiple  -->
    <b-dropdown size="sm" variant="primary" v-if="type">
      <template v-slot:button-content>
        Actions for selections
        <i class="mdi mdi-chevron-down"></i>
      </template>
      <b-dropdown-item-button @click="setUserData(data)">
        Change User Type for Selections
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="deactivateSelections">
        Deactivate Selections
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="activateSelections">
        Activate Selections
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="false"
        v-b-modal="'passportAction'"
        @click="saveUserDataAndType(data, 'invite')"
      >
        Invite Selections
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="false"
        v-b-modal="'passportAction'"
        @click="saveUserDataAndType(data, 'revoke')"
      >
        Revoke Selections
      </b-dropdown-item-button>
    </b-dropdown>
    <b-dropdown
      v-else
      size="sm"
      variant="outline-secondary"
      class="action-dropdown border text-primary"
    >
      <template v-slot:button-content class="action-text">
        Available Actions
        <i class="mdi mdi-chevron-down text-secondary"></i>
      </template>
      <b-dropdown-item-button
        v-if="
          getDocuments.length > 0 &&
          data.user_id != data.current_entity.entity_id
        "
        v-b-modal="'addDocument'"
        @click="setUserData(data)"
      >
        Add Document
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="data.user_id != data.current_entity.entity_id && !data.is_default_user"
        v-b-modal="'changeUserType'"
        @click="setUserData(data)"
      >
        Change User Type
      </b-dropdown-item-button>
      <b-dropdown-item-button
      v-if="data.user_id != data.current_entity.entity_id && checkIfAdmin && !data.is_default_user"
      v-b-modal="'userStatusToggle'"
      @click="setUserData(data)"
      >
        {{ status == "Active" ? "Deactivate User" : "Activate User" }}
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-b-modal="status == 'Active' && 'dashboardAction'"
        @click="sendDataToModal(data)"
      >
        Check in User
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-b-modal="'add-edit-user'"
        @click="setUserData(data)"
      >
        Edit
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="data.user_id != data.current_entity.entity_id && checkIfAdmin"
        @click="deleteModal"
      >
        Delete
      </b-dropdown-item-button>
      <b-dropdown-item-button
          v-if="data.id != loginUser &&(
          data.user_id != data.current_entity.entity_id &&
          data.current_entity &&
          (!data.current_entity.passport_id ||
            data.current_entity.is_revoked != 0 )
            && data.current_entity.is_active == 1
            )
        "
          v-b-modal="'passportAction'"
          @click="saveUserDataAndType(data, 'invite')"
      >
        Invite to Dashboard
      </b-dropdown-item-button>
      <b-dropdown-item-button
          v-if="data.id != loginUser &&(
          data.user_id != data.current_entity.entity_id &&
          data.user_id != loginUser &&
          data.current_entity &&
          data.current_entity.passport_id &&
          data.current_entity.is_revoked == 0)
          && data.current_entity.is_active == 1
        "
          v-b-modal="'passportAction'"
          @click="saveUserDataAndType(data, 'revoke')"
      >
        Revoke from Dashboard
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ActionsUserTypeRenderer",
  props: ["data", "status", "type"],
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("users", ["getDocuments"]),
    getOwnerId() {
      return this.currentEntity && this.currentEntity.owner_id;
    },
    userStatus() {
      return this.status == "Deactivated" ? "Active" : "Deactivate";
    },
    checkIfAdmin() {
      const userDetails = localStorage.getItem("userDetails");
      const loggedUserId = userDetails && JSON.parse(userDetails).id;
      return (
        this.data.id == loggedUserId
          ? loggedUserId
          : null || this.data.id == this.getOwnerId
          ? this.getOwnerId
          : null
      )
        ? false
        : true;
    },
    loginUser() {
      const userDetails = localStorage.getItem("userDetails");
      const loggedUserId = userDetails && JSON.parse(userDetails).user_id;
      return loggedUserId;
    },
  },
  methods: {
    ...mapActions("users", ["deleteUser", "denyUser"]),
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
      console.log('setData', data);
      this.setData(data);
    },
    saveUserDataAndType(data, type) {
      this.setData({
        data,
        type,
      });
    },
    deleteModal() {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete ${this.data.first_name} ${this.data.last_name} ?`,
          {
            title: "Confirmation",
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            cancelVariant: "outline-secondary",
            okTitle: "Confirm",
            headerClass: "p-2 border-bottom-0 h1",
            footerClass: "p-2 border-top-0",
            centered: true,
          }
        )
        .then((proceed) => {
          proceed && this.deleteUser(this.data.id);
        });
    },
    denyModal() {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to ${this.userStatus} ${this.data.first_name} ${this.data.last_name} ?`,
          {
            title: "Confirmation",
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            cancelVariant: "outline-secondary",
            okTitle: "Confirm",
            headerClass: "p-2 border-bottom-0 h1",
            footerClass: "p-2 border-top-0",
            centered: true,
          }
        )
        .then((proceed) => {
          proceed &&
            this.denyUser([
              {
                user_id: this.data.id,
                active: this.status == "Deactivated" ? 1 : 0,
              },
            ]);
        });
    },
    deactivateSelections() {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to Deactivate Selected Users ?`, {
          title: "Confirmation",
          size: "md",
          buttonSize: "md",
          okVariant: "primary",
          cancelVariant: "outline-secondary",
          okTitle: "Confirm",
          headerClass: "p-2 border-bottom-0 h1",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((proceed) => {
          proceed &&
            this.denyUser(
              Array.isArray(this.data) &&
                this.data.map((user) => {
                  return {
                    user_id: user.Data.id,
                    active: 0,
                  };
                })
            );
        });
    },
    activateSelections() {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to Deactivate Selected Users ?`, {
          title: "Confirmation",
          size: "md",
          buttonSize: "md",
          okVariant: "primary",
          cancelVariant: "outline-secondary",
          okTitle: "Confirm",
          headerClass: "p-2 border-bottom-0 h1",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((proceed) => {
          proceed &&
            this.denyUser(
              Array.isArray(this.data) &&
                this.data.map((user) => {
                  return {
                    user_id: user.Data.id,
                    active: 1,
                  };
                })
            );
        });
    },
  },
};
</script>
