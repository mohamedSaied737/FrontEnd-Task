<script>
  import { mapActions, mapGetters } from "vuex";
  import Layout from "../../layouts/main";
  import PageHeader from "@/components/page-header";
  import UserForm from "@/components/users/user-form";
  // grid imports
  import DataTable from "@/components/grid/DataTable";
  import ImageCell from "@/components/sharedCells/ImageCell";
  import FilterInput from "@/components/sharedCells/FilterInput";
  import StatusCell from "@/components/sharedCells/StatusCell";
  import ActionCell from "@/components/users/ActionCell";
  import Modal from "@/components/modal/Modal";
  import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
  import { usersColumns } from "@/utils/dataSource";
  import UserCheckinAction from "@/components/sharedCells/userAction/UserCheckinAction";
  import ChangeUserType from "@/components/users/ChangeUserType";
  import AddDocument from "@/components/users/AddDocument";
  import VaccineDetails from "@/components/users/VaccineDetails";
  import { exportExel } from "@/utils/mixins/exportMixin";
  import PassportAction from "@/components/users/PassportAction";
  import UserStatusToggle from "@/components/users/UserStatusToggle";

  export default {
    title:"Users",
    name: "Users",
    mixins: [exportExel],
    components: {
      Layout,
      PageHeader,
      UserForm,
      DataTable,
      ImageCell,
      FilterInput,
      StatusCell,
      ActionCell,
      ColumnsSwitcher,
      Modal,
      UserCheckinAction,
      ChangeUserType,
      AddDocument,
      VaccineDetails,
      PassportAction,
      UserStatusToggle
    },
    data() {
      return {
        isAddModal: false,
        // columns for export
        statusOptions: ["Active", "Deactivate"],
        vaccineOptions: ["Vaccinated", "Unchecked", "Negative PCR", "Positive PCR", "Expired", "Disabled"],
        systemUserOptions: ["Yes", "No"],
        vaccineDocument: false,
        usersColumns: usersColumns,
        userParams: {
          firstName: null,
          lastName: null,
          id: null,
          email: null,
          userId: null,
          rfid: null,
          UserType: null,
        },
      };
    },
    computed: {
      ...mapGetters("users", ["getUsers", "getDocuments", "getDocumentSelected"]),
      ...mapGetters("grid", [
        "getSelectedRows",
        "getTableHeaders",
        "getLoading",
        "getRecordsCount",
        "getVaccinePCRColumnAppearance",
      ]),
      ...mapGetters("dailyLogbook", ["getUserTypes"]),
      ...mapGetters("sites", ["getCompliances"]),
      ...mapGetters("authfack", ["currentEntity"]),
      pageInfo() {
        let title = this.$route.params.name ? this.$route.params.name : "Users";
        let items = [
          {
            text: "Users",
            href: "/",
          },
          {
            text: this.$route.params.name ? this.$route.params.name : "Users",
            active: true,
          },
        ];
        return {
          title,
          items,
        };
      },
      rowsData() {
        let entity = this.currentEntity;
        return this.getUsers && this.getUsers.length > 0
          ? this.getUsers.map((user) => {
            let imageProfile = user.image;
            if (imageProfile !== null) {
              imageProfile = imageProfile.replace("entity_id", entity.id);
            }
            return {
              Image: imageProfile,
              FirstName: (user.first_name&&user.first_name.length)?user.first_name:'-',
              LastName: (user.last_name&&user.last_name.length)?user.last_name:'-',
              UserType: user.current_entity && user.current_entity.user_type ? user.current_entity.user_type.name : '-',
              ID: user.user_id&&user.user_id.length?user.user_id:'-',
              Email: (user.email&&user.email.length)?user.email:'-',
              SystemUser: user.system_user == 0 ? "No" : "Yes",
              Status: user.is_active == 1 ? "Active" : "Deactivated",
              VaccineDocument:(user.id==entity.id)?"": (user.last_document_vaccine ||user.last_document_pcr) ? this.vaccineDocumentText(user.last_document_vaccine,user.last_document_pcr) : 'Unchecked',
              RFID: user.rfid_number?user.rfid_number:'-',
              PhoneNumber: user.phone?user.phone:'-',
              Data: user,
              UniqueId: user.id,
              FullName: user.fullName&&user.fullName.length?user.fullName:'-',
              LastVaccine: user.last_document_vaccine ?user.last_document_vaccine:user.last_document_pcr,
              is_default_user: !!user.is_default_user,
            };
          })
          : [];
      },
      getUsersURL() {
        return Object.keys(this.$route.params).length > 0
          ? this.$route.fullPath
          : "/users";
      },
    },
    watch: {
      getDocuments(Documents) {
        this.vaccineDocument = Documents.length > 0;
      },
    },
    methods: {
      ...mapActions("users", ["getAll", "resetUsersData", "fetchDocuments", "resetLoading"]),
      ...mapActions("modal", ["onResetModal", "setData"]),
      ...mapActions("dailyLogbook", ["fetchUserTypes"]),
      ...mapActions("grid", [
        "onTableHeader",
        "updateTableHeaders",
        "resetTableHeaders",
        "resetFilterValues",
        "onSetFilterValue",
        "checkVaccinePCRColumnAppearance",
      ]),
      setUserData(data) {
        this.setData({
          type: 'user_document',
          data
        });
      },
      vaccineDocumentText(docmentVaccine ,docmentPcr) {
        let docment = null;
        if(docmentVaccine){
          docment = docmentVaccine;
        }else{
          docment = docmentPcr;
        }
        let vaccine = null;
        if (docment.status == 'enabled') {
          if (docment.type == 'covid_pcr') {
            vaccine = docment.metadata.certificateModel.tests[0].testResult == "Detected"?"Positive PCR":"Negative PCR";
          }
          if (docment.type == 'covid_vaccine' ||docment.type == 'covid_recovery') {
            if (docment.is_expiry == 1) {
              vaccine = 'Expired';
            } else {
              vaccine = 'Vaccinated';
            }
          }
        } else {
          if (docment.status == 'deleted') {
            vaccine = 'Unchecked'
          } else {
            vaccine = docment.status
          }
        }
        return vaccine
      },
      renderVaccineDocumentColor(type) {
        switch (type) {
          case 'Vaccinated':
            return 'text-primary font-weight-bold'
          case 'Unchecked':
            return 'text-secondary'
          case 'Expired':
            return 'text-warning font-weight-bold'
          case 'Negative PCR':
            return 'text-success font-weight-bold'
          default:
            return 'text-danger font-weight-bold';
        }
      },
      setResetModal() {
        this.$bvModal.hide("add-edit-user");
      },
      hideModalTrigger() {
        this.setData(null);
        this.isAddModal = false;
      },
      openAddUserModal(){
        this.setData({});
       this.isAddModal = true;

      },
      importUserRedirect() {
        this.$router.push({ path: "/user/import" });
      },
      onToggleVisible() {
        this.$bvModal.show(
          Object.keys(this.$route.params).length > 0
            ? this.$route.params.name
            : "users"
        );
      },
      filterOnUsersTypes() {
        return Object.keys(this.$route.params).length > 0
          ? this.onSetFilterValue({ UserType: this.$route.params.id })
          : this.onSetFilterValue({});
      },
      onRowClicked() {
        return "";
      },
      fetchTableHeaders() {
        this.onTableHeader({
          url: this.getUsersURL,
          headers: usersColumns,
        });
      },
      filterByUserParams() {
        const {
          $route: { query },
        } = this;
        if (Object.keys(query).length > 0) {
          this.userParams.id = query.id;
          this.getUsers.map((user) => {
            if (user.id == this.userParams.id) {
              this.userParams.firstName = user.first_name;
              this.userParams.lastName = user.last_name;
              this.userParams.email = user.email;
              this.userParams.userId = user.rfid_number;
              this.userParams.rfid = user.user_id;
              this.userParams.UserType = user.user_type;
            }
          });
        }
      },
    },
    mounted() {
      window.addEventListener("unload", this.resetFilterValues());
      this.fetchTableHeaders();
      this.filterOnUsersTypes();
      this.userParams.id && this.onSetFilterValue({ 'id': this.userParams.id });
      setTimeout(() => {
        // call users after 0.5 sec to clear filter values on refresh
        this.getAll()
      }, 400);
    },
    beforeMount() {
      this.filterByUserParams();
      this.fetchDocuments();
      this.checkVaccinePCRColumnAppearance();
      this.resetLoading();
    },
    destroyed() {
      this.resetTableHeaders();
      this.resetFilterValues();
      this.onResetModal();
      this.resetUsersData();
    },
  };
