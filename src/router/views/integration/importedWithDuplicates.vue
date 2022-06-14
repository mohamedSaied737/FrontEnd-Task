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
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
// import PageHeader from "@/components/page-header";
// import DataTable from "@/components/grid/DataTable";
// import EditIntegModal from "@/components/integration/EditIntegrationModal";
// import SyncIntegModal from "@/components/integration/SyncIntegrationModal";
import { default as Button } from "devextreme-vue/button";
import DxDropDownButton from "devextreme-vue/drop-down-button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import "whatwg-fetch";

const dataGridRef = "dataGrid";

import DxDataGrid, {
  DxMasterDetail,
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
  // Button,
  // DxDropDownButton
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
    // SyncIntegModal,
    DxDataGrid,
    DxMasterDetail,
    DxColumn,
    // DxLookup,
    DxFilterRow,
    DxHeaderFilter,
    DxPaging,
    DxPager,
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
      dataGridRef,
      title: "Duplicates",
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
      selectedUser: "",
      selectedAction: "",
      selectedActionString: "",
      fullName: "",
      id: "",
      dir_int_id: "",
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
      "fetchTempUsersWithDuplicates",
      "fixTempUsersWithDuplicates",
      "redirectUser",
      "redirectToIntegrationSettings",
      "redirectType",
    ]),
    ...mapActions("modal", ["onResetModal", "setData"]),
    ...mapActions("userType", ["fetchAllUserType"]),
    // ...mapActions("users", ["updateUserAction"]),

    // ...mapActions("integration", ["StartSyncUsers"]),

    radioChanged(data, event) {
      const row = this.rowsData.find(
        (item) => item.radioGroup == event.split("&&")[1]
      );
      row.selectedUser = event.split("&&")[0];
      console.log("radiochanged", data, event);
    },

    actionChanged(data, action) {
      console.log(data.data, action);
      this.selectedUser = data.data.selectedUser;
      this.selectedAction = action;
      this.selectedActionString = action == "3" ? "Merge" : "Skip";
      this.fullName = data.data.first_name + " " + data.data.last_name;
      this.id = data.data.id;
      this.dir_int_id = data.data.dir_int_id;
      setTimeout(() => {
        this.$bvModal.show("actionDuplicates" + this.selectedActionString);
      }, 300);

      // this.dataGrid.refresh().then(function () {
      //   console.log("refreshed");
      // });
    },

    submitAction() {
      this.fixTempUsersWithDuplicates({
        selected_user_id: this.selectedUser,
        action: this.selectedAction,
        id: this.id,
        dir_int_id: this.dir_int_id,
      });
      this.$bvModal.hide("actionDuplicates" + this.selectedActionString);
    },

    getErr(data) {
      const errMsg = data.duplicate_type
        ? Object.values(data.duplicate_type).join(", ")
        : "";
      // console.log('msg', errMsg);
      return errMsg;
    },

    redirectUser() {
      this.redirectType(this.getIntegId);
    },

    redirectUserToIntegrationSettings() {
      this.redirectToIntegrationSettings();
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
  },

  computed: {
    ...mapGetters("integration", [
      "getLoading",
      "getModalState",
      "getFromView",
      //   "getSyncStatusText",
      //   "getSyncStatusStage",
      //   "getSyncStatusmsg",
      //   "getValidUsers",
      //   "getValidUsersCount",
      //    "getMigrateStatusText",
      //   "getMigrateStatusStage",
      //   "getMigrateStatusmsg",
      "getIntegId",
      "getIntgDataMapping",
      "getUsersWithDuplicates",
      "getUsersWithDuplicatesCount",
    ]),
    ...mapGetters("userType", ["getAllUsersTypes"]),
    // ...mapGetters("users", ["getLoading"]),

    dataGrid() {
      return this.$refs[dataGridRef].instance;
    },

    rowsData() {
      let i = 1;
      //   let j = 1000000;
      if (this.getUsersWithDuplicates && this.getUsersWithDuplicates.length > 0)
        this.getUsersWithDuplicates.map((user) => {
          user.error = JSON.parse(user.errors);
          user.radioGroup = i.toString();
          // user.radioId = j.toString();
          // j++;
          user.error.map((item) => {
            item.radioGroup = i.toString();
            //   item.radioId = j.toString();
          });
          i++;
          // j++;
        });
      return this.getUsersWithDuplicates &&
        this.getUsersWithDuplicates.length > 0
        ? this.getUsersWithDuplicates.map((user) => {
            return {
              dir_int_id: user.dir_int_id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              phone: user.phone,
              id: user.id,
              rfid_number: user.rfid_number,
              user_id: user.user_id,
              userType: user.user_type
                ? Object.values(JSON.parse(user.user_type))[0]
                : "-",
              user_type: user.user_type ? JSON.parse(user.user_type) : "",
              errorMsg: "Duplicates Found.",
              radioGroup: user.radioGroup,
              selectedAction: "Select Action",
              //   radioId: user.radioId,
              //   user_type_id: Object.keys(JSON.parse(user.user_type))[0],
              //   requiredError: JSON.parse(user.errors).error.required,
              //   invalidError: JSON.parse(user.errors).error.invalid,
              errors: user.error,
              selected: user.id + "&&" + user.radioGroup,
              selectedUser: user.id,
            };
          })
        : [];
    },
  },
  mounted() {
    this.fetchTempUsersWithDuplicates(this.getIntegId);
    this.fetchAllUserType();
    // this.getIntegId = 80;
    console.log(
      "mounted count",
      //   this.getIntegId,
      this.getUsersWithDuplicates,
      this.getUsersWithDuplicatesCount
    );
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
        text: "Duplicates List",
        // to: { name: "viewIntegration" },
        active: true,
      }
    );
  },

  watch: {
    getModalState(state) {
      state == true &&
        this.$bvModal.hide("add-edit-user") &&
        this.$bvModal.hide("actionDuplicates" + this.selectedActionString);
    },
  },

  created() {
    console.log("rowsData", this.rowsData);
    document.addEventListener("mousedown", (e) => {
      if (e.path) {
        // console.log("path", e.path);
        let isColumnChooser = false;
        for (let i = 0; i < e.path.length; i++) {
          if (typeof e.path[i].matches == "function") {
            if (e.path[i].matches(".dx-overlay-content")) {
              isColumnChooser = true;
            }
          }
        }
        if (!isColumnChooser) this.dataGrid.hideColumnChooser();
      }
    });
  },
};
</script>

