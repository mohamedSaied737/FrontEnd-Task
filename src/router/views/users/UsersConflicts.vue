<script>
import { mapActions, mapGetters } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import UserForm from "@/components/users/user-form";
// grid imports
import ImageCell from "@/components/sharedCells/ImageCell";
import ActionCell from "@/components/usersSettings/ActionCell";
import { usersColumns } from "@/utils/dataSource";
import UserMerge from "@/components/usersSettings/UserMerge";
import store from "@/state/store";
import Multiselect from "vue-multiselect";

export default {
  title:"Duplication Control Board",
  name: "UsersSettings",
  components: {
    Layout,
    PageHeader,
    UserForm,
    ImageCell,
    ActionCell,
    UserMerge,
    Multiselect,
  },
  data() {
    return {
      title: "Duplication Control Board",
      isAddModal: false,
      // columns for export
      statusOptions: ["Active", "Deactivate"],
      systemUserOptions: ["Yes", "No"],
      usersColumns: usersColumns,
      showDetailIcon: false,
      reasonOptions: [
        { id: 0, name: "First Name" },
        { id: 1, name: "Last Name" },
        { id: 2, name: "User ID" },
        { id: 3, name: "RFID Number" },
        { id: 4, name: "Face ID" },
        { id: 5, name: "Email" },
      ],
      reasons: null,
    };
  },
  watch: {
    reasons(reasons) {
      if (reasons && reasons.length == 0) {
        this.reasons = null;
      }
      if (reasons) {
        this.fetchDuplicatedUsers({ filterBy: reasons });
      } else {
        this.fetchDuplicatedUsers({ filterBy: [] });
      }
    },
  },
  computed: {
    ...mapGetters("users", ["getduplicatedUserse", "getUsers"]),
    ...mapGetters("grid", [
      "getSelectedRows",
      "getTableHeaders",
      "getLoading",
      "getRecordsCount",
    ]),
    rowsData() {
      let entity = store.getters["authfack/currentEntity"];
      return this.getduplicatedUserse && this.getduplicatedUserse.length > 0
        ? this.getduplicatedUserse.map((user, i) => {
            let imageProfile = user.image;
            if (imageProfile !== null) {
              imageProfile = imageProfile.replace("entity_id", entity.id);
            }
            return {
              Image: imageProfile,
              FirstName: user.first_name,
              LastName: user.last_name,
              ID: user.user_id,
              Email: user.email,
              RFID: user.rfid_number,
              FaceID: user.faceID ? user.faceID : "-",
              Reason: this.checkReason(user.reason),
              Data: user,
              children: user.children,
              key: i,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("users", ["fetchDuplicatedUsers", "getAll"]),
    ...mapActions("modal", ["onResetModal"]),
    ...mapActions("dailyLogbook", ["fetchUserTypes"]),
    ...mapActions("grid", [
      "onTableHeader",
      "updateTableHeaders",
      "resetTableHeaders",
      "resetFilterValues",
      "onSetFilterValue",
    ]),
    setResetModal() {
      this.$bvModal.hide("add-edit-user");
    },
    hideModalTrigger() {
      this.$store.dispatch("modal/setData", null);
      this.isAddModal = false;
    },
    onRowClicked() {
      return "";
    },
    toggle(row) {
      row.isCollapse = !row.isCollapse;
      this.$refs.table.toggleDetails(row);
    },
    checkReason(reasonKey) {
      // first_name => 0
      // last_name =>1
      // user_id =>2
      // rfid_number => 3
      // faceID=>4
      // email=>5

      switch (reasonKey) {
        case 0:
          return "First Name Duplicated";
        case 1:
          return "Last Name Duplicated";
        case 2:
          return "User ID Duplicated";
        case 3:
          return "RFID Number Duplicated";
        case 4:
          return "Face ID Duplicated";
        case 5:
          return "Emails Duplicated";
        default:
          "";
      }
    },
  },
  mounted() {
    this.fetchDuplicatedUsers();
  },
  destroyed() {
    this.resetTableHeaders();
    this.resetFilterValues();
    this.onResetModal();
  },
};
</script>

<template>
  <Layout>
    <PageHeader
      :title="title"
      className="d-flex align-items-center justify-content-between"
    >
    </PageHeader>
    <!-- user merge -->
    <b-modal id="userMerge" hide-footer hide-header size="lg">
      <UserMerge />
    </b-modal>
    <!-- update user  -->
    <b-modal
      id="add-edit-user"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="add-edit-user"
      @hide="hideModalTrigger"
    >
      <slot name="modal-header">
        <div class="modal-header flex-row">
          <h5 class="modal-title">
            <slot name="modal-title">
              {{ isAddModal ? "Add user" : "Edit user" }}
            </slot>
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
      <UserForm :data="$store.state.modal.data" />
    </b-modal>
    <section class="tree-grid pt-3 px-2" style="background-color: white">
      <!-- grid -->
      <b-table
        :data="rowsData"
        ref="table"
        detailed
        custom-detail-row
        :default-sort="['name', 'asc']"
        detail-key="key"
        :show-detail-icon="showDetailIcon"
        :checkable="false"
        :striped="false"
        :narrowed="false"
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
              class="icon-wrapper"
              :class="props.row.isCollapse ? 'is-expanded' : ''"
            >
              <i
                v-if="props.row.children.length > 0"
                class="mdi toggle-icon mdi-chevron-right"
                @click="toggle(props.row)"
              ></i>
            </div>
          </template>
        </b-table-column>
        <!-- image -->
        <b-table-column field="Image" :visible="true" label="" v-slot="props">
          <ImageCell
            :image="props.row.Image"
            :name="props.row.FirstName.charAt(0)"
          />
        </b-table-column>
        <!-- first name -->
        <b-table-column
          field="FirstName"
          :visible="true"
          label="First Name"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.FirstName }}
          </template>
        </b-table-column>
        <!-- last name -->
        <b-table-column
          field="LastName"
          label="Last Name"
          sortable
          searchable
          :visible="true"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.LastName }}
          </template>
        </b-table-column>
        <!-- id -->
        <b-table-column
          field="ID"
          label="ID"
          sortable
          searchable
          :visible="true"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.ID }}
          </template>
        </b-table-column>
        <!-- email -->
        <b-table-column
          field="Email"
          label="Email"
          sortable
          searchable
          :visible="true"
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.Email }}
          </template>
        </b-table-column>
        <!-- RFID -->
        <b-table-column
          field="RFID"
          :visible="true"
          label="RFID"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.RFID }}
          </template>
        </b-table-column>
        <!-- FACE ID  -->
        <b-table-column
          field="FaceID"
          :visible="true"
          label="FaceID"
          sortable
          searchable
        >
          <template slot="searchable" slot-scope="props">
            <b-input
              class="user-search-input"
              v-model="props.filters[props.column.field]"
              placeholder="Filter"
              size="md"
            />
          </template>
          <template v-slot="props">
            {{ props.row.FaceID }}
          </template>
        </b-table-column>
        <!-- reason -->
        <b-table-column
          field="Reason"
          :visible="true"
          label="Reason"
          sortable
          searchable
        >
          <template slot="searchable">
            <multiselect
              class="no-wrap"
              v-if="true"
              v-model="reasons"
              :options="reasonOptions"
              placeholder="Filter"
              multiple
              trackBy="name"
              label="name"
              :show-labels="false"
              :hideSelected="true"
              style="min-width: 120px"
            />
          </template>
          <template v-slot="props">
            <span class="font-weight-normal text-danger no-wrap">
              {{ props.row.Reason }}
            </span>
          </template>
        </b-table-column>
        <!-- actions -->
        <b-table-column field="Actions" label="Actions">
          <template v-slot="props">
            <ActionCell type='parent' :data="props.row.Data" />
          </template>
        </b-table-column>
        <!-- details  -->
        <template slot="detail" slot-scope="props">
          <tr v-for="item in props.row.children" :key="item.id">
            <td></td>
            <!-- image  -->
            <td v-show="true">
              <ImageCell
                :image="item.image"
                :name="item.first_name.charAt(0)"
              />
            </td>
            <!-- first_name  -->
            <td v-show="true">{{ item.first_name }}</td>
            <!-- last name  -->
            <td v-show="true">{{ item.last_name }}</td>
            <!-- id  -->
            <td v-show="true">{{ item.user_id }}</td>
            <!-- email  -->
            <td v-show="true">{{ item.email }}</td>
            <!-- rfid  -->
            <td v-show="true">{{ item.rfid_number }}</td>
            <!-- faceId  -->
            <td v-show="true">{{ item.faceID }}</td>
            <!-- reason  -->
            <td v-show="true">{{ item.reason }}</td>
            <td v-show="true">
            <ActionCell :data="item" />
            </td>
          </tr>
        </template>
      </b-table>
    </section>
  </Layout>
</template>
<style lang="scss" scoped>
.tree-grid {
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
}
</style>