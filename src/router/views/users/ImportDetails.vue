<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/grid/DataTable";
import ImageCell from "@/components/sharedCells/ImageCell";
import { importUsersDetailsColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import Modal from "@/components/modal/Modal";
import { exportExel } from "@/utils/mixins/exportMixin";

export default {
  mixins: [exportExel],
  title:"Import Details",
  components: {
    Layout,
    DataTable,
    PageHeader,
    ImageCell,
    ColumnsSwitcher,
    Modal,
  },
  name: "ImportDetails",
  data() {
    return {
      title: "Import Details",
    };
  },
  computed: {
    ...mapGetters("usersImport", ["getImportDetails","getLoadingStatus"]),
    ...mapGetters("grid", ["getTableHeaders"]),
    
    
    rowsData() {
      return this.getImportDetails && this.getImportDetails.length > 0
        ? this.getImportDetails.map((item) => {
            return {
              Image: item.image,
              Name: item.name,
              UserType: item.userType,
              UserId: item.userId,
              RFID: item.rfidNumber,
              Email: item.email,
              PhoneNumber: item.phone,
              Status: item.status,
              Comments:item.importErrors,
              importId: item.importId,
              id:item.id,
             importable:item.importable     
            };
          })
        : [];
    },
    selectedRowsIds(){
      return  this.getSelectedRows.length>0&&this.getSelectedRows.map(col => col.id
      )
    }
  },
  methods: {
    ...mapActions("usersImport", ["fetchImportedDetails"]),
    ...mapActions("grid", ["onRemoveSelectedRow","onTableHeader", "resetTableHeaders"]),
        onToggleVisible() {
      this.$bvModal.show("importQueueDetails");
    },
  },
  mounted(){
      this.onTableHeader({
      url: "import/queue/details",
      headers: importUsersDetailsColumns,
    });
      this.fetchImportedDetails(this.$route.params.id)
  },
  destroyed(){
    this.resetTableHeaders();
  }
};
</script>
<template>
  <Layout>
    <section id="importUsers">
      <PageHeader
        :title="title"
        className="d-flex align-items-center justify-content-between"
      >
        <router-link 
            to=/users/import/queue
            >
            <b-button class="d-flex align-items-center px-3 top-page-btn" variant="outline-primary" pill size="sm">
                <i class="bx bx-right-arrow-alt font-size-18 mr-2"></i>
                 Import Queue
              </b-button>
              </router-link >
      </PageHeader>
      <!-- columns view -->
    <Modal :title="'View List Settings'" modalID="importQueueDetails">
      <template>
      <ColumnsSwitcher :tableHeaders="getTableHeaders" url='/import/queue/details' modalID="importQueueDetails" />
      </template>
    </Modal>
      <!-- Grid start -->
      <DataTable
        :rows="rowsData"
        :hasCheckbox="false"
        :hasBEpagination="false"
        :hasBEfiltering="false"
        :hasBEsorting="false"
        :hasDetails="false"
        :showExport="false"
        :gridSettings="true"
        :hasHeaderCheckable="false"
        :isRowCheckable="(row) => row.importable != false"
        :iconAction="onToggleVisible"
        :columns="getExportHeaders"
        :loading="getLoadingStatus"
        :isSelectable="''"
      >
        <!-- image -->
        <b-table-column  :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Image : true
        " field="Image"  label="" v-slot="props">
          <ImageCell :image="props.row.Image" />
        </b-table-column>
        <!-- name -->
        <b-table-column  field="Name" :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Name : true
        " searchable label="Name">
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
          field="UserType"
          :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.UserType : true
        " searchable
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
        <b-table-column  field="UserId" :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.UserId : true
        " searchable label="ID">
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
        <b-table-column  field="RFID" :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.RFID : true
        " searchable label="RFID">
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
        <b-table-column  field="Email" :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Email : true
        " searchable label="Email">
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
          field="PhoneNumber"
          :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.PhoneNumber : true
        " searchable
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
          field="Status"
          :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Status : true
        " searchable
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
            <span 
            class="font-weight-bold status-text px-2 py-1 rounded"
            :class=" props.row.Status == 'Created' ? 'bg-green text-white' : 'bg-red text-white ' "
            >  {{ props.row.Status }}</span>
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
.import-btn{
    &:disabled {
    cursor: not-allowed;
  }
}
</style>
