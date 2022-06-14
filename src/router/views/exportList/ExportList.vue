<template>
  <Layout>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <div class="export-list-wrapper grid-data">
      <DataTable
        :columns="getExportHeaders"
        :loading="getLoading"
        :rows="rowsData"
        :hasCheckbox="false"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :gridSettings="false"
        :isSelectable="onRowClicked"
        :iconAction="onToggleVisible"
        :striped="true"
      >
        <!-- requested by -->
        <b-table-column
          field="requested_by"
          label="Requested By"
          searchable
          sortable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize"> {{ props.row.requested_by }} </span>
          </template>
        </b-table-column>
        <!-- generation_date -->
        <b-table-column
          field="generation_date"
          label="Generation Date"
          searchable
          sortable
        >
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              type="date"
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Filter"
            >
            </date-picker>
          </template>
          <template v-slot="props">
            {{ props.row.generation_date }}
          </template>
        </b-table-column>
        <!-- expiry_date -->
        <b-table-column
          field="expiry_date"
          label="Expiry Date"
          searchable
          sortable
        >
          <template slot="searchable" slot-scope="props">
            <date-picker
              v-model="props.filters[props.column.field]"
              type="date"
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Filter"
            >
            </date-picker>
          </template>
          <template v-slot="props">
            {{ props.row.expiry_date }}
          </template>
        </b-table-column>
        <!-- type -->
        <b-table-column field="type" label="type" searchable sortable>
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            <span class="text-capitalize"
              >{{ props.row.type }}</span
            >
          </template>
        </b-table-column>
        <!-- Action -->
        <b-table-column label="Action">
          <template v-slot="props">
            <a
              class="download-export-btn"
              :href="`${base_URL}${props.row.url}`"
              target="_blank"
              download
              >Download</a
            >
          </template>
        </b-table-column>
      </DataTable>
    </div>
  </Layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/grid/DataTable";
import { exportListColumns } from "@/utils/dataSource";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  title: "Export List",
  name: "ExportList",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    DataTable,
  },
  data() {
    return {
      title: "Export List",
      base_URL: process.env.VUE_APP_BASE_URL,
    };
  },
  computed: {
    ...mapGetters("grid", ["getLoading", "getTableHeaders"]),
    ...mapGetters("exportConfig", ["getExportList"]),
    ...mapGetters("authfack", ["userDetails"]),
    rowsData() {
      const { getExportList } = this;
      return getExportList.length
        ? getExportList.map((item) => {
            return {
              requested_by: `${item.first_name ? item.first_name : ""} ${
                item.last_name ? item.last_name : ""
              }`,
              generation_date: item.generation_date
                ? item.generation_date
                : "-",
              expiry_date: item.expiry_date ? item.expiry_date : "-",
              type: item.type ? `${item.type} - ${item.name.split(".").pop()}` : "-",
              url: item.url,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    ...mapActions("exportConfig", ["fetchExportList"]),
    onToggleVisible() {
      this.$bvModal.show("");
    },
    onRowClicked() {
      return "";
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/export-list",
        headers: exportListColumns,
      });
    },
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchExportList();
  },
};
</script>
