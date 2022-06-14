<template>
  <Layout>
          <!-- sites columns  -->
      <Modal :title="'View List Settings'" modalID="siteColumns">
        <template>
          <ColumnsSwitcher
            :tableHeaders="getTableHeaders"
            url="/sites"
            modalID="siteColumns"
            :fetchTableHeaders="fetchTableHeaders"
          />
        </template>
      </Modal>
      <!-- Update kiosks Multiple  -->
      <b-modal
        id="UpdatekiosksMultiple"
        hide-footer
        hide-header
        size="lg"
        scrollable
      >
        <UpdatekiosksMultiple />
      </b-modal>
      <!-- site actions  -->
      <b-modal id="updateSite" hide-footer hide-header size="lg">
        <SiteForm />
      </b-modal>
      <!-- upgrade message  -->
      <b-modal id="upgradeMessage" hide-header hide-footer>
        <template>
          <div class="d-flex justify-content-center mb-3">
            <img
              src="@/assets/images/logo-lg.svg"
              class="unselectable"
              alt
              width="30%"
            />
          </div>
          <p class="text-center my-5">
            You have limited access to dashboard features, to gain full access please contact our customer service team at <a href="mailto:cs@lamasatech.com" class="font-weight-bold">cs@lamasatech.com</a> to upgrade to one of our cloud packages.
          </p>
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-primary"
              @click="$bvModal.hide('upgradeMessage')"
            >
              Got it
            </button>
          </div>
        </template>
      </b-modal>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
      <div class="page-title-right mb-2 d-flex">
        <b-button
          pill
          class="d-flex align-items-center px-3 top-page-btn"
          variant="primary"
          size="sm"
          v-b-modal="'updateSite'"
          @click="setData({})"
          :disabled="getPackageType == 'Standalone'"
        >
          <i class="bx bx-plus font-size-18 mr-2"></i>
          Add Site
        </b-button>
      </div>
    </PageHeader>
    <section class="site-wrapper">
      <!-- grid settings   -->
      <DataTable
        :rows="rowsData"
        :columns="getExportHeaders"
        :loading="getLoading"
        :hasCheckbox="false"
        :hasBEpagination="true"
        :recordsCount="getSitesWithAreas.length"
        :hasBEfiltering="false"
        :hasBEsorting="true"
        :hasBEexport="false"
        :hasDetails="false"
        :gridSettings="true"
        :isHoverable="true"
        :isSelectable="selected"
        :selectable="true"
        :getDataAction="fetchSiteswithAreas"
        :iconAction="onToggleVisible"
      >
        <!-- site name  -->
        <b-table-column
          field="Name"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Name
              : true
          "
          label="Name"
          sortable
          width="300"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-if="showDetailIcon" v-slot="props">
            <span class="text-primary text-uppercase">{{
              props.row.Name
            }}</span>
          </template>
        </b-table-column>
        <!-- areas count -->
        <b-table-column
          field="AreasCount"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.AreasCount
              : true
          "
          label="No. Areas"
          sortable
          width="300"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-if="showDetailIcon" v-slot="props">
            {{ props.row.AreasCount }}
          </template>
        </b-table-column>
        <!-- kiosks count -->
        <b-table-column
          field="KiosksCount"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.KiosksCount
              : true
          "
          label="No. Kiosks"
          sortable
          width="300"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-if="showDetailIcon" v-slot="props">
            {{ props.row.KiosksCount }}
          </template>
        </b-table-column>
        <!-- reception email  -->
        <b-table-column
          field="ReceptionEmail"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.ReceptionEmail
              : true
          "
          label="Contact Email"
          width="300"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-if="showDetailIcon" v-slot="props">
            {{ props.row.ReceptionEmail }}
          </template>
        </b-table-column>
        <!-- time zone  -->
        <b-table-column
          field="Timezone"
          :visible="
            Object.keys(getTableHeaders).length > 0
              ? getTableHeaders.Timezone
              : true
          "
          label="Timezone"
          width="300"
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-if="showDetailIcon" v-slot="props">
            {{ props.row.Timezone }}
          </template>
        </b-table-column>
        <!-- actions  -->
        <b-table-column
          field="Actions"
          :visible="true"
          label="Actions"
          v-slot="props"
          width="300"
        >
          <Actions :data="props.row.allData" type="site" />
        </b-table-column>
      </DataTable>
    </section>
  </Layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// actions
import Actions from "@/components/sites/Actions";
import SiteForm from "@/components/sites/SiteForm";
import Modal from "@/components/modal/Modal";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import { sitesColumns } from "@/utils/dataSource";
import DataTable from "@/components/grid/DataTable";
import { exportExel } from "@/utils/mixins/exportMixin";
import UpdatekiosksMultiple from "@/components/sites/UpdatekiosksMultiple";

export default {
  title:"Sites",
  name: "Sites",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    Actions,
    SiteForm,
    Modal,
    ColumnsSwitcher,
    DataTable,
    UpdatekiosksMultiple,
  },
  data() {
    return {
      title: "Sites",
      showDetailIcon: true,
      area: [],
      limitOptions: [5, 10, 25, 50, 100],
      limit: 10,
      areaList: [],
      items: [
        {
          text: "Sites",
          to: { name: "SitesList" },
          active: true,
        },
      ],
      sitesColumns: sitesColumns,
    };
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "getScanDataTypes",
      "getKiosks",
      "getAreas",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("sites", ["getSites", "getSitesWithAreas", "getLoading"]),
    ...mapGetters("compliance", ["getComplianceList"]),
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders", "getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
    rowsData() {
      return this.getSitesWithAreas && this.getSitesWithAreas.length > 0
        ? this.getSitesWithAreas.map((el) => {
            return {
              Name: el.name,
              AreasCount: el.areas_count,
              KiosksCount: el.kiosk_count,
              ReceptionEmail: el.reception_email ? el.reception_email : "-",
              Description: "-",
              Timezone: el.timezone ? el.timezone : "-",
              id: el.id,
              allData: el,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("dailyLogbook", [
      "fetchScanDatatypes",
      "fetchUserTypes",
      "fetchKiosks",
      "fetchAreas",
      "fetchInputTypes",
    ]),
    ...mapActions("grid", [
      "onTableHeader",
      "resetTableHeaders",
      "resetFilterValues",
    ]),
    ...mapActions("sites", ["fetchSiteswithAreas"]),
    ...mapActions("modal", ["setData"]),
    selected(item) {
      this.setData(item);
      this.$router.push({ path: `/${item.Name}/${item.id}` });
    },
    onToggleVisible() {
      this.$bvModal.show("siteColumns");
    },
    renderUpgradeMessage() {
      this.$bvModal.show("upgradeMessage");
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/sites",
        headers: sitesColumns,
      });
    },
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchSiteswithAreas();
    this.getPackageType == "Standalone" &&
      setTimeout(() => {
        this.renderUpgradeMessage();
      }, 1500);
  },
  destroyed() {
    this.resetTableHeaders();
    this.resetFilterValues();
  },
};
</script>

<style lang="scss">
.site-wrapper {
  background-color: #fff;
  .table {
    tbody tr {
      cursor: pointer;
    }
  }
}
</style>
