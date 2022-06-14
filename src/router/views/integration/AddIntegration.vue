<template>
  <Layout>
    <b-modal id="addIntegration" scrollable hide-footer hide-header size="md">
      <AddIntegModal />
    </b-modal>
    <!-- header -->
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <section>
      <b-row>
        <b-col
          cols="6"
          class="int-cards"
          v-for="(card, index) in getDirectoryList"
          :key="index"
        >
          <b-card>
            <b-row class="flex-grow-1">
              <b-col
                cols="2"
                class="d-flex align-items-center img-customization"
              >
                <img
                  :src="card.img_url"
                  alt="directory img"
                  class="img-fluid"
                />
              </b-col>
              <b-col
                cols="8"
                class="text-left d-flex flex-column align-items-baseline"
              >
                <h4 class="card-head">{{ card.name }}</h4>
                <p class="card-text">{{ card.description }}</p>
              </b-col>
              <b-col cols="2" class="d-flex card-icon align-items-center">
                <div
                  class="card-circle"
                  v-b-modal="'addIntegration'"
                  @click="setDataAndReAuth(card)"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.2158 3.98251C21.3137 2.08075 18.8904 0.785715 16.2523 0.261151C13.6143 -0.263414 10.8799 0.0060519 8.39495 1.03547C5.91002 2.0649 3.78613 3.80804 2.29185 6.0445C0.797566 8.28096 0 10.9103 0 13.6C0 16.2897 0.797566 18.9191 2.29185 21.1555C3.78613 23.392 5.91002 25.1351 8.39495 26.1645C10.8799 27.194 13.6143 27.4634 16.2523 26.9389C18.8904 26.4143 21.3137 25.1193 23.2158 23.2175C25.7651 20.666 27.1971 17.2068 27.1971 13.6C27.1971 9.99321 25.7651 6.53398 23.2158 3.98251ZM21.4548 14.5825C21.1875 14.8449 20.8293 14.9942 20.4548 14.9995H15.0328V20.4215C15.0312 20.7971 14.8813 21.1569 14.6157 21.4224C14.3502 21.688 13.9904 21.8379 13.6148 21.8395C13.4281 21.8411 13.243 21.8055 13.0703 21.7348C12.8975 21.6641 12.7406 21.5597 12.6086 21.4278C12.4766 21.2958 12.3722 21.1388 12.3015 20.966C12.2308 20.7933 12.1952 20.6082 12.1968 20.4215V15.0015H6.77581C6.58959 15.0015 6.4052 14.9648 6.23316 14.8936C6.06112 14.8223 5.9048 14.7179 5.77313 14.5862C5.64145 14.4545 5.537 14.2982 5.46574 14.1262C5.39448 13.9541 5.3578 13.7697 5.3578 13.5835C5.3578 13.3973 5.39448 13.2129 5.46574 13.0409C5.537 12.8688 5.64145 12.7125 5.77313 12.5808C5.9048 12.4492 6.06112 12.3447 6.23316 12.2734C6.4052 12.2022 6.58959 12.1655 6.77581 12.1655H12.1978V6.74451C12.1962 6.55785 12.2318 6.37274 12.3025 6.19997C12.3732 6.02721 12.4776 5.87026 12.6096 5.73826C12.7416 5.60627 12.8985 5.50188 13.0713 5.43119C13.244 5.36049 13.4291 5.32491 13.6158 5.32651C13.8025 5.32491 13.9876 5.36049 14.1603 5.43119C14.3331 5.50188 14.4901 5.60627 14.622 5.73826C14.754 5.87026 14.8584 6.02721 14.9291 6.19997C14.9998 6.37274 15.0354 6.55785 15.0338 6.74451V12.1665H20.4558C20.6425 12.1649 20.8276 12.2005 21.0003 12.2712C21.1731 12.3419 21.3301 12.4463 21.4621 12.5783C21.594 12.7103 21.6984 12.8672 21.7691 13.04C21.8398 13.2127 21.8754 13.3978 21.8738 13.5845C21.8492 13.9553 21.7022 14.3074 21.4558 14.5855L21.4548 14.5825Z"
                      fill="#103F5E"
                    />
                  </svg>
                </div>
                <!-- <i
                  v-b-modal="'addIntegration'"
                  class="mdi mdi-plus-circle"
                  @click="setDataAndReAuth(card)"
                ></i> -->
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </section>
    <hr class="mt-1" />
    <section class="white-bg-sec integration-table">
      <div><h5 class="int-grid">Available Integrations</h5></div>
      <DxDataGrid
        id="gridContainer"
        :data-source="rowsData"
        :ref="dataGridRefName"
        :remote-operations="false"
        :showBorders="false"
        :columnAutoWidth="true"
        :allowColumnReordering="true"
        :allowColumnResizing="true"
        :rowAlternationEnabled="true"
        :showColumnLines="true"
        :showRowLines="true"
        :repaint-changes-only="true"
        :two-way-binding-enabled="true"
        :no-data-text="''"
        @row-updated="updateRow($event)"
        @content-ready="contentReady($event)"
        :class="{ 'no-content': rowsData.length <= 0 }"
      >
        <!-- <DxEditing :use-icons="true" :allow-updating="true" :allow-adding="false" :allow-deleting="false" mode="row" /> -->

        <DxPaging :page-size="10" :visible="rowsData.length > 0" />
        <DxPager
          :visible="rowsData.length > 0"
          :allowed-page-sizes="[5, 10, 25, 50, 100, 'all']"
          :display-mode="'full'"
          :show-page-size-selector="true"
          :show-info="true"
          :show-navigation-buttons="true"
        />

        <!-- <DxSelection mode="multiple"/> -->

        <DxFilterRow :visible="true" />
        <!-- <DxFilterRow :visible="true" :apply-filter="currentFilter"/> -->

        <DxHeaderFilter :visible="true" />

        <!-- <DxSearchPanel :visible="true" placeholder="Search..." /> -->

        <DxColumnChooser :enabled="true" mode="select" />

        <DxExport :enabled="true" :allow-export-selected-data="false" />

        <DxToolbar>
          <!-- <DxItem name="columnChooserButton" location="before" /> -->
          <DxItem location="before" template="columnButtonTemplate" />
          <DxItem template="exportButtonTemplate" location="before" />
          <DxItem template="clearAllTemplate" location="before" />
        </DxToolbar>

        <DxGrouping :context-menu-enabled="true" />
        <DxGroupPanel :visible="true" />

        <DxColumn
          data-field="id"
          caption="ID"
          data-type="string"
          css-class="text-center"
        />

        <DxColumn data-field="integrationName" />

        <DxColumn data-field="integrationType" />

        <DxColumn
          data-field="status"
          :calculate-cell-value="getStatus"
          cell-template="status-cell"
        />

        <DxColumn data-field="syncPeriod" />

        <DxColumn data-field="creationDate" />

        <DxColumn data-field="lastSynced" />

        <DxColumn data-field="createdBy" />

        <DxColumn
          caption="Site"
          :calculate-cell-value="getSites"
          :allow-filtering="true"
        />

        <DxColumn
          caption="Actions"
          id="custom-ActionDropDown"
          cell-template="action-cell"
          :allow-filtering="false"
          :allow-exporting="false"
          :allow-editing="false"
          :min-width="200"
          css-class="select-actions custom-ActionDropDown"
        >
          <DxHeaderFilter :allow-search="false" />
        </DxColumn>

        <!-- <template #site-cell="{ data }">
          <div>
            <div
              class="error-value"
              v-for="(key, index) of data.data.requiredError"
              :key="index"
            >
              {{ key }} is required.
            </div>
          </div>
        </template> -->

        <template #clearAllTemplate>
          <div class="clear-cols">
            <div class="custom-line"></div>
            <Button
              text="Clear columns filters"
              @click="clearFilter"
              styling-mode="outlined"
              type="danger"
              class="clear-CustomColums mb-2"
            />
          </div>
        </template>
        <template #exportButtonTemplate>
          <DxDropDownButton
            :items="buttonData"
            class="mb-2"
            text="Export"
            @item-click="onItemClick"
          />
        </template>
        <template #columnButtonTemplate>
          <button
            class="custom-columns mx-1 mb-2"
            @click="dataGrid.showColumnChooser()"
          >
            <span class="custom-text">Columns </span>

            <span class="custom-icon">
              <b-icon icon="caret-down-fill"></b-icon>
            </span>
          </button>
        </template>

        <template #status-cell="{ data }">
          <div
            class="text-700 custom-sizes"
            :class="{
              'text-blue': data.value == 'Draft',
              'text-success': data.value == 'Active',
              'text-danger':
                data.value == 'Active with errors' ||
                data.value == 'Active With Errors' ||
                data.value == 'Inactive' ||
                data.value == 'Authentication Failed' ||
                data.value == 'Authentication failed',
            }"
          >
            {{ data.value }}
          </div>
        </template>

        <template #action-cell="{ data }">
          <div class="custom-scroll">
            <b-dropdown
              class="
                d-flex
                align-items-center
                mx-3
                top-page-btn
                m-md-2
                custom-selectWidth
              "
              variant="primary"
              size="sm"
            >
              <template v-slot:button-content class="">
                <span class="custom-fontActions">Select Actions</span>

                <svg
                  style="margin-left: 8px"
                  width="10"
                  height="5"
                  viewBox="0 0 10 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.91961 4.64098C4.01093 4.74571 4.12395 4.82975 4.25102 4.88734C4.37809 4.94494 4.51622 4.97475 4.65598 4.97475C4.79573 4.97475 4.93384 4.94494 5.06091 4.88734C5.18798 4.82975 5.30103 4.74571 5.39235 4.64098L8.87415 0.810973C9.27819 0.363973 9.11961 0.000975021 8.51254 0.000975126L0.799387 0.000976461C0.193327 0.000976566 0.0337599 0.366974 0.4378 0.810974L3.91961 4.64098Z"
                    fill="white"
                  />
                </svg>
              </template>
              <b-dropdown-item
                @click="viewPage(data.data.id, data.data.integrationName)"
                >View</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                href="#"
                @click="
                  startAutoSync({
                    id: data.data.id,
                    name: data.data.integrationName,
                    redirectToView: true,
                  })
                "
                v-if="data.data.status != 'Expired'"
                >Force Sync</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                href="#"
                @click="
                  redirectUser('error', data.data.id, data.data.integrationName)
                "
                v-if="data.data.status != 'Expired' && data.data.showErrors"
                >See Errors</b-dropdown-item
              >
              <b-dropdown-divider
                v-if="data.data.status != 'Expired' && data.data.showErrors"
              ></b-dropdown-divider>
              <b-dropdown-item href="#" @click="openSyncLogs(data.data)"
                >Sync Logs</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                href="#"
                @click="editIntg(data.data.id, data.data)"
                >Edit</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                v-if="data.data.status == 'Draft'"
                href="#"
                @click="
                  fetchUsersJobStatus({
                    id: data.data.id,
                    saveAndSync: false,
                    continue: true,
                  })
                "
                >Continue</b-dropdown-item
              >
              <b-dropdown-divider
                v-if="data.data.status == 'Draft'"
              ></b-dropdown-divider>
              <b-dropdown-item
                href="#"
                class="red-remove"
                @click="openRemoveWarning(data.data)"
                >Remove</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </template>
      </DxDataGrid>
      <div class="table-extension" v-if="rowsData.length == 0">
        <h4 class="no-int">No integrations yet</h4>
      </div>
    </section>
    <!-- sync logs  -->
    <b-modal
      scrollable
      id="syncLogsModal"
      size="lg"
      hide-header
      hide-footer
      no-close-on-escj
      @hide="$bvModal.hide('syncLogsModal')"
    >
      <div class="modal-height">
        <slot name="modal-header">
          <div class="flex-row">
            <h5 class="modal-title" style="color: #000000">
              <slot name="modal-title" class="">
                <span class=""> Sync Logs </span>
              </slot>
            </h5>
            <div class="header-close-style d-flex align-items-center">
              <!-- <button
                  type="button"
                  class="header-close"
                  aria-label="headerCloseLabel"
                  @click="$bvModal.hide('syncLogsModal')"
                >
                  <span aria-hidden="true">&times;</span>
                </button> -->
              <div class="closing-design">
                <svg
                  @click="$bvModal.hide('syncLogsModal')"
                  style="cursor: pointer"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 0C4.91333 0 0 4.91333 0 11C0 17.0867 4.91333 22 11 22C17.0867 22 22 17.0867 22 11C22 4.91333 17.0867 0 11 0ZM16.5978 14.7156C17.1111 15.2289 17.1111 16.06 16.5978 16.5733C16.3289 16.8422 16.0111 16.9644 15.6689 16.9644C15.3267 16.9644 14.9844 16.8422 14.74 16.5733L11.0733 12.9067L7.38222 16.5733C7.11333 16.8422 6.79556 16.9644 6.45333 16.9644C6.11111 16.9644 5.76889 16.8422 5.52444 16.5733C5.01111 16.06 5.01111 15.2289 5.52444 14.7156L9.21556 11.0244L5.52444 7.35778C5.01111 6.84444 5.01111 6.01333 5.52444 5.5C6.03778 4.98667 6.86889 4.98667 7.38222 5.5L11.0733 9.19111L14.7644 5.5C15.2778 4.98667 16.1089 4.98667 16.6222 5.5C17.1356 6.01333 17.1356 6.84444 16.6222 7.35778L12.9311 11.0489L16.5978 14.7156Z"
                    fill="#F46A6A"
                  />
                </svg>
              </div>
            </div>
          </div>
        </slot>
        <div class="table-style">
          <DxDataGrid
            :data-source="getSyncLogs"
            :remote-operations="false"
            :showBorders="false"
            :columnAutoWidth="true"
            :allowColumnReordering="false"
            :allowColumnResizing="true"
            :rowAlternationEnabled="true"
            :showColumnLines="true"
            :showRowLines="true"
            :wordWrapEnabled="false"
          >
            <!-- <DxEditing :use-icons="true" :allow-updating="true" :allow-adding="false" :allow-deleting="false" mode="row" /> -->

            <DxPaging :page-size="10000" />
            <!-- <DxPager
                :visible="true"
                :allowed-page-sizes="[5, 10, 25, 50, 100, 'all']"
                :display-mode="'full'"
                :show-page-size-selector="true"
                :show-info="true"
                :show-navigation-buttons="true"
              /> -->

            <!-- <DxSelection mode="multiple"/> -->

            <!-- <DxFilterRow :visible="true" /> -->
            <!-- <DxFilterRow :visible="true" :apply-filter="currentFilter"/> -->

            <DxHeaderFilter :visible="true" />

            <!-- <DxSearchPanel :visible="true" placeholder="Search..." /> -->

            <!-- <DxGrouping :context-menu-enabled="true" /> -->
            <!-- <DxGroupPanel :visible="true" /> -->

            <DxColumn data-field="generate_time" caption="Sync Date" />

            <DxColumn data-field="sync_method" caption="Sync Method" />

            <DxColumn
              :calculate-cell-value="getFullName"
              :allow-header-filtering="true"
              :allow-sorting="true"
              caption="By Whom"
            />

            <DxColumn caption="Action" cell-template="action-cell" />

            <template #action-cell="{ data }">
              <b-button
                pill
                class="d-flex align-items-center px-3 top-page-btn"
                variant="primary"
                size="sm"
                @click="download(data.data)"
              >
                Download
              </b-button>
            </template>
          </DxDataGrid>
          <!-- <table
              class="table table-striped table-borderless"
              style="margin-top: 40px"
            >
              <thead>
                <tr
                  style="
                    border-bottom: 20px solid white !important;
                    border-radius: 5px;
                  "
                >
                  <th scope="col " style="text-align: left; width: 10rem">
                    <sort-link name="id">Sync Date</sort-link>
                  </th>
                  <th scope="col" style="text-align: left; width: 10rem">
                    <sort-link name="name">Sync Method</sort-link>
                  </th>
                  <th scope="col" style="text-align: left; width: 10rem">
                    <sort-link name="hits">By Whom</sort-link>
                  </th>
                  <th scope="col" style="text-align: left; width: 10rem">
                    <sort-link name="hits">Actions</sort-link>
                  </th>
                </tr>
              </thead>
              <template>
                <tbody>
                  <tr
                    style="border-bottom: 20px solid white !important"
                    v-for="(log, index) in getSyncLogs"
                    :key="index"
                  >
                    <td style="">{{ log.generate_time }}</td>
                    <td>{{ log.sync_method }}</td>
                    <td>
                      {{ log.run_by.first_name }} {{ log.run_by.last_name }}
                    </td>
                    <td>
                      <b-button
                        pill
                        class="d-flex align-items-center px-3 top-page-btn"
                        variant="primary"
                        size="sm"
                        @click="download(log)"
                      >
                        Download
                      </b-button>
                    </td>
                  </tr>
                </tbody>
              </template>
            </table> -->
        </div>
      </div>
    </b-modal>

    <!-- warning  -->
    <b-modal
      id="removeIntegration"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="removeIntegration"
    >
      <slot name="modal-header">
        <div class="modalHeader">
          <h4 class="modal-title">
            <slot name="modal-title"> Remove Integration </slot>
          </h4>
        </div>
      </slot>
      <div class="d-block text-center modal-cusomContent">
        <p class="modal-paragraph">
          Are you sure you want to<span class="bold-word">“Remove”</span>the
          integration {{ intgName }}?
        </p>
      </div>
      <div class="line"></div>
      <div class="action-btns">
        <b-button
          variant="primary"
          type="button"
          pill
          style="margin-right: 31px !important"
          class="text-center modal-buttonSize"
          @click="$bvModal.hide('removeIntegration')"
        >
          <!-- <i
              v-if="getLoading"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
            ></i> -->
          <span>Cancel</span>
        </b-button>

        <b-button
          variant="outline-danger"
          type="button"
          pill
          class="text-center modal-buttonSize"
          @click="deleteIng()"
        >
          <!-- <i
              v-if="getLoading"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
            ></i> -->
          <span>Remove</span>
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>
<script>
import moment from "moment";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import DataTable from "@/components/grid/DataTable";
import AddIntegModal from "@/components/integration/AddIntegModal";
import router from "../../../router/index";
import { mapActions, mapGetters } from "vuex";
const dataGridRefName = "dataGrid";
// import DxSelectBox from 'devextreme-vue/select-box';
import { default as Button } from "devextreme-vue/button";
import DxDropDownButton from "devextreme-vue/drop-down-button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import "whatwg-fetch";
import DxDataGrid, {
  // DxMasterDetail,
  DxColumn,
  // DxLookup,
  DxFilterRow,
  DxHeaderFilter,
  // DxSearchPanel,
  DxColumnChooser,
  DxExport,
  DxToolbar,
  DxItem,
  DxPaging,
  DxPager,
  DxGrouping,
  DxGroupPanel,
} from "devextreme-vue/data-grid";
export default {
  title: "Integration",
  components: {
    // DxSelectBox,
    Layout,
    PageHeader,
    // DataTable,
    AddIntegModal,
    DxDataGrid,
    // DxMasterDetail,
    DxColumn,
    // DxLookup,
    DxFilterRow,
    DxHeaderFilter,
    DxPaging,
    DxPager,
    DxGrouping,
    DxGroupPanel,
    // DxSearchPanel,
    DxColumnChooser,
    DxExport,
    DxToolbar,
    DxItem,
    Button,
    DxDropDownButton,
  },
  data() {
    return {
      buttonData: ["Excel", "CSV", "PDF"],
      intgName: "",
      intgId: "",
      getSyncLogs: [],
      showSubmenuModes: [
        {
          name: "onHover",
          delay: { show: 0, hide: 500 },
        },
        {
          name: "onClick",
          delay: { show: 0, hide: 300 },
        },
      ],
      title: "Add integration",
      cards: [],
      dataGridRefName,
    };
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    ...mapActions("integration", [
      "fetchDirectoryList",
      "fetchGridIntegrationData",
      "deleteIntegration",
      "resetIntgData",
      "awaitIntegrationWithMapping",
      "setReAuth",
      "editIntegration",
      "startAutoSync",
      "fetchUsersJobStatus",
    ]),

    setDataAndReAuth(data) {
      this.setData(data);
      this.setReAuth(false);
    },

    getFullName(rowData) {
      return rowData.run_by
        ? rowData.run_by.first_name + " " + rowData.run_by.last_name
        : "";
    },

    async checkErrs(data) {
      try {
        const response = await this.$http.get(
          `${process.env.VUE_APP_BASE_URL}/api/integration/${data.id}/statistics`
        );
        console.log("resp", data.id, response);
        return data.status != "Expired" && response.errors;
      } catch (error) {
        console.log(error);
      }
    },

    viewPage(id, name) {
      console.log("rer", name, id);
      this.awaitIntegrationWithMapping({ id, name, redirect: true });
    },

    async redirectUser(data, id, name) {
      console.log("id", id);
      await this.$store.commit("integration/setIntegId", id);
      await this.$store.dispatch("integration/setFromView", true);
      await this.$store.commit("integration/setIntgDataMapping", {
        name: name,
      });
      router.push("/integration-" + data);
    },

    editIntg(id, data) {
      this.setData(data);
      this.editIntegration(id);
    },

    openRemoveWarning(data) {
      this.intgName = data.integrationName;
      this.intgId = data.id;
      this.$bvModal.show("removeIntegration");
    },

    deleteIng() {
      this.deleteIntegration(this.intgId);
      this.$bvModal.hide("removeIntegration");
    },

    async openSyncLogs(data) {
      try {
        const response = await this.$http.get(
          `${process.env.VUE_APP_BASE_URL}/api/integration/SyncLogs/${data.id}`
        );
        console.log("resp", data.id, response);
        this.getSyncLogs = response;
        console.log("getSyncLogs", this.getSyncLogs);
        this.$bvModal.show("syncLogsModal");
      } catch (error) {
        console.log(error);
      }
    },

    download(log) {
      window.open(`${process.env.VUE_APP_BASE_URL}/${log.file_name}`, "_blank");
    },

    getSites(rowData) {
      return rowData.sites.map((x) => x.name).join(" - ");
    },

    getStatus(rowData) {
      return rowData.status;
    },

    actionChanged(action, data) {
      console.log(action, data);
    },

    onItemClick(e) {
      if (e.itemData == "Excel") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");
        exportDataGrid({
          component: this.dataGrid,
          worksheet: worksheet,
          customizeCell: function (options) {
            const excelCell = options;
            excelCell.font = { name: "Arial", size: 12 };
            excelCell.alignment = { horizontal: "left" };
          },
        }).then(function () {
          workbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              "Integrations.xlsx"
            );
          });
        });
        // e.cancel = true;
      } else if (e.itemData == "CSV") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");

        exportDataGrid({
          component: this.dataGrid,
          worksheet: worksheet,
          customizeCell: function (options) {
            const excelCell = options;
            excelCell.font = { name: "Arial", size: 12 };
            excelCell.alignment = { horizontal: "left" };
          },
        }).then(function () {
          workbook.csv.writeBuffer().then(function (buffer) {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              "Integrations.csv"
            );
          });
        });
      } else if (e.itemData == "PDF") {
        const doc = new jsPDF();
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: this.dataGrid,
        }).then(() => {
          doc.save("Integrations.pdf");
        });
      }
    },

    clearFilter() {
      this.$refs[this.dataGridRefName].instance.clearFilter();
    },

    contentReady() {
      this.setColumnChooserPosition();
    },

    setColumnChooserPosition() {
      // this.dataGrid.showColumnChooser();
      console.log("columnChooserView");

      var columnChooserView = this.dataGrid.getView("columnChooserView");

      if (!columnChooserView._popupContainer) {
        columnChooserView._initializePopupContainer();
        columnChooserView.render();
      }

      columnChooserView._popupContainer.option("position", {
        of: this.dataGrid.element(),
        my: "left top",
        at: "left top",
        offset: "0 50",
      });
    },
  },
  computed: {
    ...mapGetters("integration", [
      "getDirectoryList",
      "getGridIntegrationData",
    ]),
    getDataCount() {
      console.log("count");
      return false;
    },
    rowsData() {
      console.log("rowsada", this.getGridIntegrationData);
      return this.getGridIntegrationData &&
        this.getGridIntegrationData.length > 0
        ? this.getGridIntegrationData.map((el) => {
            return {
              id: el.id,
              integrationName: el.name,
              integrationType: el.directory ? el.directory.name : el.dir_code,
              status: el.status,
              syncPeriod: el.sync_setting ? el.sync_setting.sync_time : "",
              creationDate: moment(new Date(el.created_at)).format(
                "DD-MM-YYYY, h:mm:ss A"
              ),
              lastSynced: el.last_sync
                ? moment(new Date(el.last_sync + " UTC")).format(
                    "DD-MM-YYYY, h:mm:ss A"
                  )
                : "",
              createdBy: el.created_by ? el.created_by.fullName : "",
              sites: el.sites,
              showErrors: el.showErrors,
            };
          })
        : [];
    },
    dataGrid() {
      return this.$refs[this.dataGridRefName].instance;
    },
  },
  beforeMount() {
    this.fetchDirectoryList();
    this.fetchGridIntegrationData();
    this.resetIntgData();
    console.log(this.getDirectoryList);
  },
  created() {
    // document.addEventListener("mousedown", (e) => {
    //   if (e.path) {
    //     // console.log("path", e.path);
    //     let isColumnChooser = false;
    //     for (let i = 0; i < e.path.length; i++) {
    //       if (typeof e.path[i].matches == "function") {
    //         if (e.path[i].matches(".dx-overlay-content")) {
    //           isColumnChooser = true;
    //         }
    //       }
    //     }
    //     if (!isColumnChooser) this.dataGrid.hideColumnChooser();
    //   }
    // });
  },
};
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-left: 0px !important;
  width: 566px;
  height: 138px;
}
.card-body {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
}
.card-icon {
  padding-right: 0 !important;
  padding-left: 0 !important;
  display: flex;
  justify-content: center;
}
.int-cards {
  .card-head {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 17px;
    letter-spacing: 0.25px;
    text-transform: uppercase;
    color: #000000;
  }
  .card-text {
    font-family: "Lato";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 154%;
    color: rgba(0, 0, 0, 0.28);
  }
}
.img-customization {
  width: 67px;
  height: 67px;
  & img {
    height: 67px !important;
  }
}
.table-extension {
  width: 100% !important;
  height: 120px !important;
  background: white !important;
  text-align: center !important;
  // padding-top:84px!important;
  h4.no-int {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #495057;
    padding-bottom: 22px;
  }
}

