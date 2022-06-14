<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
//grid imports
import DataTable from "@/components/grid/DataTable";
import DatePicker from "vue2-datepicker";
import { importQueuesColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import Modal from "@/components/modal/Modal";
import { exportExel } from "@/utils/mixins/exportMixin";
import moment from "moment";

export default {
  mixins: [exportExel],
  title:"Import Queue",
  components: {
    Layout,
    DataTable,
    PageHeader,
    DatePicker,
    ColumnsSwitcher,
    Modal,
  },
  name: "ImportQueue",
  data() {
    return {
      title: "Import Queue",
      // columns for export
      columns: {
        Operator: "Operator",
        Serial: "Serial",
        Date: "Date",
        ID: "ID",
        Time: "Time",
        Status: "Status",
      },
    };
  },
  computed: {
    ...mapGetters("usersImport", ["getImportedList"]),
    ...mapGetters("grid", ["getTableHeaders", "getLoading"]),
    rowsData() {
      let userTimezone = moment.tz.guess();
      return this.getImportedList && this.getImportedList.length > 0
        ? this.getImportedList.map((item) => {
            return {
              //reformates data
              Operator: item.operator,
              Serial: item.serial,
              Date: moment
                .utc(item.created_at)
                .tz(userTimezone)
                .format("YYYY-MM-DD"),
              Time: moment
                  .utc(item.created_at)
                  .tz(userTimezone)
                  .format("hh:mm A"),
              Status: item.status,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("usersImport", ["fetchImportedTasks"]),
    ...mapActions("grid", ["onTableHeader", "resetTableHeaders"]),
    onToggleVisible() {
      this.$bvModal.show("importQueue");
    },
  },
  mounted() {
    this.onTableHeader({
      url: "import/queue",
      headers: importQueuesColumns,
    });
    this.fetchImportedTasks();
  },
  destroyed() {
    this.resetTableHeaders();
  },
};
</script>
<template>
  <Layout>
    <section id="importQueue">
      <PageHeader
        :title="title"
        className="d-flex align-items-center justify-content-between mb-2"
      >
            <router-link
            to=/users/import
            >
            <b-button class="d-flex align-items-center px-3 top-page-btn" variant="outline-primary" pill size="sm">
                <i class="bx bx-right-arrow-alt font-size-18 mr-2"></i>
                 Import Users
              </b-button>
            </router-link >
      </PageHeader>
            <!-- columns view -->
    <Modal :title="'View List Settings'" modalID="importQueue">
      <template>
      <ColumnsSwitcher :tableHeaders="getTableHeaders" url='/import/queue' modalID="importQueue" />
      </template>
    </Modal>
      <!-- Grid  -->
      <DataTable
        :rows="rowsData"
        :hasCheckbox="false"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :gridSettings="true"
        :iconAction="onToggleVisible"
        :columns="columns"
        :loading="getLoading"
        :isSelectable="''"
      >
        <!-- Operator -->
        <b-table-column :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Operator : true
        " searchable field="Operator" label="Operator">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Operator }}
          </template>
        </b-table-column>
        <!-- Serial -->
        <b-table-column :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Serial : true
        " searchable field="Serial" label="Serial">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Serial }}
          </template>
        </b-table-column>
        <!-- Date -->
        <b-table-column :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Date : true
        " field="Date" label="Date" searchable>
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Select date"
            ></date-picker>
          </template>
          <template v-slot="props">
            {{ props.row.Date }}
          </template>
        </b-table-column>
        <!-- Time -->
        <b-table-column :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Time : true
        " field="Time" label="Time" searchable>
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              format="hh:mm a"
              value-type="format"
              type="time"
              placeholder="hh:mm"
              class="pickerInput"
            ></date-picker>
          </template>
          <template v-slot="props">
            {{ props.row.Time }}
          </template>
        </b-table-column>
        <!-- Status -->
        <b-table-column :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Status : true
        " searchable field="Status" label="Status">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="md"
            />
          </template>
          <template v-slot="props">
            <div class="d-flex align-items-center">
                          <span
              class="text-white status-text px-3 py-0 mr-2"
              :class="
                props.row.Status == 'Ended'
                  ? 'bg-green'
                  : props.row.Status == 'Pending'
                  ? 'bg-yellow'
                  : 'bg-red'
              "
            >
              {{ props.row.Status }}
            </span>
            <router-link v-if="props.row.Status == 'Ended'" :to='`/users/import/details/${props.row.Serial}`'>
            <button class="btn btn-outline-primary btn-sm rounded px-3 py-0">Show details</button>
            </router-link >
            </div>
          </template>
        </b-table-column>
      </DataTable>
    </section>
  </Layout>
</template>
<style lang="scss" scoped>
@font-face {
  font-family: "regular-lato";
  src: url("../../../assets/fonts/Lato/Lato-Regular.ttf");
}
.status-text {
  border-radius: 20px;
}
.pickerInput .mx-input {
  font-size: 10px !important;
}
</style>
