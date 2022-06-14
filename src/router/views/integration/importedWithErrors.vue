<script>
import { mapActions, mapGetters } from "vuex";
// import store from "@/state/store";
import {
  required,
  //   between,
  numeric,
  // requiredIf,
} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import VueCountryCode from "vue-country-code";

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
    Multiselect,
    VueCountryCode,
    Button,
    DxDropDownButton,
  },
  data() {
    return {
      buttonData: ["Excel", "CSV", "PDF"],
      dataGridRef,
      title: "Errors",
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
        // email: {
        //   required: requiredIf(function () {
        //     const {
        //       form: {
        //         user: { phone },
        //       },
        //     } = this;
        //     return !phone;
        //   }),
        // },
        phone: {},
        user_type_id: { required },
        user_user_id: { required },
      },
    },
    userPhone: {
      // required: requiredIf(function () {
      //   const {
      //     form: {
      //       user: { email, phone },
      //     },
      //   } = this;
      //   return !email && !phone;
      // }),
      numeric,
    },
  },

  methods: {
    ...mapActions("integration", [
      "fetchTempUsersWithErrors",
      "fixTempUsersWithErrors",
      "redirectType",
      "redirectToIntegrationSettings",
    ]),
    ...mapActions("modal", ["onResetModal", "setData"]),
    ...mapActions("userType", ["fetchAllUserType"]),
    // ...mapActions("users", ["updateUserAction"]),

    // ...mapActions("integration", ["StartSyncUsers"]),

    setResetModal() {
      this.$bvModal.hide("add-edit-user");
    },

    hideModalTrigger() {
      this.setData(null);
    },

    openEditUserModal(data) {
      //   this.setData({});
      console.log("modal", data);
      this.userPhone = null;
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

    onSubmit() {
      this.submitted = true;
      this.$v.$touch();
      this.$v.$error ? "" : this.submission();
    },

    submission() {
      const { fixTempUsersWithErrors } = this;
      const data = this.form.user;
      if (this.userPhone)
        this.form.user.phone = `${this.userCountryCode}${this.userPhone}`;
      data.phone = this.form.user.phone;
      const userTypeId = {};
      userTypeId[this.form.user.user_type_id.id] =
        this.form.user.user_type_id.name;
      // data.user_type = JSON.stringify(this.form.user.user_type);
      console.log("submit", data, userTypeId, JSON.stringify(userTypeId));
      data.user_type = JSON.stringify(userTypeId);
      fixTempUsersWithErrors({ id: data.user_id, user: data });
      // console.log("count", this.getUsersWithErrsCount);
      // this.$bvModal.hide("add-edit-user");
    },

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
      "getUsersWithErrs",
      "getUsersWithErrsCount",
    ]),
    ...mapGetters("userType", ["getAllUsersTypes"]),
    // ...mapGetters("users", ["getLoading"]),

    dataGrid() {
      return this.$refs[this.dataGridRef].instance;
    },
    rowsData() {
      console.log(
        "getUsersWithErrs",
        this.getUsersWithErrsCount,
        this.getUsersWithErrs
        // this.getAllUsersTypes
      );
      return this.getUsersWithErrs && this.getUsersWithErrs.length > 0
        ? this.getUsersWithErrs.map((user) => {
            // console.log('errs', JSON.parse(user.errors));
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
              //   user_type_id: Object.keys(JSON.parse(user.user_type))[0],
              requiredError: JSON.parse(user.errors).error.required,
              invalidError: JSON.parse(user.errors).error.invalid,
              userTypeError: JSON.parse(user.errors).error.user_type
                ? Object.values(JSON.parse(user.errors).error.user_type).join(
                    "\r& "
                  )
                : "",
              errors: JSON.parse(user.errors),
              auto: user.auto,
              duplicate_status: user.duplicate_status,
            };
          })
        : [];
    },
  },
  mounted() {
    this.fetchTempUsersWithErrors(this.getIntegId);
    this.fetchAllUserType();
    // this.getIntegId = 80;
    console.log(
      "mounted count",
      this.getIntegId,
      this.getUsersWithErrs,
      this.getUsersWithErrsCount
    );
    // console.log('getintgdata', this.getIntgDataMapping)
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
        text: "Errors List",
        // to: { name: "viewIntegration" },
        active: true,
      }
    );
  },

  watch: {
    getModalState(state) {
      // deep: true,
      // handle(state) {
      // console.log("watch", state);
      state == true && this.$bvModal.hide("add-edit-user");
    },
    // },
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
    <!-- <PageHeader :title="title" :items="items" /> -->
    <div class="row">
      <div class="col-xl-4"></div>
    </div>

    <Breadcrumb
      id="errorsBreadCrumb"
      v-if="getFromView"
      style="background-color: transparent"
      :items="items"
    />

    <!-- grid -->
    <section class="dashboard-grid white-bg-sec " v-if="getUsersWithErrs">
      <div class="d-flex error-count mb-3">
        <h5>Imported with errors</h5>
        <span>{{ getUsersWithErrsCount }}</span>
      </div>

      <p class="note" v-if="getUsersWithErrsCount > 0">
       <b> Note:</b> All the actions taken are irreversible and the solved
        record will disappear from this list.
      </p>

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
        :no-data-text="'Errors already solved'"
        @row-updated="updateRow($event)"
        @content-ready="contentReady($event)"
      >
        <!-- <DxEditing :use-icons="true" :allow-updating="true" :allow-adding="false" :allow-deleting="false" mode="row" /> -->

        <DxPaging :page-size="10" />
        <DxPager
          :visible="true"
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

        <DxColumn data-field="email" caption="Email Address" :width="200" />

        <DxColumn data-field="phone" caption="Phone Number" />

        <DxColumn data-field="id" caption="ID" />

        <DxColumn data-field="rfid_number" caption="RFID" />

        <DxColumn data-field="userType" />

        <DxColumn caption="Error" cell-template="error-cell" />

        <DxColumn
          caption="Actions"
          cell-template="action-cell"
          :allow-filtering="false"
          :allow-exporting="false"
          :allow-editing="false"
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
            <!-- <div
              class="error-value"
              v-for="(key, index) of data.data.requiredError"
              :key="index"
            >
              {{ key }} is required.
            </div> -->
            <span  class="error-value"
              v-for="(key, index) of data.data.requiredError"
              :key="index">{{ key }} is required.</span>
            <!-- <div
              class="error-value"
              v-for="(key, index) of data.data.invalidError"
              :key="index + data.data.ID"
            >
              invalid {{ key }} {{ key == "email" ? "address" : "" }}.
            </div> -->
            <span class="error-value"
              v-for="(key, index) of data.data.invalidError"
              :key="index + data.data.ID">invalid {{ key }} {{ key == "email" ? "address" : "" }}.</span>
            
            <!-- <div class="error-value" v-if="data.data.userTypeError">
              User is assigned to User Types: {{ data.data.userTypeError }}.
            </div> -->
            <span class="error-value" v-if="data.data.userTypeError">User is assigned to User Types: {{ data.data.userTypeError }}.</span>
          </div>
        </template>

        <!-- <template #userType-cell="{ data }">
          <div>
            <div v-for="(key, index) of data.data.userType" :key="index">
              {{ key }}
            </div>
          </div>
        </template> -->

        <template #action-cell="{ data }">
          <div class="d-flex align-items-center text-center edit-btnn">
            <b-button
              class=" top-page-btn"
              variant="primary"
              
              v-on:click="openEditUserModal(data.data)"
              v-b-modal.add-edit-user
            >
            <span>Edit</span>
              
            </b-button>
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
          :disabled="getLoading || getUsersWithErrsCount > 0"
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

    <!-- edit user  -->
    <b-modal
      id="add-edit-user"
      class="popover-modal"
      size="md"
      hide-header
      hide-footer
      no-close-on-esc
      ref="add-edit-user"
    >
      <slot name="modal-header">
        <div class="modal-header flex-row">
          <h5 class="modal-title">
            <slot name="modal-title"> Edit User </slot>
          </h5>
          <button
            type="button"
            class="header-close"
            aria-label="headerCloseLabel"
            @click="setResetModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </slot>
      <b-row class="main-user-form">
        <b-col cols="12">
          <b-row>
            <b-form
              id="form"
              class="form-horizontal"
              @submit.prevent="onSubmit"
            >
              <div class="card custom-card personal-information">
                <div class="row my-3">
                  <!-- ID -->
                  <div class="col-sm-12 col-md-6 my-2">
                    <div class="d-flex align-items-center">
                      <label class="mb-0" id="user-id" for="user-id">ID</label>
                      <div v-if="!form.user.user_user_id">
                        <b-button
                          class="p-0 mx-2 font-weight-bold"
                          variant="link"
                          @click="generateUserID"
                          >Generate</b-button
                        >
                      </div>
                    </div>
                    <b-form-input
                      name="user_user_id"
                      id="user-id"
                      placeholder="Add ID"
                      v-model="form.user.user_user_id"
                      :class="{
                        'is-invalid':
                          submitted && $v.form.user.user_user_id.$error,
                      }"
                    />
                    <div
                      class="text-danger"
                      v-if="submitted && !$v.form.user.user_user_id.required"
                    >
                      <span class="font-size-15 font-weight-normal"
                        >User Id is required</span
                      >
                    </div>
                  </div>
                  <!-- RFID -->
                  <div class="col-sm-12 col-md-6 my-2">
                    <label class="mb-0" id="rfid" for="rfid">RFID</label>
                    <b-form-input
                      class="input-hide-arrow"
                      name="rfid_number"
                      id="rfid"
                      placeholder="Add RFID"
                      v-model="form.user.rfid_number"
                      type="number"
                      @wheel="$event.target.blur()"
                    />
                  </div>
                </div>
                <div class="form-groups">
                  <h5 class="text-muted mb-2">Personal Information</h5>
                  <!-- user type  -->
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="4"
                    id="userType"
                    label="User type"
                    label-for="userType"
                  >
                    <div>
                      <Multiselect
                        id="userType"
                        class="user-types-select"
                        v-model="form.user.user_type_id"
                        :options="getAllUsersTypes"
                        placeholder="Select User Type"
                        :show-labels="false"
                        label="name"
                        :allowEmpty="true"
                        :class="{
                          'has-error':
                            submitted &&
                            $v.form.user.user_type_id &&
                            !$v.form.user.user_type_id.required,
                        }"
                        :disabled="
                          !this.update &&
                          Object.keys(this.$route.params).length > 0
                            ? true
                            : false
                        "
                      >
                        <template slot="option" slot-scope="props">
                          <div class="option__desc">
                            <span
                              v-if="props.option.children"
                              class="option__name font-weight-bold"
                              >{{ props.option.name }}</span
                            >
                            <span
                              v-else
                              class="
                                option__usertype__child
                                font-weight-bold
                                ml-1
                              "
                              >- {{ props.option.name }}</span
                            >
                          </div>
                        </template>
                      </Multiselect>
                      <div
                        v-if="submitted && !$v.form.user.user_type_id.required"
                        class="text-danger"
                      >
                        <span class="font-size-15 font-weight-normal"
                          >User Type is required</span
                        >
                      </div>
                    </div>
                  </b-form-group>
                  <!-- first name  -->
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="4"
                    id="first-name"
                    label="First Name"
                    label-for="first-name"
                  >
                    <div>
                      <b-form-input
                        id="first-name"
                        name="first_name"
                        v-model="form.user.first_name"
                        placeholder="Add First Name"
                        :class="{
                          'is-invalid':
                            submitted && $v.form.user.first_name.$error,
                        }"
                      />
                      <div
                        class="text-danger"
                        v-if="submitted && !$v.form.user.first_name.required"
                      >
                        <span class="font-size-15 font-weight-normal"
                          >First Name is required</span
                        >
                      </div>
                    </div>
                  </b-form-group>
                  <!-- last name  -->
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="4"
                    id="last-name"
                    label="Last Name"
                    label-for="last-name"
                  >
                    <div>
                      <b-form-input
                        id="last-name"
                        name="last_name"
                        v-model="form.user.last_name"
                        placeholder="Add Last Name"
                        :class="{
                          'is-invalid':
                            submitted && $v.form.user.last_name.$error,
                        }"
                      />
                      <div
                        class="text-danger"
                        v-if="submitted && !$v.form.user.last_name.required"
                      >
                        <span class="font-size-15 font-weight-normal"
                          >Last Name is required</span
                        >
                      </div>
                    </div>
                  </b-form-group>
                  <!-- email  -->
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="4"
                    id="email"
                    label="Email"
                    label-for="email"
                  >
                    <div>
                      <b-form-input
                        name="email"
                        v-model="form.user.email"
                        placeholder="Add Email Address"
                      />
                    </div>
                  </b-form-group>
                  <!-- phone  -->
                  <b-form-group
                    label-cols-sm="4"
                    label-cols-lg="4"
                    id="phone"
                    label="Phone"
                    label-for="phone"
                  >
                    <div
                      v-if="update && currentPhone"
                      class="current-phone d-flex align-items-center"
                    >
                      <p class="mb-0">{{ form.user.phone }}</p>
                      <a @click="onChangeToUpdatePhone" class="change-text ml-2"
                        >Change</a
                      >
                    </div>
                    <div class="phone-input-wrapper">
                      <VueCountryCode
                        :disabledFetchingCountry="false"
                        @onSelect="onSelectUserCountryCode"
                        :enabledCountryCode="true"
                        :preferredCountries="['GB', 'US', 'CN']"
                      />
                      <b-form-input
                        id="phone"
                        name="phone"
                        v-model="userPhone"
                        placeholder="Add Phone Number"
                        :class="{
                          'is-invalid': submitted && $v.userPhone.$error,
                        }"
                      />
                    </div>
                    <div
                      v-if="submitted && !$v.userPhone.numeric"
                      class="text-danger w-100"
                    >
                      <span>Phone number should contain only digits.</span>
                    </div>
                  </b-form-group>
                  <!-- role  -->
                  <b-form-group
                    v-if="update && form.user.system_user"
                    label-cols-sm="4"
                    label-cols-lg="4"
                    label="User Role"
                  >
                    <div class="d-flex align-items-center">
                      <Multiselect
                        id="user_role"
                        class="custom-multi-select user-roles"
                        v-model="userRole"
                        :options="user_roles_list"
                        placeholder="Select User Type"
                        :show-labels="false"
                        label="name"
                        :allowEmpty="true"
                        disabled
                      >
                      </Multiselect>
                      <i
                        v-if="false"
                        @click="userRole = null"
                        class="mdi mdi-close-thick delete-icon"
                      ></i>
                    </div>
                  </b-form-group>
                </div>
                <b-row class="actions flex-row pl-3">
                  <div
                    class="
                      text-center
                      flex-row
                      justify-content-center
                      w-100
                      form-btn
                      flex-row
                    "
                  >
                    <b-button
                      variant="primary"
                      type="submit"
                      pill
                      :disabled="getLoading"
                      class="text-center mt-2 px-5"
                    >
                      <i
                        v-if="getLoading"
                        class="
                          bx bx-loader bx-spin
                          font-size-16
                          align-middle
                          mr-2
                        "
                      ></i>
                      <span v-else> Save Changes </span>
                    </b-button>
                  </div>
                </b-row>
              </div>
            </b-form>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>
  </Layout>