.custom-line {
  width: 1px;
  height: 27px;
  opacity: 0.08;
  background: #000000;
  opacity: 0.08;
  position: absolute;
  right: 48% !important;
}
.custom-sizes {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 19px !important;

  .text-danger {
    color: #f46a6a !important;
  }
  .text-success {
    color: #34c38f;
  }
  .text-blue {
    color: #2680eb !important;
  }
}

// .header-close-style {
//   width: 22px;
//   height: 22px;
//   border-radius: 50%;
//   justify-content: center;
//   justify-items: center;
//   left: 70.21%;
//   right: 28.26%;
//   top: 33.67%;
//   bottom: 63.89%;

//   background: #f46a6a !important;
// }

.header-close:active {
  outline: none;
}

.text-700 {
  font-weight: 700;
}
.text-blue {
  color: #2680eb;
}

h4 {
  font-weight: bold;
  color: black;
}
h5.int-grid {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  // margin-left:30px;
  margin-bottom: 0 !important;
  color: #495057;
}

p {
  font-size: 12px;
  color: #b9b7b7;
}
.last_sync {
  font-weight: 400;
  color: #b9b7b7;
}
img {
  height: 42px;
}
.mdi-plus-circle {
  font-size: 24px;
  color: #103f5e;
}
.white-bg-sec {
  background-color: white;
  padding-left: 30px;
  padding-top: 32px;
}
.grid-wrapper.border {
  border: 0px !important;
}
.table thead th {
  color: #939393;
  background-color: #f8f9fa;
  border-radius: 5px;
  border-bottom: 0px;
}
.modal-content .modal-body {
  padding: 40px 82px 20px;
}
.modal-content {
  overflow: scroll !important;
}
.table th,
.table td {
  border-top: 0px;
  border-radius: 5px;
}
.table-style {
  width: 100% !important;
}
.header-close {
  color: #f2f2f2;
  font-weight: bold !important;
  background-color: transparent;
  border: none;
}

