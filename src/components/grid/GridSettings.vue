<template>
  <div
    v-if="rowsData.length > 0"
    class="d-flex align-items-center justify-content-between mb-3"
  >
    <div class="settings d-flex align-items-center">
      <i
        class="visible-icon bx bx-cog toggle-right ml-2 mr-2"
        @click="onToggleVisible"
      ></i>
      <div class="d-flex mx-2">
        <b-dropdown class="export-btn" size="sm" variant="outline-secondary">
          <template v-slot:button-content>
            Display {{ limit }}
            <i class="mdi mdi-chevron-down dropdown-arrow"></i>
          </template>
          <b-dropdown-item
            class="dropdown-text"
            v-model="limit"
            v-for="(record, i) in limitOptions"
            :key="i"
            @click="updatePageRecords(record)"
          >
            {{ record }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="mx-2" v-if="showExport">
        <b-dropdown
          :disabled="getPackageType == 'Standalone'"
          class="export-btn"
          size="sm"
          variant="outline-secondary"
        >
          <template v-slot:button-content>
            Export
            <i class="mdi mdi-chevron-down dropdown-arrow"></i>
          </template>
          <b-dropdown-item class="dropdown-text">
            <download-excel
              class="dropdown-text"
              :data="rowsData"
              :fields="columns"
              worksheet="sheet"
              name="filename.xls"
              type="xls"
            >
              Excel
            </download-excel>
          </b-dropdown-item>
          <b-dropdown-item class="dropdown-text">
            <download-excel
              :data="rowsData"
              :fields="columns"
              worksheet="sheet"
              type="csv"
              name="filename.csv"
            >
              CSV
            </download-excel>
          </b-dropdown-item>
          <b-dropdown-item class="dropdown-text" @click="exportPDF">
            PDF
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "gridSettings",
  props: [
    "rowsData",
    "onToggleVisible",
    "getExportHeaders",
    "columns",
    "showExport",
    "limit",
    "updatePageRecords"
  ],
  data() {
    return {
      limitOptions: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    ...mapGetters("authfack", ["currentEntity"]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
  },
  methods: {
    exportPDF() {
      const doc = new jsPDF();
      const headers = Object.values(this.columns);
      const body =
        this.rowsData &&
        this.rowsData.length > 0 &&
        this.rowsData.map((row) => {
          ["Compliances", "data", "Data", "Image"].forEach(
            (e) => delete row[e]
          ); // reomve unexported columns
          const keys = Object.keys(row);
          const filterdRow = {};
          keys.forEach((key) => {
            if (key in this.columns) {
              return (filterdRow[key] = row[key]);
            }
          });
          return Object.values(filterdRow);
        });
      doc.autoTable({
        columns: headers,
        body: body,
        styles: { fontSize: 8 },
      });
      doc.save("Visipoint.pdf");
    },
  },
};
</script>

<style scoped lang="scss">
.recods-select {
  min-height: 30px;
  .multiselect__tags {
    min-height: calc(1.1em + 0.64rem + 0.5px) !important;
    padding: 0.17rem 0.55rem !important;
    border: 1px solid #74788d !important;
  }
}
.dropdown-text {
  .dropdown-item {
    padding: 0.35rem 0 !important;
  }
  text-align: center;
}
</style>
