<script>
import { mapActions, mapGetters } from "vuex";
// import store from "@/state/store";
import {
  required,
  //   between,
  numeric,
  requiredIf,
} from "vuelidate/lib/validators";

import Layout from "../../layouts/main";
// import PageHeader from "@/components/page-header";
// import DataTable from "@/components/grid/DataTable";
// import EditIntegModal from "@/components/integration/EditIntegrationModal";
import SyncIntegModal from "@/components/integration/SyncIntegrationModal";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
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
  DxColumn,
  // DxLookup,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel,
  DxColumnChooser,
  DxPaging,
  DxPager,
  DxExport,
  DxToolbar,
  DxItem,

  // DxGrouping,
  // DxGroupPanel,
} from "devextreme-vue/data-grid";
export default {
  components: {
    Layout,
    Breadcrumb,
    // PageHeader,
    // EditIntegModal,
    // DataTable,
    SyncIntegModal,
    DxDataGrid,
    DxColumn,
    // DxLookup,
    DxFilterRow,
    DxHeaderFilter,
    DxPaging,
    DxPager,
    DxSearchPanel,
    DxColumnChooser,
    DxExport,
    DxToolbar,
    DxItem,
    DxDropDownButton,
    Button,
  },
  data() {
    return {
      buttonData: ["Excel", "CSV", "PDF"],
      title: "Errors",
      allUsers: [],
      usersCount: null,
      isLoading: true,
      update: true,
      submitted: false,
      userPhone: null,
      currentPhone: false,
      userCountryCode: null,
      form: {
        user: {
          first_name: null,
          last_name: null,
          email: null,
          phone: null,
          image: null,
          user_type_id: null,
          rfid_number: null,
          user_user_id: null,
          //   system_user: false,
          department_id: null,
          role_id: null,
        },
        entity: {
          entity_id: null,
        },
      },
      items: [
        {
          text: "Integrations",
          to: { name: "addIntegration" },
        },
      ],
    };
  },

  validations: {
    form: {
      user: {
        first_name: { required },
        last_name: { required },
        email: {
          required: requiredIf(function () {
            const {
              form: {
                user: { phone },
              },
            } = this;
            return !phone;
          }),
        },
        phone: {},
        user_type_id: { required },
        user_user_id: { required },
      },
    },
    userPhone: {
      required: requiredIf(function () {
        const {
          form: {
            user: { email, phone },
          },
        } = this;
        return !email && !phone;
      }),
      numeric,
    },
  },

  methods: {
    ...mapActions("integration", [
      "fetchValidTempUsers",
      "fetchSyncedUsers",
      // "fixTempUsersWithErrors",
      "redirectType",
      "redirectToIntegrationSettings",
    ]),
    ...mapActions("modal", ["onResetModal", "setData"]),
    ...mapActions("userType", ["fetchAllUserType"]),
    // ...mapActions("users", ["updateUserAction"]),

    ...mapActions("integration", ["StartSyncUsers"]),

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
              "Duplicates.xlsx"
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
              "Duplicates.csv"
            );
          });
        });
      } else if (e.itemData == "PDF") {
        const doc = new jsPDF();
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: this.dataGrid,
        }).then(() => {
          doc.save("Duplicates.pdf");
        });
      }
    },

    clearFilter() {
      this.$refs[this.dataGridRef].instance.clearFilter();
    },

    contentReady() {
      this.setColumnChooserPosition();
    },

    setColumnChooserPosition() {
      // this.dataGrid.showColumnChooser();
      // console.log("columnChooserView");

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

    setResetModal() {
      this.$bvModal.hide("add-edit-user");
    },

    hideModalTrigger() {
      this.setData(null);
    },

    openEditUserModal(data) {
      //   this.setData({});
      console.log("modal", data);
      this.form.user = data;
      this.form.user.user_type_id = {
        id: Object.keys(data.user_type)[0],
        name: Object.values(data.user_type)[0],
      };
      //   this.form.user.first_name = data.firstName;
      //   this.form.user.last_name = data.lastName;
      //   this.form.user.email = data.emailAddress;
      //   this.form.user.phone = data.phoneNumber;
      this.form.user.user_user_id = data.id;
      //   this.form.user.rfid_number = data.RFID;
      //   console.log(this.form.user);
      this.currentPhone = data.phone ? true : false;
    },

    generateUserID() {
      let length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      let i = 0,
        n = charset.length;
      for (; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      this.form.user.user_user_id = "VP-" + retVal;
    },

    calculateStatus(rowData) {
      if (rowData.is_dir_deleted) return "Deleted " + rowData.last_sync;
      if (rowData.is_dir_deactivated) return "Deactivated " + rowData.last_sync;
      return "Synced " + (rowData.last_sync ? rowData.last_sync : "-");
    },
    // onSubmit() {
    //   this.submitted = true;
    //   this.$v.$touch();
    //   this.$v.$error ? "" : this.submission();
    // },

    // submission() {
    //   // const { fixTempUsersWithErrors } = this;
    //   // const data = this.form.user;
    //   // data.phone =
    //   //   this.form.user.phone = `${this.userCountryCode}${this.userPhone}`;
    //   // data.user_type = JSON.stringify(this.form.user.user_type);
    //   console.log("sync");
    //   this.StartSyncUsers({id: this.getIntegId, isFailed: false });
    //   // console.log("count", this.getUsersWithErrsCount);
    // },

    onSelectUserCountryCode({ dialCode }) {
      this.userCountryCode = dialCode;
    },

    onChangeToUpdatePhone() {
      this.currentPhone = false;
    },

    redirectUser() {
      this.redirectType(this.getIntegId);
    },

    redirectUserToIntegrationSettings() {
      this.redirectToIntegrationSettings();
    },
  },

  computed: {
    ...mapGetters("integration", [
      "getLoading",
      "getModalState",
      "getSyncStatusStage",
      "getSyncStatusText",
      "getSyncStatusmsg",
      "getValidUsers",
      "getValidUsersCount",
      "getSyncedUsers",
      "getSyncedUsersCount",
      //    "getMigrateStatusText",
      //   "getMigrateStatusStage",
      //   "getMigrateStatusmsg",
      "getIntegId",
      "getIntgDataMapping",
      "getUsersWithErrs",
      "getUsersWithErrsCount",
      "getFromView",
    ]),
    // ...mapGetters("userType", ["getAllUsersTypes"]),
    // ...mapGetters("users", ["getLoading"]),

    rowsData() {
      console.log(
        "allusers",
        this.allUsers
        // this.getAllUsersTypes
      );
      return this.allUsers && this.allUsers.length > 0
        ? this.allUsers.map((user) => {
            return {
              dir_int_id: user.dir_int_id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              id: user.id,
              rfid_number: user.rfid_number,
              user_id: user.user_id,
              userType:
                user && user.user_type
                  ? user.user_type && user.user_type.name
                    ? user.user_type.name
                    : Object.values(JSON.parse(user.user_type))[0]
                  : "-",
              last_sync: user.last_sync,
              is_dir_deleted: user.is_dir_deleted,
              is_dir_deactivated: user.is_dir_deactivated,
              // user_type: JSON.parse(user.user_type),
              //   user_type_id: Object.keys(JSON.parse(user.user_type))[0],
              // requiredError: JSON.parse(user.errors).error.required,
              // invalidError: JSON.parse(user.errors).error.invalid,
            };
          })
        : [];
    },
  },
  mounted() {
    if (this.getFromView) {
      // this.fetchSyncedUsers(this.getIntegId);
      this.allUsers = this.getSyncedUsers;
      this.usersCount = this.getSyncedUsersCount;
    } else {
      // this.fetchValidTempUsers(this.getIntegId);
      this.allUsers = this.getValidUsers;
      this.usersCount = this.getValidUsersCount;
    }
    console.log(this.getFromView, this.allUsers);

    this.fetchAllUserType();
    // this.getIntegId = 80;
    console.log("mounted", this.getIntegId, this.allUsers, this.usersCount);
    this.items.push(
      {
        text: this.getIntgDataMapping.name,
        to: {
          name: "viewIntegration",
          params: {
            integId: this.getIntegId,
            integName: this.getIntgDataMapping.name,
          },
        },

        // active: true,
      },
      {
        text: "Synced List",
        // to: { name: "viewIntegration" },
        active: true,
      }
    );
  },

  watch: {
    getModalState(state) {
      state == true && this.$bvModal.hide("add-edit-user");
    },
  },

  created() {
    console.log("rowsData", this.rowsData);
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

<template>
  <Layout>
    <b-modal id="syncIntegration" scrollable hide-footer hide-header size="lg">
      <SyncIntegModal />
    </b-modal>
    <!-- <PageHeader :title="title" :items="items" /> -->
    <div class="row">
      <div class="col-xl-4"></div>
    </div>

    <Breadcrumb
      v-if="getFromView"
      style="background-color: transparent"
      :items="items"
    />

    <!-- grid -->
    <!-- <div class="d-flex loading-container"> -->
    <section class="white-bg-sec pb-3" v-if="allUsers">
      <div class="d-flex error-count mb-3">
        <h5 v-if="getFromView">Synced List</h5>
        <h5 v-else>All Records List</h5>
        <span>{{ usersCount }}</span>
      </div>
      <p v-if="getFromView">
        These records have been already synced with your list.
      </p>
      <p v-else>
        These are the final records that will be synced with your list. Click
        “Sync” to confirm.
      </p>

      <DxDataGrid
        v-if="!getLoading"
        id="gridContainer"
        :data-source="rowsData"
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
        @content-ready="contentReady($event)"
      >
        <DxPaging :page-size="10" />
        <DxPager
          :visible="true"
          :allowed-page-sizes="[5, 10, 25, 50, 100, 'all']"
          :display-mode="'full'"
          :show-page-size-selector="true"
          :show-info="true"
          :show-navigation-buttons="true"
        />

        <DxFilterRow :visible="true" />
        <!-- <DxFilterRow :visible="true" :apply-filter="currentFilter"/> -->

        <DxHeaderFilter :visible="true" />

        <DxSearchPanel :visible="true" placeholder="Search..." />

        <DxColumnChooser :enabled="true" mode="select" />

        <!-- <DxGrouping :context-menu-enabled="true"/>
      <DxGroupPanel :visible="true"/> -->

        <DxExport :enabled="true" :allow-export-selected-data="false" />

        <DxToolbar>
          <!-- <DxItem name="columnChooserButton" location="before" /> -->
          <DxItem location="before" template="columnButtonTemplate" />
          <DxItem template="exportButtonTemplate" location="before" />
          <DxItem template="clearAllTemplate" location="before" />
        </DxToolbar>

        <DxColumn data-field="first_name" caption="First Name" />

        <DxColumn data-field="last_name" caption="Last Name" />

        <DxColumn data-field="email" caption="Email Address" />

        <DxColumn data-field="phone" caption="Phone Number" />

        <DxColumn data-field="id" caption="ID" />

        <DxColumn data-field="rfid_number" caption="RFID" />

        <DxColumn data-field="userType" />

        <DxColumn
          caption="Status"
          :calculate-cell-value="calculateStatus"
          :allow-filtering="true"
          :allow-sorting="true"
          cell-template="status-cell"
          :visible="getFromView"
        />

        <template #clearAllTemplate>
          <Button
            text="Clear columns filters"
            @click="clearFilter"
            styling-mode="outlined"
            type="danger"
            class="clear-CustomColums"
          />
        </template>

        <template #exportButtonTemplate>
          <DxDropDownButton
            :items="buttonData"
            text="Export"
            @item-click="onItemClick"
          />
        </template>

        <template #columnButtonTemplate>
          <button
            class="custom-columns mx-1"
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
            :class="{
              'text-success':
                !data.data.is_dir_deleted && !data.data.is_dir_deactivated,
              'text-danger':
                data.data.is_dir_deleted || data.data.is_dir_deactivated,
            }"
          >
            {{ data.value }}
          </div>
        </template>
      </DxDataGrid>

      <div class="action-btns mt-3" v-if="!getFromView">
        <button
          class="submit-btn btn btn-primary"
          size="md"
          @click="redirectUserToIntegrationSettings"
        >
          <span>Back</span>
        </button>
        <button
          class="submit-btn btn btn-primary"
          size="md"
          v-b-modal="'syncIntegration'"
          :disabled="getLoading"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          <span>Sync</span>
        </button>
      </div>
    </section>
    <!-- </div> -->
  </Layout>
</template>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 35%;
  left: 40%;
  background-color: white;
  padding: 35px 30px;
  border-radius: 50px;
  min-width: 175px;

  p {
    font-weight: bold;
    font-size: 16px;
    color: black;
    margin-bottom: 3px;
    line-height: 1;
  }
  span.count {
    color: #787878;
    font-size: 14px;
    font-weight: 400;
  }
  .submit-btn {
    margin-right: 0px;
  }
}
.spinner-border {
  color: #103f5e;
  border-width: 0.35em;
  width: 38px;
  height: 38px;
  margin-right: 15px;
  border-right-color: #d9d9d9;
}
.white-bg-sec {
  background-color: white;
  padding-left: 30px;
  padding-top: 32px;
}

.error-count {
  h5 {
    color: #939393;
    font-weight: bold;
    font-size: 20px;
  }
  span {
    background-color: #103f5e;
    color: white;
    padding: 3px 13px;
    font-size: 16px;
    border-radius: 43%;
    margin-left: 15px;
  }
}
p {
  display: block;
  color: #939393;
}
</style>