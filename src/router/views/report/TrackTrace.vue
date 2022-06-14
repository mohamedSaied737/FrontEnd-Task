<template>
  <Layout>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <!-- modal -->
    <Modal :title="'View List Settings'" modalID="trackTrace">
      <template>
        <ColumnsSwitcher
          :tableHeaders="getTableHeaders"
          url="/track-trace"
          modalID="trackTrace"
          :fetchTableHeaders="fetchTableHeaders"
        />
      </template>
    </Modal>
    <div class="grid-wrapper p-3">
      <div class="filters-wrapper">
        <h5 class="filter-title">Filter Results</h5>
        <div class="filters d-flex align-items-center">
          <div class="filter user-filter mr-4">
            <multiselect
              v-model="user"
              label="fullName"
              :options="getUsers"
              placeholder="Select User.."
              :show-labels="false"
            />
          </div>
          <div class="filter date-filte mr-4">
            <date-picker
              v-model="date"
              append-to-body
              lang="en"
              value-type="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="Date"
              :clearable="true"
              range
            />
          </div>
          <button
            :disabled="!(user && date)"
            class="btn btn-primary rounded-pill py-1 px-5"
            @click="onFilterSubmit"
          >
            Filter
          </button>
        </div>
      </div>
      <DataTable
        v-if="showTable"
        :columns="getTableHeaders"
        :loading="getLoading"
        :rows="rowsData"
        :hasCheckbox="false"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :gridSettings="true"
        :isSelectable="onRowClicked"
        :iconAction="onToggleVisible"
      >
        <!-- first name -->
        <b-table-column
          field="FirstName"
          label="First Name"
          searchable
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.FirstName
              : true
          "
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.FirstName }}
          </template>
        </b-table-column>
        <!-- last name -->
        <b-table-column 
          field="LastName" 
          label="Last Name" 
          searchable 
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.LastName
              : true
          ">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.LastName }}
          </template>
        </b-table-column>
        <!-- usertype -->
        <b-table-column 
          field="UserType" 
          label="User Type"
          searchable 
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.UserType
              : true
          ">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.UserType }}
          </template>
        </b-table-column>
        <!-- Input -->
        <b-table-column
          field="InputType"
          label="Input Type"
          searchable
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.InputType
              : true
          "
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <p
              class="mb-0 no-wrap"
              :key="i"
              v-for="(item, i) in props.row.InputType"
            >
              {{ item }}
            </p>
          </template>
        </b-table-column>
        <!-- kiosk -->
        <b-table-column 
          field="Kiosk" 
          label="Kiosk"
          searchable
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Kiosk
              : true
          ">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <p
              class="mb-0 no-wrap"
              :key="i"
              v-for="(item, i) in props.row.Kiosk"
            >
              {{ item }}
            </p>
          </template>
        </b-table-column>
        <!-- Area -->
        <b-table-column 
          field="Area"
          label="Area"
          searchable
          sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Area
              : true
          ">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <p
              class="mb-0 no-wrap"
              :key="i"
              v-for="(item, i) in props.row.Area"
            >
              {{ item }}
            </p>
          </template>
        </b-table-column>
        <!-- Date -->
        <b-table-column field="Date" label="Date" sortable
         :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Date
              : true
          ">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <p
              class="mb-0 no-wrap"
              :key="i"
              v-for="(item, i) in props.row.From"
            >
              {{ item }}
            </p>
          </template>
        </b-table-column>
        <!-- To -->
        <b-table-column v-if="false" field="To" label="To" sortable
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.To
              : true
          "
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.To }}
          </template>
        </b-table-column>
      </DataTable>
      <h5 v-else class="text-muted my-5">
        Select a user and date range to show information.
      </h5>
    </div>
  </Layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import DataTable from "@/components/grid/DataTable";
import Modal from "@/components/modal/Modal";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import { trackTraceColumns } from "@/utils/dataSource";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  title:"Track-Trace",
  name: "TrackTrace",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    DataTable,
    Multiselect,
    DatePicker,
    Modal,
    ColumnsSwitcher,
  },
  data() {
    return {
      title: "Track and Trace",
      showTable: false,
      user: null,
      date: null,
      search_query: {
        name: "",
      },
    };
  },
  computed: {
    ...mapGetters("grid", ["getLoading", "getTableHeaders"]),
    ...mapGetters("reports", ["getTrackTrace", "getUsers"]),
    rowsData() {
      return this.getTrackTrace && this.getTrackTrace.length > 0
        ? this.getTrackTrace.map((report) => {
            return {
              FirstName: report.first_name ? report.first_name : "-",
              LastName: report.last_name ? report.last_name : "-",
              UserType: report.current_entity.user_type
                ? report.current_entity.user_type.name
                : "-",
              InputType:
                report.inputTypes && report.inputTypes.length > 0
                  ? report.inputTypes
                  : "-",
              Kiosk:
                report.kiosks && report.kiosks.length > 0 ? report.kiosks : "-",
              From:
                report.dates && report.dates.length > 0 ? report.dates : "-",
              Area:
                report.areas && report.areas.length > 0 ? report.areas : "-",
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("reports", [
      "fetchTrackTrace",
      "fetchUsers",
      "clearTrackTraceData",
    ]),
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    onToggleVisible() {
      this.$bvModal.show("trackTrace");
    },
    onFilterSubmit() {
      this.showTable = true;
      this.fetchTrackTrace({
        id: [this.user.id],
        date: this.date,
      });
    },
    onRowClicked() {
      return "";
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/track-trace",
        headers: trackTraceColumns,
      });
    },
    changeInputTypeName(name) {
      const arr =
        name &&
        name.length > 0 &&
        name.map((item) => {
          if (item == "face recognition") {
            return "Facial Recognition";
          } else {
            return item;
          }
        });
      return arr;
    },
  },
  mounted() {
    this.fetchTableHeaders();
    this.clearTrackTraceData();
    this.fetchUsers();
  },
};
</script>

<style lang="scss" scobed>
.grid-wrapper {
  min-height: 500px;
  overflow: visible;
  .filters-wrapper {
    .filter-title {
      color: #495057;
      font-weight: 400;
    }
    .filter {
      width: 25%;
    }
  }
  .search-wrapper {
    width: 20%;
    margin: 1% 0;
  }
}
</style>
