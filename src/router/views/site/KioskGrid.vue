<template>
  <b-table
    :data="rowsData"
    ref="table"
    :mobile-cards="false"
    detailed
    :default-sort="['name', 'asc']"
    detail-key="id"
    :show-detail-icon="showDetailIcon"
    :row-class="(row, index) => 'hide-arrow-icon-detail'"
    checkable
    :header-checkable="false"
    :checked-rows.sync="checkedRows"
  >
    <!-- area name  -->
    <b-table-column v-if="false" field="KioskName" :visible="true" label="">
      <template v-if="showDetailIcon"> - </template>
    </b-table-column>
    <!-- kiosk name  -->
    <b-table-column field="KioskName" :visible="true" label="Kiosk Name">
      <template v-if="showDetailIcon" v-slot="props">
        {{ props.row.KioskName }}
      </template>
    </b-table-column>
    <!-- journey  -->
    <b-table-column
      v-if="false"
      field="Journey"
      :visible="true"
      label="Journey"
    >
      <template v-slot="props">
        <span class="no-wrap">{{ props.row.Journey }}</span>
      </template>
    </b-table-column>
    <!-- android serial  -->
    <b-table-column
      field="android_serial"
      :visible="true"
      label="Android Serial"
      v-slot="props"
    >
      <span class="no-wrap">{{ props.row.android_serial }}</span>
    </b-table-column>
    <!-- lamasatech_serial  -->
    <b-table-column
      header-class="no-wrap"
      field="lamasatech_serial"
      :visible="true"
      label="LamasaTech Serial"
      v-slot="props"
    >
      <span class="no-wrap">{{ props.row.lamasatech_serial }}</span>
    </b-table-column>
    <!-- mac_address  -->
    <b-table-column
      field="mac_address"
      :visible="true"
      label="Mac Address"
      v-slot="props"
    >
      <span class="no-wrap">{{ props.row.mac_address }}</span>
    </b-table-column>
    <!-- status  -->
    <b-table-column field="status" :visible="true" label="Status" width="200">
      <template v-slot="props">
        <span v-if="!props.row.status" class="text-warning no-wrap"
          >Not Synced</span
        >
        <span
          v-if="props.row.status && props.row.status == 1"
          class="text-green no-wrap"
          >Online</span
        >
        <span
          v-if="props.row.status && props.row.status == 0"
          class="text-red no-wrap"
          >Off-line since {{ props.row.LastSync }}</span
        >
      </template>
    </b-table-column>
    <!-- Kiosk actions  -->
    <b-table-column
      field="Actions"
      :visible="true"
      label="Kiosk Settings"
      v-slot="props"
    >
      <Actions :data="props.row.Kiosk" type="kiosk" />
    </b-table-column>
  </b-table>
</template>

<script>
import Actions from "@/components/sites/Actions";
import { mapActions } from "vuex";
export default {
  name: "Kiosks",
  props: ["kiosks", "journey"],
  components: { Actions },
  data() {
    return {
      showDetailIcon: true,
      checkedRows: [],
    };
  },
  watch: {
    checkedRows(rows) {
      this.onSelectedRows(rows);
    },
  },
  computed: {
    rowsData() {
      return this.kiosks && this.kiosks.length > 0
        ? this.kiosks.map((kiosk) => {
            return {
              id: kiosk.id,
              KioskName: kiosk.name,
              android_serial: kiosk.android_serial,
              lamasatech_serial: kiosk.lamasatech_serial,
              mac_address: kiosk.mac_address,
              status: kiosk.kiosk_sync_infs.status,
              Journey: this.journey,
              Kiosk: kiosk,
              LastSync: kiosk.kiosk_sync_infs.last_sync,
            };
          })
        : [];
    },
  },
  methods: {
    ...mapActions("grid", ["onSelectedRows", "resetSelectedRows"]),
    ...mapActions("modal", ["setData"]),
  },
};
</script>