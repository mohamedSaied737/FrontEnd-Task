<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
// grid imports
import DataTable from "@/components/grid/DataTable";
import { daemonLogsColumns } from "@/utils/dataSource";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  name: "KioskDaemonLogs",
  mixins: [exportExel],
  components: {
    DataTable,
  },
  data() {
    return {
      title: "KioskDaemonLogs",
      users: "",
      items: [
        {
          text: "Users",
          href: "/users",
        },
        {
          text: "List",
          active: true,
        },
      ],
      isAddModal: false,
      daemonLogsColumns,
      requestTypesMapper: {
        update_app: "Update App",
        push_restart: "Restart Kiosk",
        restart_app: "Restart App",
        kiosk_logging: "Get Logs",
        force_resync_with_logs: "Preview Logs",
        remote_show_screens: "Screenshot",
        manual_pull_database: "Get Database",
        open_door: "Open Door",
        refresh_face_library: "Refresh Face Library",
      },
    };
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "getScanDataTypes",
      "getKiosks",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("modal", ["getModalInfo", "getModalState"]),
    ...mapGetters("daemon", ["getRequestLogs", "getLoading"]),
    getTableHeaders() {
      return {
        Id: true,
        Type: true,
        Status: true,
        RequestDate: true,
        ReasonOfFailure: true,
        Download: true,
      };
    },
    rowsData() {
      return this.getRequestLogs && this.getRequestLogs.length > 0
        ? this.getRequestLogs.map((request) => {
            let userTimezone = moment.tz.guess();
            return {
              id: request.id,
              type: this.requestTypesMapper[request.type],
              status: request.status,
              requestDate: moment(request.created_at)
                .tz(userTimezone)
                .format("YYYY-MM-DD"),
              reasonOfFailure: request.reason_of_failure ?? " - ",
              download: request.downloadable_file ?? "",
            };
          })
        : [];
    },
  },
  watch: {
    getModalState(state) {
      state && this.$bvModal.hide("daemonLogs");
    },
  },
  methods: {
    ...mapActions("daemon", ["fetchKioskRequestLogs"]),
    ...mapMutations("daemon", ["setRequestLogs"]),
    onToggleVisible() {
      this.$bvModal.show("");
    },
    onRowClicked() {
      return "";
    },
  },
  mounted() {
    this.fetchKioskRequestLogs(this.getModalInfo.mac_address);
    this.$root.$on("bv::modal::hide", (bvEvent, modalId) => {
      if (modalId === "kioskDaemonLogs") {
        this.setRequestLogs([]);
      }
    });
  },
};
</script>

<template>
  <section>
    <div class="export-list-wrapper grid-data">
      <DataTable
        :columns="getTableHeaders"
        :loading="getLoading"
        :rows="rowsData"
        :hasCheckbox="false"
        :hasBEpagination="true"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :gridSettings="false"
        :isSelectable="onRowClicked"
        :iconAction="onToggleVisible"
        :recordsCount="getRequestLogs.length"
        :striped="true"
      >
        <!-- id -->
        <b-table-column field="id" label="Id" searchable sortable>
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize"> {{ props.row.id }} </span>
          </template>
        </b-table-column>
        <!-- Request Date -->
        <b-table-column field="requestDate" label="Date" searchable sortable>
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              type="date"
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Search..."
            >
            </date-picker>
          </template>
          <template v-slot="props">
            {{ props.row.requestDate }}
          </template>
        </b-table-column>
        <!-- type -->
        <b-table-column field="type" label="Type" searchable sortable>
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize">{{ props.row.type }}</span>
          </template>
        </b-table-column>
        <!-- Status -->
        <b-table-column field="status" label="Status" searchable sortable>
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize">{{ props.row.status }}</span>
          </template>
        </b-table-column>
        <!-- Reason Of Failure -->
        <b-table-column
          field="reasonOfFailure"
          label="Reason Of Failure"
          searchable
          sortable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize">{{ props.row.reasonOfFailure }}</span>
          </template>
        </b-table-column>
        <!-- Action -->
        <b-table-column label="Action">
          <template v-slot="props">
            <a
              class="download-export-btn"
              v-if="
                props.row.download.length && props.row.type !== 'Update App'
              "
              :href="`${props.row.download}`"
              target="_blank"
              download
              >Download</a
            >
          </template>
        </b-table-column>
      </DataTable>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4">
      <button
        class="btn btn-primary px-3 mr-2"
        @click="$bvModal.hide('kioskDaemonLogs')"
      >
        Cancel
      </button>
    </div>
  </section>
</template>
