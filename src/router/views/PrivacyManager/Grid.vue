<template>
  <section class="privacy-manager-wrapper pt-3">
    <Layout>
      <!-- modals  -->
      <Modal :title="'View List Settings'" modalID="privacyManager">
        <template>
          <ColumnsSwitcher
            :tableHeaders="getTableHeaders"
            url="privacy-manager"
            modalID="privacyManager"
          />
        </template>
      </Modal>
      <!-- delete modal  -->
      <b-modal
        id="deleteUserTypeNow"
        hide-footer
        hide-header
        size="md"
        scrollable
      >
        <DeleteModal />
      </b-modal>
      <!-- toggle modal  -->
      <b-modal
        id="togglePrivacyManager"
        hide-footer
        hide-header
        size="md"
        scrollable
      >
        <ToggleModal />
      </b-modal>
      <!-- edit modal  -->
      <b-modal id="editData&Scans" hide-footer hide-header size="md" scrollable>
        <EditModal />
      </b-modal>
      <!-- header  -->
      <PageHeader
        :title="title"
        className="d-flex align-items-center justify-content-between"
      >
        <!-- switch  -->
        <div v-if="false" class="mx-4 d-flex align-items-center">
          <div class="switch-wrapper">
            <b-form-checkbox
              s
              class="mb-1 mr-4"
              switch
              size="lg"
            ></b-form-checkbox>
          </div>
          <p class="text-muted mb-0" style="font-size: 0.8rem">
            Please note: When device storage is full, the oldest historical data
            records will be automatically deleted for all user types.
          </p>
        </div>
        <p v-if="lastCron" class="mb-0 text-primary last-cron">
          Last Update : {{ lastCron }}
        </p>
        <b-button
          pill
          class="d-flex align-items-center px-3 top-page-btn"
          :variant="toggleValue == 1 ? 'primary' : 'secondary'"
          size="sm"
          v-b-modal="'togglePrivacyManager'"
        >
          <i class="bx bx-power-off font-size-18 mr-2"></i>
          Privacy Manager
        </b-button>
      </PageHeader>
      <b-alert show dismissible variant="info">
        <i class="mdi mdi-alert-outline mr-2"></i> Please note: Ensure all scans
        and data are synced to the cloud, if device capacity is reached the
        oldest historical records are automatically deleted.
      </b-alert>
      <section
        v-if="toggleValue"
        class="privacy-manager-grid pt-3 px-2"
        style="background-color: white"
      >
        <GridSettings
          :rowsData="rowsData"
          :onToggleVisible="onToggleVisible"
          :columns="getExportHeaders"
          :fetchTableHeaders="fetchTableHeaders"
          :limit="limit"
          :updatePageRecords='updatePageRecords'
        />
        <b-table
          :data="rowsData"
          ref="table"
          detailed
          custom-detail-row
          :default-sort="['name', 'asc']"
          detail-key="id"
          :detail-transition="transitionName"
          :show-detail-icon="showDetailIcon"
          :checkable="true"
          :striped="false"
          :narrowed="false"
          :checked-rows.sync="checkedRows"
          paginated
          pagination-rounded
          :per-page="limit"
          :current-page.sync="currentPage"
        >
          <template slot="empty">
            <h5 class="text-center my-2 text-muted">No matching data..</h5>
          </template>
          <!-- toggled arrow  -->
          <b-table-column
            field=""
            label=""
            width="50"
            :visible="true"
            v-slot="props"
          >
            <template>
              <div
                class="icon-wrapper position-relative"
                :class="props.row.isCollapse ? 'is-expanded' : ''"
              >
                <i
                  v-if="props.row.Children.length > 0"
                  class="mdi toggle-icon mdi-chevron-right"
                  @click="toggle(props.row)"
                ></i>
              </div>
            </template>
          </b-table-column>
          <!-- Usertype  -->
          <b-table-column
            field="UserType"
            label="UserType"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.UserType
                : true
            "
            sortable
            searchable
          >
            <template slot="searchable">
              <SearchInput
                :selectAction="fetchUserTypeList"
                :paramsKey="{
                  name: 'name',
                }"
              />
            </template>
            <template v-slot="props">
              <span class="no-wrap">
                {{ props.row.UserType }}
              </span>
            </template>
          </b-table-column>
          <!-- Data Retention  -->
          <b-table-column
            field="DataRetention"
            label="Data Retention"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.DataRetention
                : true
            "
          >
            <template v-slot="props">
              <section class="d-flex align-items-center">
                <div class="d-flex align-items-center border py-1 px-2">
                  <p class="mb-0 cell-value">
                    {{ props.row.DataRetention[0].value.toString() }}
                  </p>
                  <span class="no-wrap data-scan-value">Days</span>
                </div>
                <div
                  class="delete-action mx-2 d-flex align-items-center"
                  v-b-modal="'deleteUserTypeNow'"
                  @click="
                    setModalData('data', props.row.id, props.row.UserType)
                  "
                >
                  <i class="mdi mdi-delete-forever-outline trash-icon"></i>
                  <span
                    class="delete-text text-uppercase mx-1 text-primary no-wrap"
                    >Delete Surplus Now</span
                  >
                </div>
              </section>
            </template>
          </b-table-column>
          <!-- Scans Retention  -->
          <b-table-column
            field="ScansRetention"
            label="Scans Retention"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.ScansRetention
                : true
            "
          >
            <template v-slot="props">
              <section class="d-flex align-items-center">
                <div class="d-flex align-items-center border py-1 px-2">
                  <p class="mb-0 cell-value">
                    {{ props.row.ScansRetention[0].value.toString() }}
                  </p>
                  <span class="no-wrap data-scan-value">Days</span>
                </div>
                <div
                  class="delete-action mx-2 d-flex align-items-center"
                  v-b-modal="'deleteUserTypeNow'"
                  @click="
                    setModalData('scan', props.row.id, props.row.UserType)
                  "
                >
                  <i class="mdi mdi-delete-forever-outline trash-icon"></i>
                  <span
                    class="delete-text text-uppercase mx-1 text-primary no-wrap"
                    >Delete Surplus Now</span
                  >
                </div>
              </section>
            </template>
          </b-table-column>
          <!-- Delete Records Up To  -->
          <b-table-column
            field=""
            label="Delete Records Up To"
            :visible="
              Object.keys(getTableHeaders).length > 0
                ? getTableHeaders.DeleteRecordsUpTo
                : true
            "
          >
            <template v-slot="props">
              <DatePickerCell :data="props.row.Data" type="both" />
            </template>
          </b-table-column>
          <!-- action  -->
          <b-table-column field="" label="Actions" width="230">
            <!-- multiple actions  -->
            <template v-slot:header="{ column }">
              <span class="is-relative" v-if="checkedRows.length <= 1"
                >{{ column.label }}
              </span>
              <Actions :data="getRowsIds" selectType="multiSelection" v-else />
            </template>
            <!-- single action  -->
            <template v-slot="props">
              <Actions
                :dataRetention="props.row.DataRetention"
                :scansRetention="props.row.ScansRetention"
                :data="props.row.Data"
              />
            </template>
          </b-table-column>
          <!-- details  -->
          <template slot="detail" slot-scope="props">
            <tr v-for="item in props.row.Children" :key="item.id">
              <td class="checkbox-cell">
                <label class="b-checkbox checkbox">
                  <input
                    type="checkbox"
                    true-value="true"
                    @change="checkboxChange($event, item)"
                    value="false" /><span class="check"></span
                  ><span class="control-label"></span
                ></label>
              </td>
              <td></td>
              <td
                v-show="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.UserType
                    : true
                "
              >
                {{ item.name }}
              </td>
              <!-- Data Retention Child  -->
              <td
                v-show="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.DataRetention
                    : true
                "
              >
                <section class="d-flex align-items-center">
                  <div class="d-flex align-items-center border py-1 px-2">
                    <p class="mb-0 cell-value">
                      {{
                        getPivotValue(
                          item.settings,
                          "data_retention"
                        )[0].value.toString()
                      }}
                    </p>
                    <span class="no-wrap data-scan-value">Days</span>
                  </div>
                  <div
                    class="delete-action mx-2 d-flex align-items-center"
                    v-b-modal="'deleteUserTypeNow'"
                    @click="setModalData('data', item.id, item.name)"
                  >
                    <i class="mdi mdi-delete-forever-outline trash-icon"></i>
                    <span
                      class="
                        delete-text
                        text-uppercase
                        mx-1
                        text-primary
                        no-wrap
                      "
                      >Delete Surplus Now</span
                    >
                  </div>
                </section>
              </td>
              <!-- Scans Retention Child  -->
              <td
                v-show="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.ScansRetention
                    : true
                "
              >
                <section class="d-flex align-items-center">
                  <div class="d-flex align-items-center border py-1 px-2">
                    <p class="mb-0 cell-value">
                      {{
                        getPivotValue(
                          item.settings,
                          "SCAN_RETENTION"
                        )[0].value.toString()
                      }}
                    </p>
                    <span class="no-wrap data-scan-value">Days</span>
                  </div>
                  <div
                    class="delete-action mx-2 d-flex align-items-center"
                    v-b-modal="'deleteUserTypeNow'"
                    @click="setModalData('scan', item.id, item.name)"
                  >
                    <i class="mdi mdi-delete-forever-outline trash-icon"></i>
                    <span
                      class="
                        delete-text
                        text-uppercase
                        mx-1
                        text-primary
                        no-wrap
                      "
                      >Delete Surplus Now</span
                    >
                  </div>
                </section>
              </td>
              <!-- Delete Records Up To Child  -->
              <td
                v-show="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.DeleteRecordsUpTo
                    : true
                "
              >
                <DatePickerCell :data="item" type="both" />
              </td>
              <td v-show="true">
                <Actions
                  :data="item"
                  :dataRetention="
                    getPivotValue(item.settings, 'data_retention')
                  "
                  :scansRetention="
                    getPivotValue(item.settings, 'SCAN_RETENTION')
                  "
                />
              </td>
            </tr>
          </template>
        </b-table>
      </section>
    </Layout>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Actions from "@/components/PrivacyManager/Actions";
