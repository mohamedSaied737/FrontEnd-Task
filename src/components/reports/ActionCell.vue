<template>
  <div>
    <!-- <a v-if="editAction.show" class="actions user-action-btn" title="Edit User Type" v-b-modal="'add-edit-user'" @click="sendDataToModal(data)"><i class="mdi mdi-square-edit-outline"></i></a>
    <a v-if="deleteAction.show && data.deletable == 'true'" class="actions" title="Delete User Type" href="#" @click="deleteModal"><i class="mdi mdi mdi-delete"></i></a>
    <a v-if="denyAction.show" class="actions" title="Deny User" href="#" @click="denyModal"><i class="mdi mdi-block-helper"></i></a> -->
    <!-- <i class="fas fa-user-times action-icon text-danger" @click="deleteModal"></i>
    <i class="fas action-icon mx-1" :class=" status=='Deactivate' ? 'fas fa-user-check text-success' : 'fa-user-alt-slash' " @click="denyModal"></i>
    <i class="fas fa-user-edit action-icon mx-1"></i>
    <i class="fas fa-user-cog action-icon text-primary"></i> -->
                  <b-dropdown size="sm" class="action-dropdown">
                  <template v-slot:button-content>
                    Available Actions
                    <i class="mdi mdi-chevron-down"></i>
                  </template>
                  <b-dropdown-item-button >
                    <span>Change User Type</span>
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="denyModal">
                    <span>Add to Deny List</span>
                  </b-dropdown-item-button>
                  <b-dropdown-item-button @click="deleteModal">
                    <span>Delete</span>
                  </b-dropdown-item-button>   
                  </b-dropdown>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ActionsUserTypeRenderer",
  props: ["data","status"],
  data: function() {
    return {
      editAction: {
        show: false,
        href: null,
      },
      deleteAction: {
        show: false,
      },
      denyAction: {
        show: false,
      },
    };
  },

  methods: {
    ...mapActions("users", ["deleteUser","denyUser"]),
    sendDataToModal(data) {
      this.$store.dispatch("modal/setData", data);
    },
    deleteModal() {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to delete ${this.data.first_name} ?`,{
          title: 'Confirmation',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'primary',
          okTitle:'Confirm',
          headerClass: 'p-2 border-bottom-0 h1',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then((proceed) => {
          proceed 
          ?
          this.deleteUser(this.data.id)
          :
          ''
        });
    },
    denyModal() {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to Deactivate ${this.data.first_name} ?`,{
          title: 'Confirmation',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'primary',
          okTitle:'Confirm',
          headerClass: 'p-2 border-bottom-0 h1',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then((proceed) => {
          proceed &&
          this.denyUser(
          {
            id:this.data.id,
            params:this.status == 'Deactivate' ? 'Active' : 'Deactivate'}
          );
        }),{
        buttonSize: "md",
        centered: true,
        size: "xl",
        }
                
    },
    // deleteModal() {
    //   this.$bvModal
    //     .msgBoxConfirm(
    //       "Are you sure you want to delete ?"
    //     )
    //     .then((proceed) => {
    //       if (!proceed) {
    //         return false;
    //       }

    //       let entity = store.getters["authfack/currentEntity"];
    //       let params = {
    //         entity: {
    //           id: entity.id,
    //         },
    //         types: [this.params.data.id],
    //       };
    //       userTypeService
    //         .deleteUserTypes(params)
    //         .then((data) => {
    //           if (data.status === "success") {
    //             userTypeService.createCustomStorageNotification(
    //               "success",
    //               data.message
    //             );
    //             //this.$store.dispatch('notification/success', data.message);
    //             this.emitPageReload(true);
    //           }
    //         })
    //         // @TODO: Catch error
    //         .catch((error) => {
    //           this.$store.dispatch("notification/error", error.data);
    //         });
    //     })
    //     .catch((error) => {
    //       this.$store.dispatch("notification/error", error.data);
    //     });
    // },
    getEditAction() {
      return {
        show: this.params.colDef.actions.edit.show ?? null,
        // @TODO: This need to be a more dynamic approach, this binded to userId at present
        href: this.params.data.id ? `/user-types/${this.params.data.id}` : null,
      };
    },
    getDenyAction() {
      return {
        show: this.params.colDef.actions.deny.show ?? null,
      };
    },
    getDeleteAction() {
      return {
        show: this.params.colDef.actions.delete.show ?? null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.user-action-btn {
  transition: color 0.2 linear;
}
#actionsUserTypeRenderer .user-action-btn:active {
  color: rgb(211, 87, 42);
}
.action-icon{
  font-size: 0.9rem;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: #00989A;
  }
}
.in-color {
  color: #34c38f;
}
.out-color {
  color: #f46a6a;
}

</style>
