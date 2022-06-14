<template>
  <b-dropdown size="sm" variant="outline-secondary">
    <template v-slot:button-content>
      Available Actions
      <i class="mdi mdi-chevron-down text-secondary"></i>
    </template>
    <b-dropdown-item v-if="type == 'journey'" @click="redirectTo('addFlow')">
      Add Flow
    </b-dropdown-item>
    <b-dropdown-item v-if="(type =='journey'&&data.journey_flows.length>0)||type == 'flow'" @click="redirectTo('editFlow')">Edit Flow</b-dropdown-item>
    <b-dropdown-item
    v-if="(type == 'journey' &&data.journey_flows.length>0 ||type == 'flow')"
      @click="
        deleteModal(
          type == 'journey' ? data.journey_flows[0].id : data.id,
          'flow'
        )
      "
      >Delete Flow</b-dropdown-item
    >
    <b-dropdown-divider v-if="type == 'journey'"></b-dropdown-divider>
    <b-dropdown-item v-if="type == 'journey'" @click="redirectTo('editJourney')"
      >Edit Journey</b-dropdown-item
    >
    <b-dropdown-item
      v-if="type == 'journey'"
      @click="deleteModal(data.id, 'journey')"
      >Delete Journey</b-dropdown-item
    >
  </b-dropdown>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "JourneyActions",
  props: ["data", "type"],
  methods: {
    ...mapActions("journey", ["deleteJourney"]),
    ...mapActions("journeyFlow", ["deletejourneyFlow"]),
    redirectTo(type) {
      switch (type) {
        case "addFlow":
          return this.$router.push(`/add/journey/flow/${this.data.id}`);
        case "editFlow":
          return this.$router.push(
            `/update/journey/flow/${
              this.type == "journey"
                ? this.data.journey_flows[0].id
                : this.data.id
            }`
          );
        case "editJourney":
          return this.$router.push(`/update/journey/${this.data.id}`);
        default:
          null;
      }
    },
    deleteModal(id, type) {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete ${
            type == `journey` ? `journey` : `journey flow`
          } ?`,
          {
            title: "Confirmation",
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            okTitle: "Confirm",
            cancelVariant: "outline-secondary",
            headerClass: "p-2 border-bottom-0 h1",
            footerClass: "p-2 border-top-0",
            centered: true,
          }
        )
        .then((proceed) => {
          if (proceed) {
            switch (type) {
              case "journey":
                this.deleteJourney(id);
                break;
              case "flow":
                this.deletejourneyFlow(id);
                break;
              default:
                "";
                break;
            }
          }
        });
    },
  },
};
</script>
