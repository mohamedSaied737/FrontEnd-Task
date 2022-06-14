<template>
  <Layout>
    <Modal :title="'View List Settings'" modalID="areasColumns">
      <template>
        <ColumnsSwitcher
          :tableHeaders="getTableHeaders"
          url="/areas"
          modalID="areasColumns"
          :fetchTableHeaders="fetchTableHeaders"
        />
      </template>
    </Modal>
    <!-- update area  -->
    <b-modal id="updateArea" scrollable hide-footer hide-header size="lg">
      <UpdateArea />
    </b-modal>
    <!-- move area  -->
    <b-modal id="moveArea" hide-footer hide-header size="lg">
      <MoveArea />
    </b-modal>
    <!-- move kiosk  -->
    <b-modal id="moveKiosk" hide-footer hide-header size="lg">
      <MoveKiosk />
    </b-modal>
    <!-- change journey  -->
    <b-modal id="changeJourney" hide-footer hide-header no-close-on-esc size="md">
      <ChangeJourney />
    </b-modal>
    <!-- update app  -->
    <b-modal id="updateApp" hide-footer hide-header size="lg">
      <UpdateApp />
    </b-modal>
    <!-- kiosk info  -->
    <b-modal id="kioskInfo" hide-footer hide-header size="lg">
      <KioskInfo />
    </b-modal>
    <!-- refresh face library  -->
    <b-modal id="refreshFaceLibrary" hide-footer hide-header size="lg">
      <RefreshFaceLibrary />
    </b-modal>
    <!-- register kiosk  -->
    <b-modal id="registerKiosk" hide-footer hide-header size="lg">
      <RegisterKiosk />
    </b-modal>
    <!-- register multi kiosks  -->
    <b-modal id="registerMultiKiosks" hide-footer hide-header size="lg">
      <RegisterMultipleKiosks />
    </b-modal>
    <!-- update kiosk  -->
    <b-modal id="updateKiosk" hide-footer hide-header size="lg" scrollable>
      <UpdateKiosk />
    </b-modal>
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
    <!-- add kiosk  -->
    <b-modal id="addKiosk" scrollable hide-footer hide-header size="lg">
      <AddKiosk />
    </b-modal>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between mb-3"
    >
      <div class="page-title-right mb-2 d-flex">
        <b-button
          pill
          class="d-flex align-items-center px-3 mx-3 top-page-btn"
          variant="primary"
          size="sm"
          v-b-modal="'updateArea'"
          @click="setData({}); $store.commit('sites/setIsSignInOutMode', false)"
          :disabled="getPackageType == 'Standalone'"
        >
          <i class="bx bx-plus font-size-18 mr-2"></i>
          Add Area
        </b-button>
        <b-button
          pill
          class="d-flex align-items-center px-3 top-page-btn"
          variant="outline-primary"
          size="sm"
          v-b-modal="'addKiosk'"
          @click="setData({})"
        >
          <i class="bx bx-plus font-size-18 mr-2"></i>
          Add Kiosk
        </b-button>
      </div>
    </PageHeader>
    <b-alert
      v-if="getPackageType == 'Standalone'"
      show
      dismissible
      variant="warning"
    >
      <i class="mdi mdi-alert-outline mr-2"></i>You have limited access to
      dashboard features, to gain full access please contact our customer
      service team at
      <a href="mailto:cs@lamasatech.com" class="font-weight-bold"
        >cs@lamasatech.com</a
      >
      to upgrade to one of our cloud packages.
    </b-alert>
    <section class="site-wrapper">
      <Breadcrumb :items="items" />
      <!-- grid settings   -->
      <GridSettings
        :rowsData="rowsData"
        :onToggleVisible="onToggleVisible"
        :columns="getExportHeaders"
        :showExport="false"
        :limit="limit"
        :updatePageRecords="updatePageRecords"
      />
      <!-- grid table  -->
      <div class="grid-wrapper">
        <b-table
          :data="rowsData"
          ref="table"
          :mobile-cards="false"
          detailed
          :default-sort="['name', 'asc']"
          detail-key="id"
          :show-detail-icon="showDetailIcon"
          :opened-detailed="['39b808ff-0b9d-391f-a7d8-68322f774858']"
          :row-class="
            (row, index) =>
              row.Children.length > 0 || row.Kiosk.length > 1
                ? ''
                : 'hide-arrow-icon-detail'
          "
          :header-checkable="false"
          paginated
          pagination-rounded
          :per-page="limit"
          :current-page.sync="currentPage"
        >
          <template slot="empty">
            <h5 class="text-center my-2 text-muted">No matching data..</h5>
          </template>
          <!-- name  -->
          <b-table-column
            field="Area_Name"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Area_Name
                : true
            "
            label="Area"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'area',
                  name: 'name',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap text-capitalize">{{
                props.row.Area_Name
              }}</span>
            </template>
          </b-table-column>
          <b-table-column
            field="Login Mode"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Login_Mode
                : true
            "
            label="Login Mode"
            width="200"
          >
            <template v-slot="props">
              <span class="no-wrap text-capitalize">
              {{  props.row.Login_Mode }}</span>
            </template>
          </b-table-column>
          <!-- kiosk name  -->
          <b-table-column
            field="Kiosk_Name"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Kiosk_Name
                : true
            "
            label="Kiosk"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'kiosk',
                  name: 'name',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">{{ props.row.Kiosk_Name }}</span>
            </template>
          </b-table-column>
          <!-- journey name  -->
          <b-table-column
            field="Journey"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Journey
                : true
            "
            label="Journey"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'area',
                  name: 'journey',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">{{ props.row.Journey }}</span>
            </template>
          </b-table-column>
          <!-- android serial  -->
          <b-table-column
            field="Android_Serial"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Android_Serial
                : true
            "
            label="Android Serial"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'kiosk',
                  name: 'android_serial',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">{{ props.row.Android_Serial }}</span>
            </template>
          </b-table-column>
          <!-- lamasatech_serial  -->
          <b-table-column
            header-class="no-wrap"
            field="Lamasatech_Serial"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Lamasatech_Serial
                : true
            "
            label="LamasaTech Serial"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'kiosk',
                  name: 'lamasatech_serial ',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">{{ props.row.Lamasatech_Serial }}</span>
            </template>
          </b-table-column>
          <!-- mac_address  -->
          <b-table-column
            field="Mac_Address"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Mac_Address
                : true
            "
            label="Mac Address"
            searchable
            width="200"
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'kiosk',
                  name: 'mac_address',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">{{ props.row.Mac_Address }}</span>
            </template>
          </b-table-column>
          <!-- status  -->
          <b-table-column
            field="Status"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Status
                : true
            "
            label="Status"
            width="200"
            searchable
          >
            <template slot="searchable">
              <SearchInput
                type="selectInput"
                :selectAction="fetchAreasFilter"
                :paramsKey="{
                  site_id: this.$route.params.id,
                  type: 'kiosk',
                  name: 'kiosk_status',
                }"
                :options="statusOptions"
              />
            </template>
            <template v-slot="props">
              <span v-if="props.row.Status == 'Multiple'">{{
                props.row.Status
              }}</span>
              <span v-if="!props.row.Status" class="text-warning no-wrap"
                >Not Synced</span
              >
              <span
                v-if="props.row.Status && props.row.Status == 1"
                class="text-green no-wrap"
                >Online</span
              >
              <span
                v-if="props.row.Status && props.row.Status == 0"
                class="text-red no-wrap"
                >Off-line since {{ props.row.LastSync }}</span
              >
            </template>
          </b-table-column>
          <!-- Pre_Registration_URL  -->
          <!-- <b-table-column
            field="Pre_Registration_URL"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.Mac_Address
                : true
            "
            label="Pre-registration URL"
            width="200"
          >
            <template v-slot="props">
              <router-link
                v-if="
                  props.row.Pre_Registration_URL &&
                  props.row.Pre_Registration_URL !== '-'
                "
                :to="`/${pre_reg_url}/${props.row.Pre_Registration_URL}`"
                target="_blank"
                class="area-register-url"
              >
                {{
                  `${domain_env}/${pre_reg_url}/${props.row.Pre_Registration_URL}`
                }}
              </router-link>
              <p
                v-if="
                  !props.row.Pre_Registration_URL ||
                  props.row.Pre_Registration_URL === '-'
                 "
              >
                -
              </p>
            </template>
          </b-table-column> -->

          <!-- area actions  -->
          <b-table-column
            field="Actions"
            :visible="true"
            label="Area Settings"
            v-slot="props"
            width="200"
          >
            <Actions :data="props.row.Area" type="area" />
          </b-table-column>
          <!-- Kiosk actions  -->
          <b-table-column field="Actions" label="Kiosk Settings" width="200">
            <template v-slot:header="{ column }">
              <Actions
                v-if="getSelectedRows.length > 1"
                :data="getSelectedRows"
                type="multi"
              />
              <span class="is-relative no-warp" :label="column.label" v-else>{{
                column.label
              }}</span>
            </template>
            <template v-slot="props">
              <Actions
                v-if="
                  props.row.Kiosk.length > 0 &&
                  props.row.Kiosk_Name != 'Multiple'
                "
                :data="props.row.Kiosk[0]"
                type="kiosk"
              />
            </template>
          </b-table-column>
          <!-- details     -->
          <template #detail="props">
            <KioskGrid
              v-if="props.row.Kiosk.length > 1"
              :kiosks="props.row.Kiosk"
              :journey="props.row.Journey"
            />
            <ChildrenLevel1
              v-if="props.row && props.row.Children.length > 0"
              :areaData="props.row.Children"
              :getTableHeaders="getTableHeaders"
            />
          </template>
        </b-table>
      </div>
    </section>
    <!-- daemon logs per kiosk  -->
    <b-modal id="kioskDaemonLogs" hide-footer hide-header size="xl" scrollable>
      <KioskDaemonLogs />
    </b-modal>
  </Layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
