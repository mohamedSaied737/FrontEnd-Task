<template>
  <Layout>
    <section class="user-types-grid-wrapper">
      <PageHeader
        :title="title"
        className="d-flex align-items-center justify-content-between mb-2"
      >
        <router-link to="/add-user-type">
          <b-button
            pill
            class="d-flex align-items-center px-3 top-page-btn"
            variant="primary"
            size="sm"
          >
            <i class="bx bx-plus font-size-18 mr-2"></i>
            Create User Type
          </b-button>
        </router-link>
      </PageHeader>
      <!-- columns view -->
      <Modal :title="'View List Settings'" modalID="userType">
        <template>
          <ColumnsSwitcher
            :tableHeaders="getTableHeaders"
            url="user-types"
            modalID="userType"
            :fetchTableHeaders="fetchTableHeaders"
          />
        </template>
      </Modal>
      <!-- update user types  -->
      <b-modal id="updateUserTypes" hide-footer hide-header>
        <UpdateActionForm />
      </b-modal>
      <!-- move user types  -->
      <b-modal id="moveUserTypes" hide-footer hide-header scrollable>
        <MoveActionForm />
      </b-modal>
      <div class="grid-wrapper pt-3 mt-3">
      <GridSettings
        :rowsData="rowsData"
        :onToggleVisible="onToggleVisible"
        :columns="getExportHeaders"
        :showExport="true"
        :limit="limit"
        :updatePageRecords='updatePageRecords'
      />
      <!-- Grid  -->
      <b-table
        :data="rowsData"
        ref="table"
        :mobile-cards="false"
        detailed
        :default-sort="['name', 'asc']"
         detail-key="id"
        :show-detail-icon="showDetailIcon"
        :opened-detailed="['39b808ff-0b9d-391f-a7d8-68322f774858']"
        paginated
        pagination-rounded
        :row-class="(row, index) =>row.Children.length>0?'':'hide-arrow-icon-detail'"
        :per-page="limit"
        :current-page.sync="currentPage"
      >
        <!-- name -->
        <b-table-column
        :visible="Object.keys(getTableHeaders).length > 0? getTableHeaders.Name: true"
        searchable
        sortable
        field="Name"
        label="Name"
        width="300"
        >
          <template slot="searchable">
            <SearchInput
            :selectAction="fetchUserTypeList"
            :paramsKey="{
             name:'name'
            }"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Name }}
          </template>
        </b-table-column>
        <!-- actions  -->
        <b-table-column 
        field="Actions" 
        label="Actions" 
        width="310"
        >
          <!-- multiple actions  -->
          <template v-slot:header="{ column }">
            <span class="is-relative" v-if="getSelectedRows.length <= 1">{{ column.label }} </span>
            <ActionCell :data="getSelectedRows" type="multiSelection" v-else />
          </template>
          <!-- single action  -->
          <template v-slot="props">
            <ActionCell :data="props.row.Data" />
          </template>
        </b-table-column>
        <!-- details  -->
        <template #detail="props">
        <ChildrenGrid :gridData="props.row.Children" />
        </template>
      </b-table>
      </div>
    </section>
  </Layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
//grid userType
import { userTypesColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import Modal from "@/components/modal/Modal";
import ActionCell from "@/components/userTypes/ActionCell";
import UpdateActionForm from "@/components/userTypes/UpdateActionForm";
import MoveActionForm from "@/components/userTypes/MoveActionForm";
import ChildrenGrid from './ChildrenGrid';
import SearchInput from "@/components/userTypes/SearchInput";
import GridSettings from "@/components/grid/GridSettings";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  title:"User Types",
  components: {
    Layout,
    ChildrenGrid,
    PageHeader,
    ColumnsSwitcher,
    Modal,
    ActionCell,
    UpdateActionForm,
    MoveActionForm,
    SearchInput,
    GridSettings,
  },
  name: "UserType",
    mixins: [exportExel],
  data() {
    return {
      title: "User Types",
      showDetailIcon: true,
      limit: 10,
      currentPage:1,
      // columns for export
      columns: {
        Name: "Name",
      },
      facial_recognition:'facial_recognition',
      facial_recognition_value:null,
      record_retention:'record_retention',
      record_retention_value:null,
    };
  },
  watch:{
   getUserTypeList(data){
     data&&data.length>0&&data.map(type => {
       type.settings&&type.settings.length>0&&type.settings.map(settingItem => {
         settingItem.name == this.facial_recognition
         ?
         this.facial_recognition_value = settingItem.pivot.value
         :
         this.record_retention_value = settingItem.pivot.value
       })
     })
   }
  },
  computed: {
    ...mapGetters("userType", ["getUserTypeList","getAllUsersTypes"]),
    ...mapGetters("grid", ["getTableHeaders", "getSelectedRows", "getLoading"]),
    rowsData() {
      return this.getUserTypeList && this.getUserTypeList.length > 0
        ? this.getUserTypeList.map((item) => {
            return {
              id: item.id,
              Name: item.name,
              Parent: item.parent ? item.parent.name : "--",
              FaceRetention:item.settings&&item.settings.length>1?item.settings[0].pivot.value:'-',
              DataRetention:item.settings&&item.settings.length>1?item.settings[1].pivot.value:'-',
              parentId: item.parent_id,
              Data: item,
              Children:item.children,
              ChildrendData:item.children.length>0?item.children.map(type=>type.name):''
            };
          })
        : [];
    },
    exportedData() {
      return this.getAllUsersTypes && this.getAllUsersTypes.length > 0
        ? this.getAllUsersTypes.map((item) => {
            return {
              id: item.id,
              Name: item.name,
              Parent: item.parent ? item.parent.name : "--",
              FaceRetention:item.settings&&item.settings.length>1?item.settings[0].pivot.value:'-',
              DataRetention:item.settings&&item.settings.length>1?item.settings[1].pivot.value:'-',
              parentId: item.parent_id,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("userType", ["fetchUserTypeList","fetchAllUserType"]),
    ...mapActions("grid", ["onTableHeader", "resetTableHeaders"]),
    ...mapActions("modal", ["onResetModal"]),
    onToggleVisible() {
      this.$bvModal.show("userType");
    },
    fetchTableHeaders(){
    this.onTableHeader({
      url: "user-types",
      headers: userTypesColumns,
    });
    },
    updatePageRecords(value){
      this.limit = value
    }
  },
  mounted() {
    this.fetchTableHeaders();
    this.fetchUserTypeList();
    this.fetchAllUserType(); // for export exel
  },
  destroyed() {
    this.resetTableHeaders();
    this.onResetModal();
  },
};
</script>

<style lang="scss">
.user-types-grid-wrapper{
  .setting-wrapper{
    background-color: #fff;
  }
  .hide-arrow-icon-detail a[role="button"] {
    display: none;
  }
  .b-table .table tr.detail .detail-container {
    padding: 0 !important;
  }
  .recods-select{
  min-height: 30px;
    .multiselect__tags {
        min-height: calc(1.1em + 0.64rem + 0.5px) !important;
        padding: 0.17rem 0.55rem !important;
        border: 1px solid #103f5e !important;
    }
}
}
</style>
