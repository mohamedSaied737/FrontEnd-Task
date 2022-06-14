<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// grid imports
import DataTable from "@/components/grid/DataTable";
import ImageCell from "@/components/sharedCells/ImageCell";
import FilterInput from "@/components/sharedCells/FilterInput";
import Modal from "@/components/modal/Modal";
import { reportTimeColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import {exportExel} from '@/utils/mixins/exportMixin';

export default {
  title:"Reporting",
  name: "Reporting",
  mixins:[exportExel],
  components: {
    Layout,
    PageHeader,
    DataTable,
    ImageCell,
    FilterInput,
    ColumnsSwitcher,
    Modal,
  },
  data() {
    return {
      title: "Reporting",
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
      reportTimeColumns:reportTimeColumns,
    };
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "getScanDataTypes",
      "getKiosks",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("reports", ["getTimeRports"]),
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders", "getLoading"]),
    rowsData() {
      return this.getTimeRports && this.getTimeRports.length > 0
        ? this.getTimeRports.map((report) => {
            let userTimezone = moment.tz.guess();
            return {
              Image: report.scan[0].image,
              FirstName: report.user.first_name,
              LastName: report.user.last_name,
              UserType: report.user.user_type.name,
              Kiosk: report.scan[0].kiosk.name,
              InputType: report.scan[0].input_method.name,
              Temperature: report.scan[0].temperature,
              CheckIN: moment(report.signed_in).tz(userTimezone).format('YYYY-MM-DD'),
            };
          })
        : [];
    },
    getCurrentWeekRange() {
      return [
        moment()
          .day(1)
          .format("DD/MM/YYYY"),
        moment()
          .day(7)
          .format("DD/MM/YYYY"),
      ];
    },
  },
  methods: {
    ...mapActions("dailyLogbook", [
      "fetchScanDatatypes",
      "fetchUserTypes",
      "fetchKiosks",
      "fetchInputTypes",
    ]),
    ...mapActions("reports", ["TimeRportAction"]),
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    onRowClicked(){
      return ''
    },
    onToggleVisible() {
      this.$bvModal.show("reportTime");
    },
  },
  mounted() {
    this.onTableHeader({
      url: "/reporting/time",
      headers: reportTimeColumns,
    });
    this.TimeRportAction();
  },
  destroyed() {
    this.resetTableHeaders();
    this.resetFilterValues();
  },
};
</script>

<template>
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <!-- modal -->
    <Modal :title="'View List Settings'" modalID="reportTime">
      <template>
      <ColumnsSwitcher :tableHeaders="getTableHeaders" url="/reporting/time" modalID="reportTime" />
      </template>
    </Modal>
    <!-- grid -->
    <DataTable
      class="my-2"
      :rows="rowsData"
      :columns="getExportHeaders"
      :getDataAction="TimeRportAction"
      :loading="getLoading"
      :iconAction="onToggleVisible"
      :hasCheckbox="false"
      :hasBEpagination="true"
      :hasBEfiltering="true"
      :hasBEsorting="true"
      :hasDetails="false"
      :gridSettings="true"
      :isSelectable="onRowClicked"
    >
      <!-- image -->
      <b-table-column
        field="Image"
        :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Image : true
        "
        label=""
        v-slot="props"
      >
        <ImageCell :image="props.row.Image" />
      </b-table-column>
      <!-- first name -->
      <b-table-column
        field="FirstName"
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.FirstName
            : true
        "
        label="First Name"
        sortable
        searchable
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'FirstName' }"
            type="default"
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
        sortable
        searchable
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.LastName
            : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'LastName' }"
            type="default"
          />
        </template>
        <template v-slot="props">
          {{ props.row.LastName }}
        </template>
      </b-table-column>
      <!-- user types -->
      <b-table-column
        field="UserType"
        label="User Type"
        sortable
        searchable
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.UserType
            : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :options="getUserTypes"
            label="name"
            :openAction="fetchUserTypes"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'UserType' }"
            type="selectInput"
          />
        </template>
        <template v-slot="props">
          {{ props.row.UserType }}
        </template>
      </b-table-column>
      <!-- kiosk -->
      <b-table-column
        field="Kiosk"
        label="Kiosk"
        sortable
        searchable
        :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Kiosk : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :options="getKiosks"
            label="name"
            :openAction="fetchKiosks"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'Kiosk' }"
            type="selectInput"
          />
        </template>
        <template v-slot="props">
          {{ props.row.Kiosk }}
        </template>
      </b-table-column>
      <!-- input type -->
      <b-table-column
        field="InputType"
        label="Input Type"
        sortable
        searchable
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.InputType
            : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :options="getInputTypes"
            label="name"
            :openAction="fetchInputTypes"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'InputType' }"
            type="selectInput"
          />
        </template>
        <template v-slot="props">
          {{ props.row.InputType }}
        </template>
      </b-table-column>
      <!-- temperature -->
      <b-table-column
        field="Temperature"
        label="Temperature"
        sortable
        searchable
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Temperature
            : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder="filter"
            :selectAction="TimeRportAction"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'Temperature' }"
            type="default"
          />
        </template>
        <template v-slot="props">
          {{ props.row.Temperature }}
        </template>
      </b-table-column>
      <!-- check in  -->
      <b-table-column
        field="CheckIN"
        label="Check in"
        searchable
        sortable
        :visible="Object.keys(getTableHeaders).length > 0 ? getTableHeaders.CheckIN : true"
      >
        <template slot="searchable">
          <FilterInput
            placeholder=""
            :selectAction="TimeRportAction"
            :paramsKey="{ valueKey: 'CheckIN' }"
            type="dateInput"
            :defaultSelected="getCurrentWeekRange"
          />
        </template>
        <template v-slot="props">
          {{ props.row.CheckIN }}
        </template>
      </b-table-column>
      <!-- check out  -->
      <!-- <b-table-column
        field="CheckOut"
        label="Check out"
        searchable
        sortable
        :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.CheckOut
            : true
        "
      >
        <template slot="searchable">
          <FilterInput
            placeholder=""
            :selectAction="TimeRportAction"
            :paramsKey="{ valueKey: 'CheckOut' }"
            type="dateInput"
          />
        </template>
        <template v-slot="props">
          {{ props.row.CheckOut ? props.row.CheckOut : "--" }}
        </template>
      </b-table-column> -->
    </DataTable>
  </Layout>
</template>
<style lang="scss" scoped>
.header-close {
  font-size: 24px !important;
  font-weight: bold !important;
  background-color: transparent;
  border: none;
}
.header-close:active {
  outline: none;
}
h5.modal-title {
  width: 100%;
  text-align: center;
  font-size: 19px;
  font-weight: 700;
}
</style>