</template>

<style lang="scss" scoped>

@import "@/design/user_form_modals.scss";
.spinner-border {
  color: #103f5e;
  border-width: 0.35em;
  width: 38px;
  height: 38px;
  margin-right: 15px;
  border-right-color: #d9d9d9;
}
.edit-btnn{
 
.top-page-btn{
  width: 75px!important;
height:27px!important;
border-radius: 4px!important;
margin-right: 75px;
display: flex;
align-items: center;
justify-content: center;
font-weight: 400;
font-size: 16px;
line-height: 19px;

color: #FFFFFF;
}
}
.error-value{
  font-family: 'Lato';
font-style: normal;
font-weight: 400!important;
font-size: 16px!important;
line-height: 19px!important;
color: #F46A6A!important;
}
.header-content{
  width:100%;
  background:white;
  padding-bottom:1px;
  padding-top:40px;
  
 
}
.error-count {
  h5 {
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
    color: #939393;
    opacity: 0.46;
   padding-left:4px!important;
  }
  span {
    width: 47px;
    height: 29px;
    text-align: center; 
    background-color: #f46a6a!important;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 16px;
    border-radius: 15.5px;
    margin-left: 15px;
  }
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
  padding-left:4px;
  // padding-top:15px;
}
.white-bg-sec {
  background-color: white;
  padding-left: 36px;
  padding-top: 40px;
}

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
    color: #939393;
    font-weight: bold;
    font-size: 20px;
  }
  span {
    background-color: #f46a6a;
    color: white;
    padding-top: 2px !important;
    font-size: 16px;
    border-radius: 43%;
    margin-left: 15px;
  }
}
</style>
<style lang="scss">
ol#errorsBreadCrumb{
  li.breadcrumb-item.active {
 font-family: 'Lato';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 19px;

color: #495057;
}

li.breadcrumb-item {
  font-family: 'Lato';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 19px;

color: #495057;
}
}
</style>