<template>
  <Layout>
    <!-- dashboard compliances  -->
    <b-modal
      id="dashboardCompliances"
      hide-footer
      hide-header
      size="lg"
      scrollable
    >
      <Compliances />
    </b-modal>

    <!-- <PageHeader :title="title" :items="items" /> -->
    <div class="row">
      <div class="col-xl-4"></div>
    </div>

    <Breadcrumb
      id="duplicateBreadCrumb"
      v-if="getFromView"
      style="background-color: transparent"
      :items="items"
    />

    <!-- grid -->
    <section class="dashboard-grid white-bg-sec" v-if="getUsersWithDuplicates">
      <div class="data-grrid">
        <div class="header-content">
          <div class="d-flex error-count mb-3">
            <h5>Imported with duplicates</h5>
            <span :class="{ 'count-zero': getUsersWithDuplicatesCount == 0 }">{{
              getUsersWithDuplicatesCount
            }}</span>
          </div>

          <p
            class="note"
            v-if="!getFromView && getUsersWithDuplicatesCount > 0"
          >
            Note: For duplicates, we recommend to keep the records imported from
            Azure Directory. All the actions taken are irreversible and the
            solved duplicate will disappear from this list.
          </p>
          <p class="note" v-if="getFromView && getUsersWithDuplicatesCount > 0">
            Note: For duplicates, we recommend to keep the records imported from
            Azure Directory. All the actions taken will be synced directly with
            your list.
          </p>
        </div>
        <DxDataGrid
          v-if="!getLoading"
          id="gridContainer"
          :ref="dataGridRef"
          :data-source="rowsData"
          :remote-operations="false"
          :showBorders="false"
          :columnAutoWidth="true"
          :allowColumnReordering="true"
          :allowColumnResizing="true"
          :rowAlternationEnabled="false"
          :showColumnLines="true"
          :showRowLines="true"
          :repaint-changes-only="true"
          :two-way-binding-enabled="true"
          :no-data-text="''"
          @row-updated="updateRow($event)"
          @content-ready="contentReady($event)"
          :class="{ 'no-content': getUsersWithDuplicatesCount <= 0 }"
        >
          <!-- <DxEditing :use-icons="true" :allow-updating="true" :allow-adding="false" :allow-deleting="false" mode="row" /> -->

          <DxPaging
            :page-size="10"
            :visible="getUsersWithDuplicatesCount > 0"
          />
          <DxPager
            :visible="getUsersWithDuplicatesCount > 0"
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

          <!-- <DxSearchPanel :visible="true" placeholder="Search..."/> -->

          <DxColumnChooser :enabled="true" mode="select" />

          <DxExport :enabled="true" :allow-export-selected-data="false" />

          <DxToolbar>
            <!-- <DxItem name="columnChooserButton" location="before" /> -->
            <DxItem location="before" template="columnButtonTemplate" />
            <DxItem template="exportButtonTemplate" location="before" />
            <DxItem template="clearAllTemplate" location="before" />
          </DxToolbar>

          <!-- <DxGrouping :context-menu-enabled="true"/>
      <DxGroupPanel :visible="true"/> -->
          <DxColumn
            caption=""
            cell-template="radioButton-cell"
            :width="96"
            alignment="right"
            :allow-exporting="false"
            :show-in-column-chooser="false"
          />

          <DxColumn data-field="first_name" caption="First Name" :width="166" />

          <DxColumn data-field="last_name" caption="Last Name" :width="151" />

          <DxColumn data-field="email" caption="Email Address" :width="201" />

          <DxColumn data-field="phone" caption="Phone Number" :width="201" />

          <DxColumn
            data-field="id"
            caption="ID"
            :width="200"
            alignment="left"
          />

          <DxColumn data-field="rfid_number" caption="RFID" :width="200" />

          <DxColumn data-field="userType" :width="200" />

          <DxColumn
            data-field="errorMsg"
            caption="Error"
            cell-template="error-cell"
            :width="215"
          />

          <DxColumn
            caption="Actions"
            cell-template="action-cell"
            :allow-filtering="false"
            :allow-exporting="false"
            :allow-editing="false"
            :min-width="200"
            css-class="select-actions custom-duplicatesActions"
          >
            <DxHeaderFilter :allow-search="false" />
          </DxColumn>

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

          <template #error-cell="{ data }">
            <div>
              <div class="error-value">
                {{ data.value }}
              </div>
            </div>
          </template>

          <template #action-cell="{ data }">
            <div>
              <!-- <b-dropdown
              id="dropdown-1"
              text="Select Action"
              class="d-flex align-items-center px-3 mx-3 top-page-btn m-md-2"
              variant="primary"
              size="sm"
            >
              <b-dropdown-item>Merge</b-dropdown-item>
              <b-dropdown-item>Skip</b-dropdown-item>
            </b-dropdown> -->

              <b-dropdown
                :text="data.data.selectedAction"
                class="d-flex align-items-center custom-selectSize"
                variant="primary"
                size="sm"
              >
                <template v-slot:button-content>
                  {{ data.data.selectedAction }}
                  <i
                    class="mdi mdi-menu-down"
                    style="color: white; padding-left: 4px"
                  ></i>
                </template>
                <b-dropdown-item href="#" @click="actionChanged(data, '3')"
                  >Merge</b-dropdown-item
                >
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="#" @click="actionChanged(data, '2')"
                  >Skip</b-dropdown-item
                >
              </b-dropdown>
            </div>
          </template>

          <template #radioButton-cell="{ data }">
            <b-form-group
              class="custom-radios custom-activeRadio"
              v-slot="{ ariaDescribedby }"
            >
              <!-- <b-form-radio-group
              v-model="data.data.radioSelected"
              :id="data.data.radioId"
              :options="['']"
              :aria-describedby="ariaDescribedby"
              :name="data.data.radioGroup"
            ></b-form-radio-group> -->
              <b-form-radio
                v-model="data.data.selected"
                :aria-describedby="ariaDescribedby"
                :name="data.data.radioGroup"
                :value="data.data.id + '&&' + data.data.radioGroup"
                v-on:change="radioChanged(data, $event)"
                :checked="data.data.radioChecked"
              >
              </b-form-radio>
            </b-form-group>
          </template>

          <DxMasterDetail :enabled="true" template="master-detail" />
          <template #master-detail="{ data }">
            <div>
              <!-- <h5 class="master-detail-caption text-dark">Scans</h5> -->
              <DxDataGrid
                :data-source="data.data.errors"
                :showBorders="false"
                :columnAutoWidth="true"
                :allowColumnReordering="true"
                :allowColumnResizing="true"
                :rowAlternationEnabled="true"
                :showColumnLines="true"
                :showRowLines="true"
                :showColumnHeaders="false"
              >
                <DxColumn
                  caption=""
                  cell-template="radioButton-cell"
                  :width="50"
                />

                <DxColumn
                  data-field="first_name"
                  caption="First Name"
                  :width="168"
                />

                <DxColumn
                  data-field="last_name"
                  caption="Last Name"
                  :width="150"
                />

                <DxColumn
                  data-field="email"
                  caption="Email Address"
                  :width="200"
                />

                <DxColumn
                  data-field="phone"
                  caption="Phone Number"
                  :width="200"
                />

                <DxColumn data-field="id" caption="ID" :width="200" />

                <DxColumn
                  data-field="rfid_number"
                  caption="RFID"
                  :width="200"
                />

                <DxColumn data-field="userType" :width="200" />

                <DxColumn
                  caption="Error"
                  cell-template="error-cell"
                  :width="200"
                />

                <template #radioButton-cell="{ data }">
                  <b-form-group
                    class="custom-radios custom-activeRadio"
                    v-slot="{ ariaDescribedby }"
                  >
                    <b-form-radio
                      v-model="data.data.selected"
                      :aria-describedby="ariaDescribedby"
                      :name="data.data.radioGroup"
                      :value="data.data.user_id + '&&' + data.data.radioGroup"
                      v-on:change="radioChanged(data, $event)"
                      checked
                    ></b-form-radio>
                  </b-form-group>
                </template>

                <template #error-cell="{ data }">
                  <div>
                    <div class="error-value">
                      {{ getErr(data.data) }}
                    </div>
                  </div>
                </template>
              </DxDataGrid>
            </div>
          </template>
        </DxDataGrid>
      </div>
      <div class="table-extension" v-if="getUsersWithDuplicatesCount <= 0">
        <h4 class="duplicates-solved">Duplicates already solved</h4>
        <p class="sync-msg" v-if="!getFromView">
          Press<b>"Next"</b>to continue your first sync process
        </p>
      </div>

      <div class="action-btns mt-3" v-if="!getFromView">
        <button
          class="submit-btn btn btn-primary"
          size="md"
          @click="redirectUserToIntegrationSettings()"
        >
          <span>Back</span>
        </button>
        <button
          class="submit-btn btn btn-primary"
          size="md"
          :disabled="getLoading || getUsersWithDuplicatesCount > 0"
          @click="redirectUser"
        >
          <i
            v-if="getLoading"
            class="bx bx-loader bx-spin font-size-16 align-middle mr-2 rounded"
          ></i>
          <span>Next</span>
        </button>
      </div>
    </section>

    <!-- warning  -->
    <b-modal
      :id="'actionDuplicates' + selectedActionString"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="actionDuplicates"
    >
      <slot name="modal-header">
        <div class="modalHeader">
          <h4 class="modal-title">
            <slot name="modal-title">
              {{ selectedActionString }} Duplicate
            </slot>
          </h4>
        </div>
      </slot>
      <div class="d-block text-center modal-cusomContent">
        <p class="modal-paragraph">
          Are you sure you want to<span class="bold-word">
            “{{ selectedActionString }}” </span
          >the duplicate records for {{ fullName }}?
        </p>
        <p class="modal-smallParagraph" v-if="selectedActionString == 'Skip'">
          By skipping this duplicate group, the imported directory's record will
          not be synced to your list.
        </p>
      </div>
      <div class="line"></div>
      <div class="action-btns">
        <b-button
          variant="primary"
          type="button"
          pill
          :disabled="getLoading"
          style="margin-right: 31px !important"
          class="text-center modal-buttonSize"
          @click="submitAction()"
        >
          {{ selectedActionString }}
        </b-button>

        <b-button
          variant="outline-danger"
          type="button"
          pill
          :disabled="getLoading"
          class="text-center modal-buttonSize"
          @click="$bvModal.hide('actionDuplicates' + selectedActionString)"
        >
          Cancel
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>