</script>

<template>
  <Layout>
    <PageHeader :title="pageInfo.title" :items="pageInfo.items"
      className="d-flex align-items-center justify-content-between">
      <div class="page-title-right mb-2 d-flex">
        <b-button pill class="d-flex align-items-center px-3 mx-3 top-page-btn" variant="primary" size="sm"
          v-on:click="openAddUserModal" v-b-modal.add-edit-user>
          <i class="bx bxs-user-plus font-size-18 mr-2"></i>
          Add User
        </b-button>
        <router-link to=/users/import>
          <b-button pill class="d-flex align-items-center px-3 top-page-btn" variant="outline-primary" size="sm">
            <i class="bx bx-import font-size-18 mr-2"></i>
            Import Users
          </b-button>
        </router-link>
      </div>
    </PageHeader>
    <!-- add document  -->
    <b-modal id="addDocument" :scrollable='getDocumentSelected?true:false' hide-footer hide-header size="lg">
      <AddDocument />
    </b-modal>
    <!-- vaccine details  -->
    <b-modal id="vaccineDetails" scrollable hide-footer hide-header size="lg">
      <VaccineDetails />
    </b-modal>
    <!-- :scrollable='getCompliances.length>0?true:false'  -->
    <!-- check in user  -->
    <b-modal id="dashboardAction" hide-footer hide-header size="lg" :scrollable="true">
      <UserCheckinAction />
    </b-modal>
    <!-- change user type -->
    <b-modal id="changeUserType" hide-footer hide-header size="lg">
      <ChangeUserType />
    </b-modal>
    <!-- update user  -->
    <b-modal id="add-edit-user" class="popover-modal" hide-header hide-footer no-close-on-esc ref="add-edit-user"
      @hide="hideModalTrigger">
      <slot name="modal-header">
        <div class="modal-header flex-row">
          <h5 class="modal-title">
            <slot name="modal-title" class="font-weight-normal">
              <span class="font-weight-normal">
                {{ isAddModal ? "Add User" : "Edit User" }}
              </span>
            </slot>
          </h5>
          <button type="button" class="header-close" aria-label="headerCloseLabel" @click="setResetModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </slot>
      <UserForm :data="$store.state.modal.data" />
    </b-modal>
    <!-- invite or invoke uesr -->
    <b-modal id="passportAction" scrollable hide-footer hide-header size="lg">
      <PassportAction/>
    </b-modal>
    <!-- invite or invoke uesr -->
    <b-modal id="userStatusToggle" hide-footer hide-header size="lg">
      <UserStatusToggle/>
    </b-modal>
    <Modal :title="'View List Settings'"
      :modalID="Object.keys(this.$route.params).length > 0 ? this.$route.params.name : 'users'">
      <template>
        <ColumnsSwitcher 
        :vaccineColumn='getVaccinePCRColumnAppearance' 
        grid='users' 
        :hasDocuments="getDocuments" :tableHeaders="getTableHeaders" :url="getUsersURL"
          :modalID="Object.keys(this.$route.params).length > 0 ?this.$route.params.name : 'users'"
          :fetchTableHeaders="fetchTableHeaders" />
      </template>
    </Modal>
    <!-- grid -->
    <DataTable :rows="rowsData" :columns="getExportHeaders" :getDataAction="getAll" :loading="getLoading"
      :iconAction="onToggleVisible" :hasCheckbox="userParams.id?false:true" :hasBEpagination="true"
      :hasBEfiltering="true" :hasBEsorting="true" :hasBEexport="true" :hasDetails="false" :gridSettings="true"
      :isSelectable="onRowClicked" :recordsCount="getRecordsCount" gridName="users" :hasDocuments="getDocuments" :vaccineColumn='getVaccinePCRColumnAppearance'>
      <!-- image -->
      <b-table-column field="Image" :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Image : true
        " label="" v-slot="props">
        <ImageCell :image="props.row.Image" :name="props.row.FirstName.charAt(0)" />
      </b-table-column>
      <!-- first name -->
      <b-table-column field="FirstName" width="150" :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.FirstName
            : true
        " label="First Name" sortable :searchable='this.userParams.id?false:true'>
        <template slot="searchable">
          <FilterInput placeholder="filter" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'FirstName' }" type="default"
            :defaultSelected="userParams.firstName?userParams.firstName:''" />
        </template>
        <template v-slot="props">
          {{ props.row.FirstName }}
        </template>
      </b-table-column>
      <!-- last name -->
      <b-table-column field="LastName" width="150" label="Last Name" sortable
        :searchable='this.userParams.id?false:true' :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.LastName
            : true
        ">
        <template slot="searchable">
          <FilterInput placeholder="filter" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'LastName' }" type="default"
            :defaultSelected="userParams.lastName?userParams.lastName:''" />
        </template>
        <template v-slot="props">
          {{ props.row.LastName }}
        </template>
      </b-table-column>
      <!-- user types -->
      <b-table-column field="UserType" label="User Type" width="auto" sortable
        :searchable='this.userParams.id?false:true' :visible="
          this.$route.params && this.$route.params.name
            ? false
            : Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.UserType
            : true
        ">
        <template slot="searchable">
          <FilterInput placeholder="filter" :options="getUserTypes" label="name" :openAction="fetchUserTypes"
            :selectAction="getAll" :paramsKey="{ objectKey: 'filterBy', valueKey: 'UserType' }" type="multiSelect" />
        </template>
        <template v-slot="props">
          {{ props.row.UserType }}
        </template>
      </b-table-column>
      <!-- id -->
      <b-table-column field="ID" label="ID" sortable :searchable='this.userParams.id?false:true' width="auto"
        :visible="Object.keys(getTableHeaders).length > 0 ? getTableHeaders.ID : true">
        <template slot="searchable">
          <FilterInput placeholder="filter" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'ID' }" type="default"
            :defaultSelected="userParams.userId?userParams.userId:''" />
        </template>
        <template v-slot="props">
          {{ props.row.ID }}
        </template>
      </b-table-column>
      <!--RFID-->
            <b-table-column field="RFID" label="RFID" sortable :searchable='this.userParams.RFID?false:true' width="auto"
        :visible="Object.keys(getTableHeaders).length > 0 ? getTableHeaders.RFID : true">
        <template slot="searchable">
          <FilterInput placeholder="filter" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'RFID' }" type="default"
            :defaultSelected="userParams.rfid?userParams.rfid:''" />
        </template>
        <template v-slot="props">
          {{ props.row.RFID }}
        </template>
      </b-table-column>
      <!-- email -->
      <b-table-column field="Email" label="Email" width="auto" sortable :searchable='this.userParams.id?false:true'
        :visible="
          Object.keys(getTableHeaders).length > 0 ? getTableHeaders.Email : true
        ">
        <template slot="searchable">
          <FilterInput placeholder="filter" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'Email' }" type="default"
            :defaultSelected="userParams.email?userParams.email:''" />
        </template>
        <template v-slot="props">
          {{ props.row.Email }}
        </template>
      </b-table-column>
      <!-- system user -->
      <b-table-column field="SystemUser" :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.SystemUser
            : true
        " label="System User" sortable :searchable='this.userParams.id?false:true'>
        <template slot="searchable">
          <FilterInput placeholder="filter" :options="systemUserOptions" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'SystemUser' }" type="selectInput" />
        </template>
        <template v-slot="props">
          {{props.row.SystemUser}}
        </template>
      </b-table-column>
      <!-- status -->
      <b-table-column field="Status" :visible="
          Object.keys(getTableHeaders).length > 0
            ? getTableHeaders.Status
            : true
        " label="Status" sortable :searchable='this.userParams.id?false:true'>
        <template slot="searchable">
          <FilterInput placeholder="filter" :options="statusOptions" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'Status' }" type="selectInput" />
        </template>
        <template v-slot="props">
          <StatusCell :status="props.row.Status" :data="props.row.Data" />
        </template>
      </b-table-column>
      <!-- vaccine document -->
      <b-table-column field="VaccineDocument"
        :visible="(Object.keys(getTableHeaders).length > 0 ? ((getTableHeaders.VaccineDocument && vaccineDocument)|| ( getTableHeaders.VaccineDocument && (getVaccinePCRColumnAppearance&&getVaccinePCRColumnAppearance.userDocument))) : true)"
        label="Document - Vaccine/PCR" sortable searchable>
        <template slot="searchable">
          <FilterInput placeholder="filter" :options="vaccineOptions" :selectAction="getAll"
            :paramsKey="{ objectKey: 'filterBy', valueKey: 'vaccine_document' }" type="selectInput" />
        </template>
        <template v-slot="props">
          <span class="text-capitalize" @click=" props.row.VaccineDocument != 'Unchecked' && setUserData(props.row)"
            v-b-modal="props.row.VaccineDocument != 'Unchecked' &&'vaccineDetails'"
            :class="renderVaccineDocumentColor(props.row.VaccineDocument)">{{props.row.VaccineDocument}}</span>
        </template>
      </b-table-column>
      <!-- actions -->
      <b-table-column field="Actions" label="Actions">
        <!-- multiple actions  -->
        <template v-slot:header="{ column }">
          <span class="is-relative" v-if="getSelectedRows.length <= 1">{{ column.label }} </span>
          <ActionCell :data="getSelectedRows" type="multiSelection" v-else />
        </template>
        <!-- single action  -->
        <template v-slot="props">
          <ActionCell :status="props.row.Status" :data="props.row.Data" />
        </template>
      </b-table-column>
    </DataTable>
  </Layout>
</template>
<style lang="scss">
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

  .add-user-icon {
    font-size: 1.5rem;
    color: #103f5e;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      color: #34c38f;
    }
  }
</style>