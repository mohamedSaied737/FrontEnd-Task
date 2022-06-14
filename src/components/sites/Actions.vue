<template>
  <!-- multiple selection dropdown  -->
  <div v-bind:class="type === 'kiosk' ? 'daemon-dropdown' : ''">
    <b-dropdown size="sm" variant="primary" v-if="type == 'multi'">
      <template v-slot:button-content>
        Actions for selections
        <i class="mdi mdi-chevron-down"></i>
      </template>
      <b-dropdown-item
        v-b-modal="'moveKiosk'"
        @click="setActionData(data)"
        :disabled="getPackageType == 'Standalone'"
      >
        Move Kiosks
      </b-dropdown-item>
      <b-dropdown-item
        v-b-modal="'registerMultiKiosks'"
        @click="setActionData(data)"
        v-if="getPackageType == 'Standalone'"
      >
        Register Multiple Kiosks
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown
      v-else
      size="sm"
      variant="outline-secondary"
      class="action-dropdown border text-primary"
      :disabled="
        (type == 'site' || type == 'area') && getPackageType == 'Standalone'
      "
    >
      <template v-slot:button-content class="action-text">
        {{
          type == "site"
            ? "Site Actions"
            : type == "area"
            ? "Area Actions"
            : "Kiosk Actions"
        }}
        <i class="mdi mdi-chevron-down text-secondary"></i>
      </template>
      <!-- Site Kiosk Settings  -->
      <b-dropdown-item-button
        v-if="type != 'kiosk'"
        v-b-modal="'UpdatekiosksMultiple'"
        :disabled="type == 'site' && getPackageType == 'Standalone'"
        @click.stop="setActionData()"
      >
        {{
          type == "site" && type != "kiosk"
            ? "Site Kiosk Settings"
            : "Area Kiosk Settings"
        }}
      </b-dropdown-item-button>
      <!-- update  -->
      <b-dropdown-item-button
        :disabled="type == 'site' && getPackageType == 'Standalone'"
        v-b-modal="
          type == 'site'
            ? 'updateSite'
            : type == 'area'
            ? 'updateArea'
            : 'updateKiosk'
        "
        @click.stop="setActionData()"
      >
        {{
          type == "site"
            ? "Edit Site"
            : type == "area"
            ? "Edit Area"
            : `Kiosk (${data.name}) Settings`
        }}
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="type == 'kiosk' && getPackageType == 'Standalone'"
        v-b-modal="'registerKiosk'"
        @click.stop="setActionData()"
      >
        Register Kiosk with QR
      </b-dropdown-item-button>
      <!-- move  -->
      <b-dropdown-item-button
        :disabled="getPackageType == 'Standalone'"
        v-if="type == 'area' || type == 'kiosk'"
        v-b-modal="type == 'area' ? 'moveArea' : 'moveKiosk'"
        @click="setActionData()"
      >
        {{ type == "area" ? "Move Area to" : "Move Kiosk to" }}
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        v-b-modal="'changeJourney'"
        @click="setActionData()"
      >
        Change journey
      </b-dropdown-item-button>
      <!-- delete  -->
      <b-dropdown-item-button @click.stop="deleteModal">
        {{
          type == "site"
            ? "Delete Site"
            : type == "area"
            ? "Delete Area"
            : "De-register"
        }}
      </b-dropdown-item-button>
      <!-- Daemon Actions  -->
      <!-- Push Restart -->
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        v-b-modal="'kioskDaemonLogs'"
        @click.stop="setActionData()"
      >
        Preview Logs
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        @click.stop="pushRestart(data.mac_address)"
      >
        Restart Kiosk
      </b-dropdown-item-button>
      <!-- Restart App -->
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        @click.stop="restartApp(data.mac_address)"
      >
        Restart App
      </b-dropdown-item-button>
      <!-- Update App -->
      <b-dropdown-item-button
        v-if="type == 'kiosk' && userEmail == 'lt_techteam@visipoint.com'"
        v-b-modal="'updateApp'"
        @click.stop="setActionData()"
      >
        Install App
      </b-dropdown-item-button>
      <!-- Remote Show Screen -->
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        @click.stop="remoteShowScreen(data.mac_address)"
      >
        Screenshot
      </b-dropdown-item-button>
      <!-- Kiosk Logging -->
      <b-dropdown-item-button
        v-if="type == 'kiosk' && userEmail == 'lt_techteam@visipoint.com'"
        @click.stop="kioskLogging(data.mac_address)"
      >
        Get Logs
      </b-dropdown-item-button>
      <!-- Pull Database -->
      <b-dropdown-item-button
        v-if="type == 'kiosk' && userEmail == 'lt_techteam@visipoint.com'"
        @click.stop="pullDatabase(data.mac_address)"
      >
        Get Database
      </b-dropdown-item-button>
      <!-- Kiosk info -->
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        v-b-modal="'kioskInfo'"
        @click.stop="setActionData()"
      >
        Get Kiosk Info
      </b-dropdown-item-button>
      <!-- Open Door -->
      <b-dropdown-item-button
        v-if="type == 'kiosk'"
        @click.stop="openDoor(data.mac_address)"
      >
        Open Door
      </b-dropdown-item-button>
      <!-- Refresh Face Library -->
      <b-dropdown-item-button
        v-if="type == 'kiosk' && userEmail == 'lt_techteam@visipoint.com'"
        v-b-modal="'refreshFaceLibrary'"
        @click.stop="setActionData()"
      >
        Refresh Face Library
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ActionCell",
  props: ["data", "type", "multi"],
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("authfack", ["userDetails"]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
    userEmail() {
      return this.userDetails && this.userDetails.email;
    },
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    ...mapActions("kiosks", ["deleteKiosk"]),
    ...mapActions("daemon", [
      "pushRestart",
      "restartApp",
      "updateApp",
      "remoteShowScreen",
      "kioskLogging",
      "forceResyncWithLogs",
      "pullDatabase",
      "openDoor",
    ]),
    ...mapActions("sites", ["deleteArea", "deleteSite"]),
    setActionData() {
      this.setData(this.data);
    },
    deleteModal() {
      this.$bvModal
        .msgBoxConfirm(
          this.type == "kiosk"
            ? `De-registering a kiosk will delete all stored data in Kiosk ${this.data.name} ?`
            : `Are you sure you want to delete this ${this.data.name}? Please ensure you have migrated all assosiated areas, users & kiosks first!?`,
          {
            title: "Confirmation",
            size: "md",
            buttonSize: "md",
            okVariant: "primary",
            cancelVariant: "outline-secondary",
            okTitle: "Confirm",
            headerClass: "border-bottom-0 h1",
            footerClass: "p-2 border-top-0",
            centered: true,
          }
        )
        .then((proceed) => {
          if (proceed) {
            const { id } = this.data;
            switch (this.type) {
              case "site":
                return this.deleteSite(id);
              case "kiosk":
                return this.deleteKiosk(this.data.id);
              case "area":
                return this.deleteArea(this.data.id);
              default:
                null;
            }
          }
        });
    },
  },
};
</script>
<style lang="scss">
.dropdown-toggle {
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