// actions
import Actions from "@/components/sites/Actions";
import UpdateArea from "@/components/sites/UpdateArea";
import MoveArea from "@/components/sites/MoveArea";
import MoveKiosk from "@/components/sites/MoveKiosk";
import ChangeJourney from "@/components/sites/ChangeJourney";
import UpdateApp from "@/components/sites/UpdateApp";
import KioskInfo from "@/components/sites/KioskInfo";
import RefreshFaceLibrary from "@/components/sites/RefreshFaceLibrary";
import RegisterKiosk from "@/components/sites/RegisterKiosk";
import RegisterMultipleKiosks from "@/components/sites/RegisterMultipleKiosks";
import UpdateKiosk from "@/components/sites/UpdateKiosk";
import UpdatekiosksMultiple from "@/components/sites/UpdatekiosksMultiple";
import AddKiosk from "@/components/sites/AddKiosk";
import Modal from "@/components/modal/Modal";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import { areasColumns } from "@/utils/dataSource";
import ChildrenLevel1 from "./ChildrenLevel1";
import KioskGrid from "./KioskGrid";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import SearchInput from "@/components/sites/SearchInput";
import PageHeader from "@/components/page-header";
import { exportExel } from "@/utils/mixins/exportMixin";
import GridSettings from "@/components/grid/GridSettings";
import { maxLength } from "vuelidate/lib/validators";
import KioskDaemonLogs from "@/components/sites/KioskDaemonLogs";

