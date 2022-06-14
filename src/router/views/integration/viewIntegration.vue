<template>
  <Layout>
    <b-modal id="addIntegration" scrollable hide-footer hide-header size="lg">
      <AddIntegModal />
    </b-modal>

    <Breadcrumb style="background-color: transparent" :items="items" />

    <section class="white-bg-sec">
      <b-row>
        <b-col cols="8" class="mb-3">
          <b-row>
            <b-col cols="2" class="d-flex align-items-center">
              <img :src="imgUrl" alt="directory img" height="42" />
            </b-col>
            <b-col
              cols="5"
              class="text-left d-flex flex-column align-items-baseline"
            >
              <h3>{{ getIntgDataMapping.name }}</h3>
              <p>{{ tenantId }}</p>
              <p
                class="custom-sizes"
                :class="{
                  'text-blue': getIntgStatus == 'Draft',
                  'text-success': getIntgStatus == 'Active',
                  'text-danger':
                    getIntgStatus == 'Active with errors' ||
                    getIntgStatus == 'Active With Errors' ||
                    getIntgStatus == 'Inactive' ||
                    getIntgStatus == 'Authentication Failed' ||
                    getIntgStatus == 'Authentication failed',
                }"
              >
                {{ getIntgStatus }}
              </p>
              <p class="last_sync" v-if="getIntgStatus != 'Draft'">
                Last synced
                {{ convertToBrowserTime(getIntgDataMapping.last_sync) }}
              </p>
            </b-col>
            <b-col cols="5" class="align-items-center">
              <!-- <div class="page-title-right mb-2 d-flex"> -->
              <b-button
                pill
                class="d-flex align-items-center px-3 top-page-btn"
                variant="primary"
                size="sm"
                style="margin-bottom: 18px"
                v-if="getIntgStatus != 'Authentication failed'"
                :disabled="getLoading"
                @click="
                  startAutoSync({
                    id: getIntegId,
                    name: $route.params.integName,
                    redirectToView: false,
                  })
                "
              >
                <!-- <i class="bx bx-plus font-size-18 mr-2"></i> -->
                <div class="sync-icon px-2">
                  <b-icon icon="arrow-repeat "></b-icon>
                </div>
                Force Sync Now
              </b-button>
              <b-button
                pill
                class="d-flex new-width custom-primary"
                variant="outline-primary"
                size="sm"
                style="margin-bottom: 18px"
                v-if="getIntgStatus == 'Inactive'"
                @click="showModal('Active', 'Reactivate', 'reactivating')"
              >
                Reactivate
              </b-button>

              <b-button
                pill
                class="d-flex new-width"
                variant="primary"
                size="sm"
                v-if="getIntgStatus == 'Authentication failed'"
                v-b-modal="'addIntegration'"
                @click="reAuthenticate()"
              >
                Re-authenticate
              </b-button>

              <b-button
                pill
                class="d-flex new-width custom-danger"
                variant="outline-danger"
                size="sm"
                v-if="
                  getIntgStatus == 'Active' ||
                  getIntgStatus == 'Active with errors'
                "
                @click="showModal('Inactive', 'Deactivate', 'deactivating')"
              >
                Deactivate
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <div class="break"></div>

      <b-row>
        <b-col cols="7">
          <b-row>
            <b-col cols="2"></b-col>
            <b-col cols="5">
              <div>
                <h5 class="">Mapped Fields</h5>
              </div>
            </b-col>
          </b-row>
        </b-col>

        <b-col cols="5">
          <div>
            <h5 class="">Mapped Groups</h5>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="7">
          <b-row>
            <b-col cols="2"></b-col>

            <b-col cols="4">
              <div
                v-for="field in getIntgDataMapping.fields_mappings"
                :key="field.id"
                class="d-flex justify-content-between mb-2 mapping-fields"
              >
                <b-form-input
                  v-if="field.dir_fields.obj_Name !== 'id'"
                  class="grouping"
                  :value="field.dir_fields.display_Name"
                  readonly
                />

                <div
                  class="icon-style d-flex"
                  v-if="field.dir_fields.obj_Name !== 'id'"
                >
                  <b-col class="grouping" cols="2">
                    <b-icon icon="link"></b-icon>
                  </b-col>
                </div>

                <b-form-input
                  v-if="field.cloud_fields.obj_Name !== 'user_id'"
                  class="grouping"
                  :value="field.cloud_fields.display_Name"
                  readonly
                />
              </div>
            </b-col>
          </b-row>
        </b-col>

        <b-col cols="5">
          <b-row>
            <b-col cols="5">
              <div
                v-for="group in getIntgDataMapping.groups_mappings"
                :key="group.id"
                class="d-flex justify-content-between mb-2 mapping-fields"
              >
                <b-form-input
                  class="grouping"
                  :value="group.dir_group_name"
                  readonly
                />

                <div class="icon-style d-flex">
                  <b-col class="grouping" cols="2">
                    <b-icon icon="link"></b-icon>
                  </b-col>
                </div>

                <b-form-input
                  class="grouping"
                  :value="group.role.name"
                  readonly
                />
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div class="break"></div>
      <div class="parent my-5 d-flex">
        <div class="sync-list mx-5">Synced List</div>
        <div class="sync-logs">
          <b-button
            pill
            class="d-flex align-items-center px-3 top-page-btn"
            variant="primary"
            size="sm"
            style="
              margin-bottom: 18px;
              background-color: #2680eb !important;
              border-color: #2680eb !important;
            "
            @click="openSyncLogs()"
          >
            Sync Logs
          </b-button>
        </div>
      </div>

      <div class="cards-con d-flex grouping">
        <div class="row">
          <div class="container d-flex grouping">
            <div class="col-3">
              <b-card class="card-style grouping" style="align-items: center">
                <div class="head-style">
                  <h4>SYNCED</h4>
                </div>
                <p class="viewCount">{{ getSyncedUsersCount }}</p>
                <p class="view-user">Users</p>
                <div class="view-style">
                  <b-button
                    pill
                    class="d-flex align-items-center px-3 top-page-btn"
                    variant="primary"
                    size="sm"
                    :disabled="getSyncedUsersCount <= 0"
                    @click="redirectUser('valid')"
                  >
                    <!-- <i class="bx bx-plus font-size-18 mr-2"></i> -->
                    View
                  </b-button>
                </div>
              </b-card>
            </div>
            <div class="col-1 diffrent"></div>

            <div class="col-3">
              <b-card class="card-style grouping" style="align-items: center">
                <div class="head-style">
                  <h4>DUPLICATES</h4>
                </div>
                <p class="viewCount">{{ getUsersWithDuplicatesCount }}</p>
                <p class="view-user">Users</p>
                <div class="view-style">
                  <b-button
                    pill
                    class="d-flex grouping align-items-center px-3 top-page-btn"
                    variant="primary"
                    size="sm"
                    :disabled="getUsersWithDuplicatesCount <= 0"
                    @click="redirectUser('duplicate')"
                  >
                    <!-- <i class="bx bx-plus font-size-18 mr-2"></i> -->
                    View
                  </b-button>
                </div>
              </b-card>
            </div>
            <div class="col-1 diffrent"></div>
            <div class="col-3">
              <b-card class="card-style grouping" style="align-items: center">
                <div class="head-style">
                  <h4>{{ "errors".toUpperCase() }}</h4>
                </div>
                <p class="viewCount">{{ getUsersWithErrsCount }}</p>
                <p class="view-user">Users</p>
                <div class="view-style d-flex">
                  <b-button
                    pill
                    class="grouping align-items-center px-3 top-page-btn"
                    variant="primary"
                    size="sm"
                    :disabled="getUsersWithErrsCount <= 0"
                    @click="redirectUser('error')"
                  >
                    <!-- <i class="bx bx-plus font-size-18 mr-2"></i> -->
                    View
                  </b-button>
                </div>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- sync logs  -->
    <b-modal
      id="syncLogsModal"
      scrollable
      size="lg"
      class=""
      hide-header
      hide-footer
      no-close-on-esc
      @hide="$bvModal.hide('syncLogsModal')"
    >
      <slot name="modal-header">
        <div class="d-flex justify-content-center">
          <h5
            class="modal-title align-items-center"
            style="color: ##000000; text-align: center"
          >
            <slot name="modal-title">
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
                <td style="">{{ log.created_at }}</td>
                <td>{{ log.sync_method }}</td>
                <td>{{ log.run_by ? log.run_by.first_name : '' }} {{ log.run_by ? log.run_by.last_name : '' }}</td>
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
    </b-modal>

    <!-- warning  -->
    <b-modal
      id="actionWarning"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="actionWarning"
    >
      <slot name="modal-header">
        <div class="modalHeader">
          <h4 class="modal-title">
            <slot name="modal-title"> {{ changedStatus }} Integration </slot>
          </h4>
        </div>
      </slot>
      <div class="d-block text-center modal-cusomContent">
        <p class="modal-paragraph">
          Are you sure you want to<span class="bold-word">
            “{{ changedStatus }} ” </span
          >this integration?
        </p>
        <p class="modal-smallParagraph">
          By {{ changedStatusVerb }} this integration, the automatic sync will
          be disabled but you can still sync data manually.
        </p>
      </div>
      <div class="line"></div>
      <div class="action-btns" v-if="changedStatus == 'Reactivate'">
        <b-button
          variant="primary"
          type="button"
          pill
          :disabled="getLoading"
          style="margin-right: 31px !important"
          class="text-center modal-buttonSize"
          @click="changeIntegStatus('Active')"
        >
          {{ changedStatus }}
        </b-button>

        <b-button
          variant="outline-danger modal-buttonSize"
          type="button"
          pill
          :disabled="getLoading"
          class="text-center"
          @click="$bvModal.hide('actionWarning')"
        >
          Cancel
        </b-button>
      </div>

      <div class="action-btns" v-if="changedStatus == 'Deactivate'">
        <b-button
          variant="primary"
          type="button"
          pill
          :disabled="getLoading"
          style="margin-right: 31px !important"
          class="text-center modal-buttonSize"
          @click="$bvModal.hide('actionWarning')"
        >
          Cancel
        </b-button>

        <b-button
          variant="outline-danger"
          type="button"
          pill
          :disabled="getLoading"
          class="text-center modal-buttonSize"
          @click="changeIntegStatus('Inactive')"
        >
          {{ changedStatus }}
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>
<script>
import moment from "moment";
import Layout from "../../layouts/main";
import router from "../../../router/index";
import AddIntegModal from "@/components/integration/AddIntegModal";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { mapActions, mapGetters } from "vuex";
// const dataGridRef = "dataGrid";
// import DxSelectBox from 'devextreme-vue/select-box';
import DxDataGrid, {
  DxColumn,
  DxPaging,
  DxHeaderFilter
} from "devextreme-vue/data-grid";
export default {
  title: "Integration",
  components: {
    // DxSelectBox,
    Layout,
    Breadcrumb,
    AddIntegModal,
    DxDataGrid,
    // DxMasterDetail,
    DxColumn,
    // DxLookup,
    // DxFilterRow,
    DxHeaderFilter,
    DxPaging,
    // DxPager,
    // DxGrouping,
    // DxGroupPanel,
    // DxSearchPanel,
    // DxColumnChooser,
  },
  data() {
    return {
      intgDirectory: null,
      changedStatus: "",
      changedStatusVerb: "",
      imgUrl: "",
      tenantId: "",
      groupTextFields: [
        {
          id: "item.id",
          name: "item.name",
          bindValue: "",
        },
      ],
      items: [
        {
          text: "Integrations",
          to: { name: "addIntegration" },
        },
        {
          text: this.$route.params.integName,
          to: {
            name: "viewIntegration",
            params: {
              integId: this.getIntegId,
              integName: this.$route.params.integName,
            },
          },

          active: true,
        },
      ],
      title: "Integrations",
      cards: [],
    };
  },
  methods: {
    ...mapActions("modal", ["setData"]),
    ...mapActions("integration", [
      "fetchDirectoryList",
      "fetchGridIntegrationData",
      "resetIntgData",
      "getIntegrationWithMapping",
      "getIntegration",
      "fetchTempUsersWithDuplicates",
      "fetchTempUsersWithErrors",
      "fetchSyncedUsers",
      "getIntegrationStat",
      "changeIntegrationStatus",
      "setReAuth",
      "startAutoSync",
      "getSyncLogsList",
    ]),

    getFullName(rowData) {
      return rowData.run_by ? rowData.run_by.first_name + " " + rowData.run_by.last_name : "";
    },

    convertToBrowserTime(time) {
      return moment(new Date(time + " UTC")).format("DD-MM-YYYY, h:mm:ss A");
      // date.toString()
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

    download(log) {
      window.open(`${process.env.VUE_APP_BASE_URL}/${log.file_name}`, "_blank");
    },

    redirectUser(data) {
      router.push("/integration-" + data);
      this.$store.dispatch("integration/setFromView", true);
    },

    showModal(status, action, verb) {
      console.log("sowmodal");
      this.changedStatus = action;
      this.changedStatusVerb = verb;
      this.$bvModal.show("actionWarning");
    },

    changeIntegStatus(status) {
      this.changeIntegrationStatus({ integId: this.getIntegId, status });
      this.$bvModal.hide("actionWarning");
    },

    reAuthenticate() {
      this.setData(this.intgDirectory);
      this.setReAuth(true);
    },

    openSyncLogs() {
      console.log("getSyncLogs", this.getSyncLogs);
      this.$bvModal.show("syncLogsModal");
    },
  },
  computed: {
    ...mapGetters("integration", [
      "getLoading",
      "getDirectoryList",
      "getGridIntegrationData",
      "getIntegId",
      "getIntgDataMapping",
      "getIntgStatus",
      "getUsersWithDuplicatesCount",
      "getUsersWithErrsCount",
      "getSyncedUsersCount",
      "getSyncLogs",
      "getFromView",
    ]),
    rowsData() {
      console.log("rowsada", this.getGridIntegrationData);
      return this.getGridIntegrationData &&
        this.getGridIntegrationData.length > 0
        ? this.getGridIntegrationData.map((el) => {
            return {
              id: el.id,
              integrationName: el.name,
              integrationType: el.dir_code,
              status: el.status,
              syncPeriod: el.sync_setting.sync_time,
              creationDate: el.created_at,
              lastSynced: el.sync_setting.updated_at,
              createdby: el.created_by,
              sites: el.sites,
            };
          })
        : [];
    },

    integId() {
      console.log("intg", this.$route.params.integId);
      return this.$route.params.integId;
    },
  },
  beforeMount() {
    this.fetchDirectoryList();
    this.fetchGridIntegrationData();
    this.getSyncLogsList(this.getIntegId);
    this.getIntegrationWithMapping({
      id: this.getIntegId,
      name: this.$route.params.integName,
      redirect: false,
    });
    this.getIntegration({
      id: this.getIntegId,
    });
    // this.fetchTempUsersWithErrors(this.getIntegId);
    // this.fetchTempUsersWithDuplicates(this.getIntegId);
    // this.fetchSyncedUsers(this.getIntegId);
    this.getIntegrationStat(this.getIntegId);
    // this.resetIntgData();
    // this.getIntegrationWithMapping(this.$route.params.integId);
    console.log(
      "viewpage",
      this.getIntegId,
      this.getIntgDataMapping,
      this.getDirectoryList,
      this.getSyncedUsersCount
    );
    this.intgDirectory = this.getDirectoryList.find(
      (item) => item.code == this.getIntgDataMapping.dir_code
    );
    console.log("intgDirectory", this.intgDirectory);
    // const tenantConfig = this.getIntgDataMapping.configs.find(
    //   (item) => item.Key_code == "tenant_id"
    // );
    this.tenantId = this.getIntgDataMapping.dir_unique_id;
    this.imgUrl = this.intgDirectory.img_url;
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
}
.custom-sizes.text-blue {
  color: #2680eb !important;
}
.view-user {
  font-family: "Lato";
  font-style: normal;
  font-weight: 900;
  font-size: 13px;
  line-height: 16px;
  color: #000000;
  opacity: 0.2;
}

.section {
  // position: absolute;
  display: flex;
  justify-content: center;
  width: 919px;
  height: 289px;
  // text-align: center;
  // align-content: center;
  // align-items: center;
  background: #f3f3f3;
  border-radius: 18px;
}
.viewCount {
  // position: absolute;
  // width: 58px;
  height: 49px;
  text-align: center;

  // font-family: 'Nexa';
  font-style: normal;
  font-weight: 900;
  font-size: 41px;
  line-height: 49px;

  /* Main Button */

  color: #103f5e;
}
.width-32 {
  width: 32%;
}
.mapping-fields input {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.25px;
  color: #787878;
}
.new-width {
  width: 160px;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.custom-danger {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #f46a6a;
  border: 2.5px solid #f46a6a;
  border-radius: 19.5px;
}
.custom-danger:hover {
  color: #ffffff !important;
}
.custom-primary {
  border: 2.5px solid #103f5e;
  border-radius: 19.5px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  :hover {
    color: #ffffff;
  }
}

.width-45 {
  width: 45%;
}
.dark-grey {
  color: #939393;
}
.light-grey {
  color: #c7c7c7;
}
.mapping-fields {
  label {
    background-color: #f2f2f2;
    width: 90px;
    height: 100%;
    margin-right: 5px;
    border-radius: 7px;
    text-align: center;
    color: #787878;
    font-size: 11px;
    font-weight: bold;
    padding-top: 5px;
  }
  input {
    color: #787878;
    font-size: 16px;
    font-weight: 600;
  }
}
.field-map-wrap {
  .key-field {
    display: inline-block;
    background-color: #f2f2f2;
    height: 57px;
    margin-right: 5px;
    padding: 14px 15px;
    border-radius: 4px;
    color: #787878;
    font-size: 16px;
  }
  .input-wrapper {
    display: inline-block;
    width: 100%;
  }
}

.wrapper {
  background-color: white;
  padding-left: 30px;
  padding-top: 32px;
  border-radius: 5px;
  padding-bottom: 30px;
  padding-right: 30px;
  .content {
    margin-top: 0px;
  }
}

.form-control {
  background-color: #f2f2f2;
  border-color: #f2f2f2;
  width: 173px;
  height: 55px;
  left: 379px;
  top: 472px;
  border-radius: 8px;
}
.custom-tag .form-control {
  background-color: white;
  border: 0px;
  padding: 0px;
}
.custom-tag .form-control .custom-select {
  background-color: #f2f2f2;
  border-color: #f2f2f2;
  color: #797d91;
  width: 31.7%;
}

i.mdi-arrow-right-box {
  font-size: 24px;
  padding: 0px;
  color: black;
}

@import "@/design/user_form_modals.scss";
.change-text {
  text-decoration: underline !important;
  color: #50a5f1;
}
.delete-icon {
  font-size: 1.3rem;
  margin-left: 8px;
  cursor: pointer;
}
.user-types-select {
  z-index: 1100;
}
.user-roles {
  z-index: 999;
}
p {
  display: block;
  color: #939393;
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

h3 {
  font-weight: 700;
  font-size: 18px;
  line-height: 17px;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  color: #000000;
}
h4 {
  font-weight: bold;
  color: #c7c7c7;
  font-size: 14px !important;
}

p {
  font-size: 12px;
  color: black;
  font-weight: bold;
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
  padding: 30px !important;
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
.table th,
.table td {
  border-top: 0px;
  border-radius: 5px;
}

.grouping {
  justify-content: center;
  justify-items: center;
  text-align: center;
  align-items: center;
  align-content: center;
}
.break {
  width: 100%;
  height: 2px;
  background-color: #f3f3f3;
  margin: 40px 0px;
}
.sync-list {
  width: 81px;
  height: 19px;
  font-size: 16px;
  font-weight: 700 bold;
  color: #939393;
}
.sync-logs {
  // width:61px;
  // height: 17px;
  font-size: 16px;
  width: 120px;
  // height: 25px;
}
.cards-con {
  margin: auto !important;
  width: 919px;
  height: 289px;
  box-sizing: border-box;
  background: #f3f3f3;
  border-radius: 18px;
}
.container {
  padding-top: 40px;
}
.card-style {
  width: 250px;
  height: 187px;
  background: #ffffff;
  border-radius: 18px;
}
.view-style {
  margin: auto !important;
  width: 60px !important;
}
.icon-style {
  height: 55px;
  align-items: center;
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
h5 {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 30px;
  color: #939393;
}
h5.modal-title {
  width: 100%;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.25px;
  color: #000000;
  margin-bottom: 0 !important;
}

.add-user-icon {
  font-size: 1.5rem;
  color: #103f5e;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    color: #34c38f;
  }
  table tr {
    border-bottom: 4px solid red !important;
  }
  .popover-modal {
    position: absolute;
    width: 300px !important;
    height: 359px;
    left: 373px;
    top: 270px;

    background: #ffffff;
    border-radius: 26px;
  }
}
</style>
<style lang="scss">
//integration()
div#actionWarning___BV_modal_content_ {
  width: 579px !important;
  height: 302px !important;
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
    .bold-word {
      font-weight: 700 !important;
    }
  }
  .modal-smallParagraph {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #939393;
    margin-bottom: 21px !important;
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
div#syncLogsModal___BV_modal_content_ {
  // width: 1000px!important;
}
</style>