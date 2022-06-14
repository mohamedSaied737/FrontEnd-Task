<template>
  <Layout>
    <b-modal id="editIntegration" scrollable hide-footer hide-header size="lg">
      <EditIntegModal />
    </b-modal>
    <b-modal id="syncIntegration" scrollable hide-footer hide-header size="lg">
      <SyncIntegModal />
    </b-modal>
    <div
      class="d-flex loading-container"
      v-if="getSyncStatusStage == 'processing'"
    >
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="d-block">
        <p>{{ getSyncStatusText }}</p>
        <span class="count">{{ getSyncStatusmsg }}</span>
      </div>
    </div>
    <div
      class="d-flex loading-container"
      v-if="getMigrateStatusStage == 'processing'"
    >
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="d-block">
        <p>{{ getMigrateStatusText }}</p>
        <span class="count">{{ getMigrateStatusmsg }}</span>
      </div>
    </div>
    <div
      class="loading-container text-center"
      v-if="getSyncStatusStage == 'failed'"
    >
      <h6 class="mb-3">{{ getSyncStatusText }}</h6>
      <div class="action-btns">
        <button
          class="submit-btn btn btn-primary"
          size="md"
          @click="
            retrySync({ id: getIntegId, isFailed: true, syncId: getSyncId })
          "
        >
          <span>{{ getSyncStatusmsg }}</span>
        </button>
      </div>
    </div>
    <div
      class="loading-container text-center"
      v-if="getSyncStatusStage == 'auth-failed'"
    >
      <h6 class="mb-3">{{ getSyncStatusText }}</h6>
      <div class="action-btns">
        <router-link
          :to="`/view-integration/${getIntegId}/${getIntgData.name}`"
        >
          <button class="submit-btn btn btn-primary" size="md">
            <span>{{ getSyncStatusmsg }}</span>
          </button>
        </router-link>
      </div>
    </div>
    <PageHeader
      className="d-flex align-items-center justify-content-between"
      v-if="getSyncStatusStage == 'done'"
    >
    </PageHeader>
    <!-- <section class="white-bg-sec pb-3" v-if="getSyncStatusStage == 'done'">
      <div class="d-flex error-count mb-3">
        <h5>All Records List</h5>
        <span>{{getValidUsersCount}}</span>
      </div>
      <p>
        These are the final records that will be synced with your list. Click
        “Sync” to confirm.
      </p>
      <DataTable class="my-2 mt-2 integration-table" :rows="rowsData" :isSelectable="false">
        <b-table-column field="id" label="Id" v-slot="props">
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="fullName" label="full Name" v-slot="props">
          {{ props.row.fullName }}
        </b-table-column>
        <b-table-column
          field="emailAddress"
          label="Email Address"
          v-slot="props"
        >
          {{ props.row.emailAddress }}
        </b-table-column>
        <b-table-column field="phoneNumber" label="Phone Number" v-slot="props">
          {{ props.row.phoneNumber }}
        </b-table-column>
        <b-table-column field="RFID" label="RFID" v-slot="props">
          {{ props.row.RFID }}
        </b-table-column>
        <b-table-column field="userType" label="User Type" v-slot="props">
          {{ props.row.userType }}
        </b-table-column>
      </DataTable>
      <div class="action-btns mt-3">
        <button class="submit-btn btn btn-primary" size="md">
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
    </section> -->
  </Layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// import DataTable from "@/components/grid/DataTable";
import EditIntegModal from "@/components/integration/EditIntegrationModal";
import SyncIntegModal from "@/components/integration/SyncIntegrationModal";
export default {
  components: {
    Layout,
    PageHeader,
    EditIntegModal,
    // DataTable,
    SyncIntegModal,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  methods: {
    ...mapActions("integration", [
      "startFirstSync",
      "StartSyncUsers",
      "retrySync",
    ]),
  },
  // mounted() {
  //   console.log('startFirstSync');
  //   this.startFirstSync(82);
  // },
  computed: {
    ...mapGetters("integration", [
      "getLoading",
      "getSyncStatusText",
      "getSyncStatusStage",
      "getSyncStatusmsg",
      "getValidUsers",
      "getValidUsersCount",
      "getMigrateStatusText",
      "getMigrateStatusStage",
      "getMigrateStatusmsg",
      "getIntegId",
      "getIntgData",
      "getSyncId",
    ]),
    rowsData() {
      return this.getValidUsers && this.getValidUsers.length > 0
        ? this.getValidUsers.map((el) => {
            return {
              id: el.id,
              fullName: el.first_name + el.last_name,
              emailAddress: el.email,
              phoneNumber: el.phone,
              RFID: el.dir_int_type,
              userType: JSON.parse(JSON.stringify(el.user_type)),
            };
          })
        : [];
    },
  },
  beforeMount() {
    // this.fetchValidTempUsers();
  },
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 35%;
  left: 40%;
  background-color: white;
  padding: 35px 30px;
  border-radius: 50px;
  min-width: 175px;
  h6 {
    font-weight: bold;
  }
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
.grid-wrapper.border {
  border: 0px !important;
}
.table thead th {
  color: #939393;
  background-color: #f8f9fa;
  border-radius: 5px;
  border-bottom: 0px;
}
.table th,
.table td {
  border-top: 0px;
}
</style>
