<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/grid/DataTable";
import ImageCell from "@/components/sharedCells/ImageCell";
import { importUsersColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import Modal from "@/components/modal/Modal";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  mixins: [exportExel],
  title:"Import Users",
  components: {
    Layout,
    DataTable,
    PageHeader,
    ImageCell,
    ColumnsSwitcher,
    Modal,
  },
  name: "ImportUsers",
  data() {
    return {
      title: "Import Users",
    };
  },
  computed: {
    ...mapGetters("usersImport", ["getImportedUsers", "getLoadingStatus"]),
    ...mapGetters("authfack", ["userDetails", "currentEntity"]),
    ...mapGetters("grid", ["getSelectedRows", "getTableHeaders", "getLoading"]),
    rowsData() {
      return this.getImportedUsers && this.getImportedUsers.length > 0
        ? this.getImportedUsers.map((item) => {
            return {
              Image: item.image,
              Name: item.firstName,
              UserType: item.userType,
              UserId: item.userId,
              RFID: item.rfidNumber,
              Email: item.email,
              PhoneNumber: item.phone,
              Status: item.importStatus,
              Comments: item.importErrors,
              importId: item.importId,
              id: item.id,
              importable: item.importable,
            };
          })
        : [];
    },
    selectedRowsIds() {
      return (
        this.getSelectedRows.length > 0 &&
        this.getSelectedRows.map((col) => col.id)
      );
    },
    getImportableusers() {
      return (
        this.getImportedUsers.length > 0 &&
        this.getImportedUsers.map((col) => col.importable).includes(true)
      );
    },
  },
  methods: {
    ...mapActions("usersImport", ["runImportedUsers"]),
    ...mapActions("grid", ["onTableHeader", "resetTableHeaders"]),
    onSubmitImport(type) {
      this.runImportedUsers({
        user_id: this.userDetails.id,
        entity_id: this.currentEntity.id,
        import_id: this.rowsData[0].importId,
        user_to_import: type == "all" ? ["all"] : this.selectedRowsIds,
      });
    },
    onToggleVisible() {
      this.$bvModal.show("listView");
    },
  },
  mounted() {
    this.onTableHeader({
      url: "import/grid",
      headers: importUsersColumns,
    });
  },
  destroyed() {
    this.resetTableHeaders();
  },
};
</script>
<template>
  <Layout>
    <section id="importUsers">
      <PageHeader
        :title="title"
        className="d-flex align-items-center justify-content-between"
      >
        <div class="page-title-right my-3 d-flex">
          <b-button
            v-if="getImportableusers"
            variant="primary"
            @click="onSubmitImport('all')"
            pill
            :disabled="getLoadingStatus"
            class="btn-lt px-3 mr-4 top-page-btn"
            size="sm"
          >
            <i
              v-if="getLoadingStatus"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
            ></i>
            Import All Valid Records
          </b-button>
          <router-link 
            v-else
            to=/users/import
            >
            <b-button class="d-flex align-items-center px-4 mr-4" variant="primary" pill size="md">
                Back to Import Users
                <i class="bx bx-right-arrow-alt font-size-18 ml-2"></i>
              </b-button>
            </router-link >
          <b-button
            variant="outline-primary"
            @click="onSubmitImport('selection')"
            pill
            :disabled="getLoadingStatus || getSelectedRows.length==0"
            class="import-btn px-4"
            size="md"
          >
            <i
              v-if="getLoadingStatus"
              class="bx bx-loader bx-spin font-size-16 align-middle mr-2"
            ></i>
            Import Selection
          </b-button>
        </div>
      </PageHeader>
      <!-- columns view -->
    <Modal :title="'View List Settings'" modalID="listView">
      <template>
      <ColumnsSwitcher modalID='listView' :tableHeaders="getTableHeaders" url='/import/grid' />
      </template>
    </Modal>
      <!-- Grid start -->
      <DataTable
        :rows="rowsData"
        :columns="getExportHeaders"
        :hasCheckbox="true"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :hasHeaderCheckable="false"
        :isRowCheckable="(row) => row.importable != false"
        :gridSettings="true"
        :iconAction="onToggleVisible"
        :loading="getLoading"
        :isSelectable="''"       
      >
        <div
          class="d-flex align-items-center my-4"
          v-if="getImportedUsers.length == 0"
        >
          <h4 class="text-center mb-0">Data is being loaded</h4>
          <b-spinner class="mx-4" variant="primary" role="status"></b-spinner>
        </div>
        <!-- image -->
        <b-table-column 
         field="Image"         :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Image : true
        " label="" v-slot="props">
          <ImageCell :image="props.row.Image" />
        </b-table-column>
        <!-- name -->
        <b-table-column searchable field="Name"         :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Name : true
        " label="Name">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Name }}
          </template>
        </b-table-column>
        <!-- user type -->
        <b-table-column
          searchable
          field="UserType"
                  :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.UserType : true
        "
          label="User Type"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.UserType }}
          </template>
        </b-table-column>
        <!-- id -->
        <b-table-column searchable field="UserId"   
          :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.ID : true
        " label="ID">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.UserId }}
          </template>
        </b-table-column>
        <!-- rfid -->
        <b-table-column searchable field="RFID"         :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.RFID : true
        " label="RFID">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.RFID }}
          </template>
        </b-table-column>
        <!-- email -->
        <b-table-column searchable field="Email"         :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Email : true
        " label="Email">
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Email }}
          </template>
        </b-table-column>
        <!-- phone number -->
        <b-table-column
          searchable
          field="PhoneNumber"
                  :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.PhoneNumber : true
        "
          label="Phone Number"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            {{ props.row.PhoneNumber }}
          </template>
        </b-table-column>
        <!-- status -->
        <b-table-column
          searchable
          field="Status"
                  :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Status : true
        "
          label="Status"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <span class="font-weight-bold">  {{ props.row.Status }}</span>
          </template>
        </b-table-column>
        <!-- comments -->
        <b-table-column
          searchable
          field="Comments"
                  :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Comments : true
        "
          label="Comments"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              v-model="props.filters[props.column.field]"
              placeholder="Search..."
              size="sm"
            />
          </template>
          <template v-slot="props">
            <ul v-if="props.row.Comments.length>0||Object.keys(props.row.Comments).length>0">
              <li
              class="font-weight-bold rounded text-red mb-1 px-3"
              v-for="(comment,i) in props.row.Comments"
              :key="i"
              >
              {{comment}} ,
              </li>
            </ul>
            <span
            v-else
              class="rounded text-white px-3 bg-green "
            >
              OK
            </span>
          </template>
        </b-table-column>
      </DataTable>
      <!-- Grid end -->
    </section>
  </Layout>
</template>

<style lang='scss' scoped>
@font-face {
  font-family: "regular-lato";
  src: url("../../../assets/fonts/Lato/Lato-Regular.ttf");
}
.import-btn {
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