import { privacyManagerColumns } from "@/utils/dataSource";
import Modal from "@/components/modal/Modal";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import GridSettings from "@/components/grid/GridSettings";
import { exportExel } from "@/utils/mixins/exportMixin";
import SearchInput from "@/components/userTypes/SearchInput";
import DatePickerCell from "@/components/PrivacyManager/DatePickerCell";
import DeleteModal from "@/components/PrivacyManager/DeleteModal";
import ToggleModal from "@/components/PrivacyManager/ToggleModal";
import EditModal from "@/components/PrivacyManager/EditModal";

export default {
  title: "Privacy Manager",
  name: "PrivacyManager",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    Actions,
    Modal,
    ColumnsSwitcher,
    GridSettings,
    SearchInput,
    DatePickerCell,
    DeleteModal,
    ToggleModal,
    EditModal,
  },
  data() {
    return {
      title: "Privacy Manager",
      showDetailIcon: false,
      limit: 10,
      currentPage: 1,
      arrowCollapse: false,
      checkedRows: [],
      updatedEntity: null,
      toggleValue: null,
      lastCron: null,
    };
  },
  watch: {
    getEntities(getEntities) {
      getEntities.length > 0 &&
        getEntities.map((entity) => {
          if (entity.id == this.currentEntity.id) {
            this.updatedEntity = entity;
          }
        });
      let entityValue =
        this.updatedEntity.setting &&
        this.updatedEntity.setting
          .map((item) => item.name == "privacy_manager" && item.pivot.value)
          .filter(Boolean)[0];
      this.toggleValue = entityValue == 1 ? true : false;
    },
    getCron(getCron) {
      getCron &&
        getCron.length > 0 &&
        getCron.map((item) =>
          item.name == "privacyManager" ? (this.lastCron = item.Last_run) : ""
        );
    },
  },
  computed: {
    ...mapGetters("userType", ["getUserTypeList"]),
    ...mapGetters("grid", ["getTableHeaders", "getSelectedRows", "getLoading"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("entity", ["getEntities"]),
    ...mapGetters("privacyManager", ["getCron"]),
    rowsData() {
      let gridData = JSON.parse(JSON.stringify(this.getUserTypeList));
      return gridData && gridData.length > 0
        ? gridData.map((item) => {
            return {
              isCollapse: false,
              id: item.id,
              UserType: item.name,
              DataRetention: this.getPivotValue(
                item.settings,
                "data_retention"
              ),
              ScansRetention: this.getPivotValue(
                item.settings,
                "SCAN_RETENTION"
              ),
              Children: item.children,
              Data: item,
            };
          })
        : [];
    },
    transitionName() {
      return "fade-in";
    },
    getRowsIds() {
      return this.checkedRows.length > 0
        ? this.checkedRows.map((v) => v.id)
        : [];
    },
  },
  methods: {
    ...mapActions("userType", ["fetchUserTypeList"]),
    ...mapActions("privacyManager", [
      "resetValues",
      "togglePrivacyManager",
      "getLastCronExecution",
    ]),
    ...mapActions("entity", ["fetchEntities","fetchCurrentEntities"]),
    ...mapActions("grid", [
      "onTableHeader",
      "updateTableHeaders",
      "resetTableHeaders",
      "resetFilterValues",
      "onSetFilterValue",
    ]),
    ...mapActions("modal", ["setData"]),
    setModalData(type, id, name) {
      this.setData({
        params: {
          name: name,
          beforeDate: null,
          type: type,
          userTypeIds: [id],
          entity_id: this.currentEntity.id,
        },
      });
    },
    toggle(row) {
      row.isCollapse = !row.isCollapse;
      this.$refs.table.toggleDetails(row);
    },
    onToggleVisible() {
      this.$bvModal.show("privacyManager");
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/privacy-manager",
        headers: privacyManagerColumns,
      });
    },
    getPivotValue(arr, name) {
      if (arr && arr.length > 0) {
        let value = arr.map((value) => {
          if (value.name == name) {
            return {
              id: value.id,
              value: value.pivot.value,
            };
          }
        });
        let filteredValue = value.filter((e) => {
          return e != null;
        });
        return filteredValue;
      } else {
        return null;
      }
    },
    handleRemoveItem(arr, id) {
      return arr.filter((item) => item.id !== id);
    },
    checkboxChange(event, item) {
      if (event.target.checked) {
        this.checkedRows.push(item);
      } else {
        this.checkedRows = this.checkedRows.filter((row) => row.id !== item.id);
      }
    },
    updatePageRecords(value){
      this.limit = value
    }
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchUserTypeList();
    this.resetValues();
    this.fetchCurrentEntities();
    this.getLastCronExecution();
  },
};
</script>

<style lang="scss" scoped>
.privacy-manager-wrapper {
  background-color: #fff;
  .last-cron {
    font-size: 14px;
  }
  .privacy-manager-grid {
    .cell-value {
      width: 30px;
    }
    .toggle-icon {
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1.5rem;
    }
    .icon-warpper {
      display: flex;
      justify-content: center;
      height: 1.5rem;
      width: 1.5rem;
    }
    .is-expanded {
      transform: rotate(90deg);
      transition: transform 150ms ease-out, opacity 86ms ease-out,
        -webkit-transform 150ms ease-out;
    }
    .trash-icon {
      font-size: 1.3rem;
    }
    .delete-text {
      font-size: 13px;
      font-weight: 500;
      @media (min-width: 576px) {
        font-size: 8px;
      }
      @media (min-width: 768px) {
        font-size: 9px;
      }
      @media (min-width: 992px) {
        font-size: 11px;
      }
    }
    .delete-action {
      cursor: pointer;
    }
    .data-scan-value {
      cursor: text;
    }
  }
}
</style>