.header-close:active {
  outline: none;
}

h5.modal-title {
  width: 100%;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700 !important;
  font-size: 20px !important;
  line-height: 20px !important;
  text-align: center !important;
  letter-spacing: 0.25px !important;
  color: #000000 !important;
}
</style>
<style lang="scss">
div#gridContainer {
  min-height: 500px !important;
}
button.custom-columns.mx-1.mb-2.dx-template-wrapper.dx-item-content.dx-toolbar-item-content {
  margin-left: 0 !important;
}
.dx-datagrid-header-panel {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.custom-ActionDropDown {
  ul.dropdown-menu.show {
    li.red-remove a {
      color: #f46a6a !important;
      padding-bottom: 10px !important;
    }
    align-items: center !important;
    background: #ffffff !important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
    border-radius: 6px !important;
    text-align: center !important;
    min-width: 142px !important;
    max-height: 179px !important;
    margin-top: 6px !important;
    overflow-y: scroll;
  }
  a.dropdown-item {
    margin: auto !important;
    font-family: "Lato";
    font-style: normal;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 19px !important;
    text-align: center !important;
    color: #787878 !important;
    padding-right: 24px !important;
  }
  .dropdown-menu.show::-webkit-scrollbar {
    width: 6px;
  }
  .dropdown-menu.show::-webkit-scrollbar-track {
    background: #34c38f;
    border-radius: 0px 0px 10px 0px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .dropdown-menu.show::-webkit-scrollbar-thumb {
    background: #787878;

    border-radius: 10px;
  }
}

div#syncLogsModal___BV_modal_content_ {
  //  width:1000px!important;
}
div#removeIntegration___BV_modal_content_ {
  width: 579px !important;
  height: 275.38px !important;
  h4.modal-title {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 19px !important;
    text-align: center !important;
    color: #787878 !important;
    padding-right: 24px !important;
  }
  .dropdown-menu.show::-webkit-scrollbar {
    width: 5px;
    .dropdown-menu.show::-webkit-scrollbar-track {
      background: #787878;
      border-radius: 0px 0px 10px 0px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    .dropdown-menu.show::-webkit-scrollbar-thumb {
      background: #34c38f;
      border-radius: 10px;
    }
  }

  div#removeIntegration___BV_modal_content_ {
    width: 579px !important;
    height: 275.38px !important;
    h4.modal-title {
      font-family: "Lato";
      font-style: normal;
      font-weight: 700;
      font-size: 17px;
      line-height: 20px;
      color: #000000;
      text-align: left;
      margin-bottom: 35px !important;
    }
    .modal-paragraph {
      font-family: "Lato";
      font-style: normal;
      font-weight: 400;
      font-size: 20px !important;
      line-height: 26px;
      text-align: center;
      letter-spacing: 0.25px;
      color: #939393;
      margin-bottom: 35px;
      .bold-word {
        font-weight: 700 !important;
      }
    }

    .line {
      width: 488.16px !important;
      height: 1px !important;
      opacity: 0.15;
      background: #707070;
    }
    .modal-buttonSize {
      width: 111.69px !important;
      height: 33.26;
      margin-top: 20px !important;
      margin-bottom: 19.75px !important;
    }
  }
}
</style>