export default {
  title: "Areas - Kiosks",
  name: "Areas",
  mixins: [exportExel],
  components: {
    PageHeader,
    Layout,
    Actions,
    UpdateArea,
    MoveArea,
    MoveKiosk,
    ChangeJourney,
    UpdateApp,
    KioskInfo,
    RefreshFaceLibrary,
    UpdateKiosk,
    AddKiosk,
    Modal,
    ColumnsSwitcher,
    KioskGrid,
    Breadcrumb,
    SearchInput,
    ChildrenLevel1,
    UpdatekiosksMultiple,
    GridSettings,
    RegisterKiosk,
    RegisterMultipleKiosks,
    KioskDaemonLogs,
  },
  data() {
    return {
      title: "Areas",
      showDetailIcon: true,
      site: null,
      area: [],
      limit: 10,
      currentPage: 1,
      statusOptions: ["online", "offline", "Not Synced"],
      columns: {
        "Site Name": "Site",
        "Area Name": "Area_Name",
        "Login Mode" : "Login_Mode",
        "Kiosk Name": "Kiosk_Name",
        "Android Serial": "Android_Serial",
        "Mac Address": "Mac_Address",
        "Lamasatech Number": "Lamasatech_Serial",
      },
      areaList: [],
      currentSite: null,
      gridSpinner: false,
      items: [
        {
          text: "SITES",
          to: { name: "sitesList" },
        },
        {
          text: this.$route.params.site.toUpperCase(),
          to: { name: "sitesList" },
          active: true,
        },
      ],
      areasColumns: areasColumns,
      domain_env: process.env.VUE_APP_DOMAIN,
      pre_reg_url: process.env.VUE_APP_PRE_REGISTRATION_URL,
    };
  },
  validations: {
    Area_Name: {
      maxLength: maxLength(20),
    },
    Area_Description: {
      maxLength: maxLength(255),
    },
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "getScanDataTypes",
      "getKiosks",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("sites", [
      "getSites",
      "getSitesWithAreas",
      "getAreas",
      "getAreasFilter",
    ]),
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders", "getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
    rowsData() {
      console.log('rowsdata', this.getAreasFilter);
      return this.getAreasFilter && this.getAreasFilter.length > 0
        ? this.getAreasFilter.map((area) => {
            return {
              id: area.id,
              Area_Name: area.name,
              Kiosk_Name:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.name).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.name).toString()
                  : "-",
              Login_Mode:
                area.loginMode
                  ?  area.loginMode
                  : "-" ,
              Journey: area.journey.name,
              Android_Serial:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.android_serial).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.android_serial).toString()
                  : "-",
              Lamasatech_Serial:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.lamasatech_serial).length >
                    1
                    ? "Multiple"
                    : area.kiosk
                        .map((kiosk) => kiosk.lamasatech_serial)
                        .toString()
                  : "-",
              Mac_Address:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.mac_address).length > 1
                    ? "Multiple"
                    : area.kiosk.map((kiosk) => kiosk.mac_address).toString()
                  : "-",
              Status:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.kiosk_sync_infs.status)
                      .length > 1
                    ? "Multiple"
                    : area.kiosk
                        .map((kiosk) => kiosk.kiosk_sync_infs.status)
                        .toString()
                  : "-",
              Pre_Registration_URL: area.pre_registration_url
                ? area.pre_registration_url
                : "-",
              Site: this.$route.params.name,
              Children: area.children,
              Kiosk: area.kiosk,
              Area: area,
              LastSync:
                area.kiosk.length > 0
                  ? area.kiosk.map((kiosk) => kiosk.kiosk_sync_infs.last_sync)
                      .length > 1
                    ? "Multiple"
                    : area.kiosk
                        .map((kiosk) => kiosk.kiosk_sync_infs.last_sync)
                        .toString()
                  : "-",
            };
          })
        : [];
    },
    siteId() {
      return this.$route.params.id;
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
      "resetSelectedRows",
      "onSelectedRows",
    ]),
    ...mapActions("sites", [
      "fetchSiteswithAreas",
      "fetchAreasBySite",
      "fetchAreasFilter",
    ]),
    ...mapActions("modal", ["setData"]),
    setActionData(kiosk) {
      this.setData({
        kiosk,
      });
    },
    ...mapActions("userType", ["fetchRegistrationTypes"]),
    onToggleVisible() {
      this.$bvModal.show("areasColumns");
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/areas",
        headers: areasColumns,
      });
    },
    updatePageRecords(value) {
      this.limit = value;
    },
  },
  beforeMount() {
    this.fetchTableHeaders();
    this.fetchAreasFilter({
      id: this.$route.params.id,
      filterBy: [],
    });
  },
  destroyed() {
    this.resetTableHeaders();
    this.resetSelectedRows();
  },
};
</script>

<style lang="scss">
.site-wrapper {
  .area-register-url {
    cursor: pointer;
    color: #0e5491;
  }
  .table-wrapper {
    background-color: #fff;
    overflow: auto;
    min-height: 165px;
  }
  .site-header,
  .selected-site {
    background-color: #fff;
  }
  .table .detail td:first-child {
    padding: 0;
  }
  .b-table .table tr.detail .detail-container {
    padding: 0 !important;
  }
  .hide-arrow-icon-detail a[role="button"] {
    display: none;
  }
  background-color: #fff;
  .details-item {
    height: 60px;
  }
  .icon {
    font-size: 1rem;
  }
}
</style>
