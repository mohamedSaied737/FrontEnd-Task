<template>
  <div class="grid-wrapper border p-2">
    <b-modal
      id="exportingProgress"
      hide-footer
      hide-header
      size="lg"
      :scrollable="false"
    >
      <ExportProgress />
    </b-modal>
    <div
      class="d-md-flex align-items-center justify-content-between"
      v-if="gridSettings"
    >
      <div class="settings d-flex align-items-center mt-2 mb-3">
        <i
          v-if="iconAction"
          class="visible-icon bx bx-cog toggle-right ml-2 mr-2"
          @click="iconAction"
        ></i>
        <div class="d-flex" :class="iconAction ? 'mx-2' : 'mr-2'">
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
              @click="() => (limit = record)"
            >
              {{ record }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="mx-2">
          <b-dropdown
            :disabled="getPackageType == 'Standalone' && $route.path != '/'"
            class="export-btn"
            size="sm"
            variant="outline-secondary"
            @toggle="toggleDropdown"
          >
            <template v-slot:button-content>
              Export
              <i class="mdi mdi-chevron-down dropdown-arrow"></i>
            </template>
            <!-- excel  -->
            <b-dropdown-item
              class="dropdown-text"
              v-if="hasBEexport"
              @click="serverSideExport('excel')"
            >
              Excel
            </b-dropdown-item>
            <b-dropdown-item class="dropdown-text" v-else>
              <download-excel
                :data="extractedData('excel')"
                :fields="excelColumns"
                worksheet="sheet"
                name="visipoint.xls"
                type="xls"
              >
                Excel
              </download-excel>
            </b-dropdown-item>
            <!-- csv  -->
            <b-dropdown-item
              class="dropdown-text"
              v-if="hasBEexport"
              @click="serverSideExport('csv')"
            >
              CSV
            </b-dropdown-item>
            <b-dropdown-item class="dropdown-text" v-else>
              <download-excel
                :data="extractedData('csv')"
                :fields="excelColumns"
                worksheet="sheet"
                type="csv"
                name="visipoint.csv"
              >
                CSV
              </download-excel>
            </b-dropdown-item>
            <!-- pdf  -->
            <b-dropdown-item
              v-if="checkTotalCountsForExport"
              class="dropdown-text"
              @click="serverSideExport('pdf')"
            >
              PDF
            </b-dropdown-item>
            <b-dropdown-item
              v-else
              :disabled="getPDFLoading"
              class="dropdown-text"
              @click="exportPDF"
            >
              PDF
              <b-spinner
                v-if="getPDFLoading"
                variant="secondary"
                role="status"
                size="sm"
                style="width: 15px; height: 15px"
              ></b-spinner>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div
        v-if="displayTempretureSettings"
        class="tempreture-settings my-2 d-flex align-items-center border p-1"
      >
        <label class="mb-0 mr-3 text-muted" for="radio-slots"
          >Temperature units</label
        >

        <b-form-group class="mb-0">
          <!-- <b-form-radio-group
            id="radio-slots"
            v-model="selectedTempreture"
            :options="options"
            v-on:change="changeTemperature()"
            name="radio-options-slots"
          >
          </b-form-radio-group> -->
        </b-form-group>
      </div>
    </div>
    <b-table
      :data="rows"
      :columns="columnsList"
      :striped="striped"
      :mobile-cards="mobileView"
      :checkable="hasCheckbox"
      :checked-rows.sync="checkedRows"
      :pagination-rounded="isPaginationRounded"
      :pagination-position="paginationPosition"
      :detailed="hasDetails"
      :custom-detail-row="hasCustomDetails"
      :detail-key="detailKeyId"
      :show-detail-icon="showDetailIcon"
      :sticky-header="stickyHeaders"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      :loading="loading"
      paginated
      :backend-pagination="hasBEpagination"
      :total="recordsCount"
      :per-page="limit"
      @page-change="onPageChange"
      :backend-sorting="hasBEsorting"
      :default-sort-direction="defaultSortOrder"
      :default-sort="[sortField, sortOrder]"
      @sort="onSort"
      :backend-filtering="hasBEfiltering"
      :header-checkable="hasHeaderCheckable"
      :is-row-checkable="isRowCheckable"
      :hoverable="isHoverable"
      :selectable="selectable"
      @select="isSelectable"
      :current-page.sync="page"
    >
      <template slot="empty">
        <h5 class="text-center my-2 text-muted">No matching data..</h5>
      </template>
      <slot></slot>
    </b-table>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import ExportProgress from "@/components/grid/ExportProgress";
import jsPDF from "jspdf";
import "jspdf-autotable";
import store from "@/state/store";

export default {
  name: "DataTable",
  components: { ExportProgress },
  props: [
    "iconAction",
    "rows",
    "columns",
    "xlsxName",
    "getDataAction",
    "loading",
    "hasCheckbox",
    "hasBEpagination",
    "hasBEfiltering",
    "hasBEsorting",
    "hasDetails",
    "gridSettings",
    "hasHeaderCheckable",
    "isRowCheckable",
    "detailKeyId",
    "columnsList",
    "hasCustomDetails",
    "isHoverable",
    "isSelectable",
    "selectable",
    "displayTempretureSettings",
    "hasBEexport",
    "recordsCount",
    "mobileView",
    "gridName",
    "hasDocuments",
    "vaccineColumn",
    "striped",
  ],
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_URL,
      checkedRows: [],
      isPaginationRounded: true,
      paginationPosition: "bottom",
      // detailed
      showDetailIcon: true,
      // header
      stickyHeaders: false,
      // backend
      total: 10,
      sortField: null,
      sortOrder: null,
      defaultSortOrder: "desc",
      page: 1,
      limit: 10,
      limitOptions: [5, 10, 25, 50, 100],
      // tempreture
      selectedTempreture: "c",
      options: [
        { text: "°F", value: "f" },
        { text: "°C", value: "c" },
      ],
      pdfTableHeaders: [],
    };
  },
  watch: {
    rows(rows) {
      this.changeTemperature();
      rows.map((row) => {
        const userImg = row.Image ? row.Image : "";
        row.Image && this.getBase64Image(userImg);
      });
    },
    selectedRows(value) {
      this.checkedRows = value;
    },
    checkedRows(rows) {
      this.onSelectedRows(rows);
    },
    getSelectedRows(value) {
      this.checkedRows = JSON.parse(JSON.stringify(value));
    },
    limit(pageSize) {
      this.hasBEpagination &&
        (this.onChangePageLimit(this.limit),
        this.getDataAction({
          limit: pageSize,
          page: this.getCurrentPage,
        }));
    },
    selectedTempreture(value) {
      // const {
      //   currentEntity,
      //   currentEntity: { id, company_phone },
      // } = this;
      this.onSelectedTempreture(value);
      // this.updateEntity({
      //   id,
      //   params: {
      //     entity: {
      //       company_phone,
      //       package: currentEntity.package,
      //     },
      //     entity_setting: {
      //       temperature_display_unit_for_company: value,
      //     },
      //   },
      // });
    },
    getExportURL(url) {
      return url && window.location.assign(`${this.baseURL}${url}`);
    },
    getExportProgessAppearance(value) {
      value && this.$bvModal.show("exportingProgress");
    },
  },
  computed: {
    ...mapState("grid", ["selectedRows", "getExportURL"]),
    ...mapGetters("authfack", ["currentEntity"]),
    ...mapGetters("grid", [
      "getExportURL",
      "getFilterValues",
      "getExportData",
      "getVaccinePCRColumnAppearance",
      "getPDFLoading",
      "getExportProgessAppearance",
      "getCurrentPage",
      "getPageLimit",
    ]),
    getPackageType() {
      const { currentEntity } = this;
      return currentEntity && currentEntity.package;
    },
    exportColumns() {
      return this.checkedRows.length > 0 ? this.checkedRows : this.rows;
    },
    handleVaccineDocumentColumn() {
      if (
        this.getVaccinePCRColumnAppearance &&
        this.getVaccinePCRColumnAppearance.scanDocument
      ) {
        return this.columns;
      } else {
        delete this.columns["VaccineDocument"];
      }
      return this.columns;
    },
    checkTotalCountsForExport() {
      return this.recordsCount >= process.env.VUE_APP_EXPORT_LIST_COUNT;
    },
    excelColumns() {
      return Object.fromEntries(
        Object.keys(this.columns).map((key) => [key, key])
      );
    },
  },
  methods: {
    ...mapActions("grid", [
      "onSelectedRows",
      "resetSelectedRows",
      "onSelectedTempreture",
      "exportBE",
      "exportJobBE",
      "onSetLoading",
      "resetExportProgress",
      "onPaginate",
      "onChangePageLimit",
    ]),
    ...mapActions("entity", ["updateEntity"]),
    /* Handle page-change event */
    onPageChange(page) {
      this.onPaginate(page);
      this.page = this.getCurrentPage;
      this.getDataAction &&
        this.getDataAction({
          limit: this.limit,
          page: this.getCurrentPage,
        });
    },
    /* Handle sort event */
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.getDataAction &&
        this.getDataAction({
          orderBy: { sortField: this.sortField, sortOrder: this.sortOrder },
        });
    },
    changeTemperature() {
      this.rows.length > 0 &&
        this.rows.map((row) => {
          switch (this.selectedTempreture) {
            case "f":
              if (row.unit == "c") {
                row.unit = "f";
                row.deg = row.deg * (9 / 5) + 32;
                row.Temperature = Math.round(row.deg * 10) / 10 + " °F";
              }
              break;
            case "c":
              if (row.unit == "f") {
                row.unit = "c";
                row.deg = (row.deg - 32) * (5 / 9);
                row.Temperature = Math.round(row.deg * 10) / 10 + " °C";
              }
              break;
            case "default":
              row.unit = row.defaultUnitType;
              row.deg = row.defaultDeg;
              return (row.Temperature = row.defaultDeg + row.defaultUnit);
            default:
              break;
          }
        });
    },
    extractedData(type) {
      const { gridName, getExportData, rows } = this;
      const data = gridName ? getExportData : rows;
      return data && data.length > 0
        ? data.map((row) => {
            ["data", "Data", "Compliances"].forEach((e) => delete row[e]); // reomve unexported columns
            const keys = Object.keys(row);
            const filterdRow = {};
            keys.forEach((key) => {
              if (key === "UserId") {
                key = "ID";
                return (filterdRow["ID"] = row["UserId"]);
              }
              if (key === "From") {
                key = "Date";
                return (filterdRow["Date"] = row["From"]);
              }
              if (key in this.columns) {
                return (filterdRow[key] = row[key]);
              }
            });
            return type == "pdf" ? Object.values(filterdRow) : filterdRow;
          })
        : [];
    },
    getBase64Image(imgUrl) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = imgUrl;
        // img.crossOrigin = 'Anonymous';
        img.setAttribute("crossOrigin", "*");
        img.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };
        img.onerror = function () {
          reject("The image could not be loaded.");
        };

        if (img.complete || img.complete === undefined) {
          img.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          img.src = imgUrl;
        }
      });
    },
    toDataUrl(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    },
    onSetPdfFont(length) {
      if (length >= 10) {
        return 4;
      } else if (length >= 8) {
        return 6;
      } else {
        return 8;
      }
    },
    exportPDF() {
      const doc = new jsPDF();
      this.onSetLoading({ value: true });
      const { extractedData, columns } = this;
      const headers = Object.keys(columns);
      this.pdfTableHeaders = headers;
      doc.autoTable({
        columns: this.pdfTableHeaders,
        body: extractedData("pdf"),
        styles: {
          fontSize: this.onSetPdfFont(this.pdfTableHeaders.length),
          minCellWidth: 10,
        },
        didParseCell: (data) => {
          if (
            data.column.index === 0 &&
            data.cell.section === "body" &&
            headers.includes("Image")
          ) {
            data.cell.styles.minCellHeight = 10;
            data.cell.styles.minCellWidth = 10;
            data.cell.text = "";
          }
        },
        didDrawCell: (data) => {
          if (
            data.column.index === 0 &&
            data.cell.section === "body" &&
            data.row.raw[0] != null
          ) {
            doc.addImage(
              data.row.raw[0],
              "JPEG",
              data.cell.x + 2,
              data.cell.y + 2,
              5,
              5
            );
          }
        },
      });
      doc.save("Visipoint.pdf");
      this.onSetLoading({ value: false });
    },
    // server side export for [dashboard,users,history]
    serverSideExport(type) {
      const {
        exportBE,
        exportJobBE,
        columns,
        currentEntity,
        extractedData,
        gridName,
        getFilterValues,
        sortField,
        sortOrder,
        recordsCount,
      } = this;
      if (gridName && recordsCount >= process.env.VUE_APP_EXPORT_LIST_COUNT) {
        exportJobBE({
          type: type,
          headers: columns,
          gridName,
          entity_id: currentEntity.id,
          filterBy: JSON.parse(JSON.stringify(getFilterValues)),
          orderBy: { sortField, sortOrder },
        });
      } else if (
        gridName &&
        recordsCount <= process.env.VUE_APP_EXPORT_LIST_COUNT
      ) {
        exportBE(
          gridName
            ? {
                type: type,
                headers: columns,
                gridName,
                entity_id: currentEntity.id,
                filterBy: JSON.parse(JSON.stringify(getFilterValues)),
                orderBy: { sortField, sortOrder },
              }
            : {
                type: type,
                headers: columns,
                data: extractedData("excel"),
                gridName: null,
              }
        );
      }
    },
    toggleDropdown() {
      const {
        exportBE,
        columns,
        currentEntity,
        gridName,
        getFilterValues,
        sortField,
        sortOrder,
      } = this;
      if (!this.checkTotalCountsForExport) {
        gridName &&
          exportBE({
            type: "pdf",
            headers: columns,
            gridName,
            entity_id: currentEntity.id,
            filterBy: JSON.parse(JSON.stringify(getFilterValues)),
            orderBy: { sortField, sortOrder },
          });
      }
    },
  },
  mounted() {
    const { resetSelectedRows, resetExportProgress } = this;
    let entity = store.getters["authfack/currentEntity"];
    this.selectedTempreture =
      Object.keys(entity).length > 0 &&
      entity.setting &&
      entity.setting.length > 0 &&
      entity.setting[0].pivot
        ? entity.setting[0].pivot.value
        : "c";
    resetSelectedRows();
    resetExportProgress();
    // sync current page and limit size
    this.page = this.getCurrentPage;
    this.limit = this.getPageLimit;
  },
  destroyed() {
    // reset pagination and size on leave
    this.onPaginate(1);
    this.onChangePageLimit(10);
    this.page = 1;
    this.limit = 10;
  },
};
</script>

<style lang="scss" scobed>
.export-btn {
  i {
    color: #74788d;
  }
  &:hover {
    i {
      color: #fff;
    }
  }
}
.dropdown-text {
  .dropdown-item {
    padding: 0.35rem 0 !important;
  }
  text-align: center;
}
.recods-select {
  min-height: 30px;
  .multiselect__tags {
    min-height: calc(1.1em + 0.64rem + 0.5px) !important;
    padding: 0.12rem 1.35rem !important;
    border: 1px solid #74788d !important;
  }
}
</style>