<style lang="scss" scoped>
.custom-line {
  width: 1px;
  height: 27px;
  opacity: 0.08;
  background: #000000;
  opacity: 0.08;
  position: absolute;
  right: 48% !important;
}
.custom-columns {
  margin-left: -11px !important;
}
.error-value {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400 !important;
  font-size: 16px !important;
  line-height: 19px !important;
  color: #f46a6a !important;
}
.dashboard-grid {
  border-top-left-radius: 6px !important;
}
.header-content {
  width: 100%;
  background: white;
  padding-bottom: 1px;
  padding-top: 40px;

  .error-count h5 {
    padding-left: 4px;
  }
}
.table-extension {
  width: 100% !important;
  height: 304px !important;
  background: white !important;
  text-align: center !important;
  padding-top: 79px !important;
  h4.duplicates-solved {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #495057;
    padding-bottom: 22px;
  }
  .sync-msg {
    font-family: "Lato";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: #939393;
  }
}
.count-zero {
  width: 38px !important;
  height: 29px !important;
}
.custom-selectSize {
  width: 140px !important;
  height: 27px !important;
}
.note {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.25px;
  color: #939393;
  opacity: 0.8;
  padding-left: 45px;
  // padding-top:15px;
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

.error-count {
  h5 {
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
    color: #939393;
    opacity: 0.46;
  }
  span {
    width: 47px;
    height: 29px;
    padding-top: 2px !important;
    text-align: center;
    background-color: #f46a6a;
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    border-radius: 15.5px;
    margin-left: 15px;
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
  padding-left: 36px;
  // padding-top: 32px;
}
</style>
<style lang="scss">
.no-content {
  .dx-scrollable-scroll-content {
    display: none !important;
  }
}
.custom-duplicatesActions {
  ul.dropdown-menu.show {
    align-items: center !important;
    background: #ffffff !important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
    border-radius: 6px !important;
    text-align: center !important;
    min-width: 140px !important;
    min-height: 78px !important;
    margin-top: 6px !important;
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
    padding-right: 30px !important;
  }
}

button#__BVID__99__BV_toggle_ ul.dropdown-menu.show {
  text-align: center !important;
  text-align: center;
  width: 30px !important;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%) !important;
  border-radius: 6px !important;
  margin-top: 6px !important;
}

//integration()
ol#duplicateBreadCrumb {
  li.breadcrumb-item.active {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;

    color: #495057;
  }

  li.breadcrumb-item {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #495057;
  }
}
div#actionDuplicatesMerge___BV_modal_content_ {
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
    margin-bottom: 35.75px !important;
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
    margin-bottom: 20px !important;
  }
}
div#actionDuplicatesSkip___BV_modal_content_ {
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
</style>