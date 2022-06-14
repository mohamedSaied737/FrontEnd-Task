<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import UserCheckinAction from "@/components/sharedCells/userAction/UserCheckinAction";
import ExportProgress from "@/components/grid/ExportProgress";
// import DataTable from "@/components/grid/DataTable";
// custom cells
// import StatusCell from "@/components/sharedCells/StatusCell";
import CompliancesCell from "@/components/dashboard/CompliancesCell";
import Compliances from "@/components/dashboard/Compliances";
import ActionCell from "@/components/dashboard/ActionCell";
import ImageCell from "@/components/sharedCells/ImageCell";
import Modal from "@/components/modal/Modal";
// import FilterInput from "@/components/sharedCells/FilterInput";
import { dashboardColumns } from "@/utils/dataSource";
import ColumnsSwitcher from "@/components/sharedCells/ColumnsSwitcher";
import { exportExel } from "@/utils/mixins/exportMixin";
import store from "@/state/store";
import VaccineDetails from "@/components/users/VaccineDetails";

import { default as Button } from "devextreme-vue/button";
import DxDropDownButton from "devextreme-vue/drop-down-button";
// import DxValidator, {
//     DxCustomRule
// } from 'devextreme-vue/validator';
import DxDataGrid, {
  DxRequiredRule,
  DxStringLengthRule,
  // DxEmailRule,
  // DxValidator,
  DxPatternRule,
  DxCustomRule,
  // DxCompareRule,
  DxColumn,
  DxLookup,
  DxFilterRow,
  DxHeaderFilter,
  // DxSearchPanel,
  DxColumnChooser,
  // DxGrouping,
  // DxGroupPanel,
  DxExport,
  DxPaging,
  DxPager,
  DxEditing,
  DxStateStoring,
  DxButton,
  // DxSelection
  DxToolbar,
  DxItem,
  DxMasterDetail,
} from "devextreme-vue/data-grid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid } from "devextreme/excel_exporter";
import CustomStore from "devextreme/data/custom_store";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
// import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
const dataGridRef = "dataGrid";
import "whatwg-fetch";
import { countryCodes } from "./codes";
import Api from "../../../services/Api";

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

export default {
  title: "Dashboard",
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
  ],
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    UserCheckinAction,
    Modal,
    ExportProgress,
    // DataTable,
    // StatusCell,
    ActionCell,
    ImageCell,
    // FilterInput,
    ColumnsSwitcher,
    // Temperature,
    Compliances,
    CompliancesCell,
    VaccineDetails,
    DxDataGrid,
    DxColumn,
    DxRequiredRule,
    DxStringLengthRule,
    // DxEmailRule,
    // DxValidator,
    DxPatternRule,
    DxCustomRule,
    // DxCompareRule,
    DxLookup,
    DxFilterRow,
    DxHeaderFilter,
    // DxSearchPanel,
    DxColumnChooser,
    // DxGrouping,
    // DxGroupPanel,
    DxExport,
    DxPaging,
    DxPager,
    DxEditing,
    DxStateStoring,
    // DxSelection,
    DxToolbar,
    DxItem,
    DxButton,
    Button,
    DxDropDownButton,
    DxMasterDetail,
  },
  data() {
    return {
      checkInStatus: "",
      checkInData: "",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      max: 255,
      open: false,
      countryCodes,
      dateRange: [
        moment
          .utc(new Date(Date.now()))
          .tz(moment.tz.guess())
          .format("YYYY-MM-DD"),
        moment
          .utc(new Date(Date.now()))
          .tz(moment.tz.guess())
          .format("YYYY-MM-DD"),
      ],
      resetPhone(rowData, value) {
        rowData.phone = "";
        this.defaultSetCellValue(rowData, value);
      },
      finalParams: {},
      title: "Dashboard",
      visitNotes: "",
      visitNotesCopy: "",
      isDisabled: false,
      pageInit: true,
      visitNotesAdded: "",
      editedUser: null,
      isEdit: false,
      isWalkinUser: false,
      isSystemUser: false,
      // hasEmail: false,
      // hasPhone: false,
      visit_id: "",
      isServerSideExport: false,
      finalFilterObject: {},
      multipleFilters: [
        {
          Date: {
            start: moment
              .utc(new Date(Date.now()))
              .tz(moment.tz.guess())
              .format("YYYY-MM-DD"),
            end: moment
              .utc(new Date(Date.now()))
              .tz(moment.tz.guess())
              .format("YYYY-MM-DD"),
          },
        },
      ],
      sortObject: {},
      totalCount: "",
      dataStore: new CustomStore({
        // key: 'id',
        key: ["visit_id", "user_id"],
        load: (loadOptions) => {
          let params = "?";
          let filterQuery = "";
          let sortObject = { sortField: null, sortOrder: "" };
          [
            "skip",
            "take",
            "requireTotalCount",
            "requireGroupCount",
            "sort",
            "filter",
            "totalSummary",
            "group",
            "groupSummary",
          ].forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
              params += `${i}=${JSON.stringify(loadOptions[i])}&`;
              if (i == "filter")
                filterQuery += `${JSON.stringify(loadOptions[i])}`;
              if (i == "sort") {
                sortObject.sortField = loadOptions[i][0].selector;
                sortObject.sortOrder = loadOptions[i][0].desc ? "desc" : "asc";
              }
            }
          });
          this.resetDashboardData();
          // params.slice(0, -1);
          params = params.slice(0, -1);
          let filters;
          let finalFilterObject = {};
          this.multipleFilters = this.dateRange[0]
            ? [
                {
                  Date: {
                    start: this.dateRange[0],
                    end: this.dateRange[1],
                  },
                },
              ]
            : [];
          if (filterQuery) filters = JSON.parse(filterQuery);
          if (filters) console.log("filters", filters);
          if (filters && typeof filters[0] === "string") {
            finalFilterObject[filters[0]] =
              filters[1] === "contains" || filters[1] === "="
                ? filters[2]
                : filters[2];

            if (this.multipleFilters.length > 0) {
              this.multipleFilters.push(finalFilterObject);
            }
          } else {
            // const isOr = filters[1] === 'or';
            // const isAnd = filters[1] === 'and';
            if (filters)
              for (const filter of filters) {
                let orExist;
                let andExist;
                if (typeof filter === "object") {
                  // console.log('obj', filter);
                  orExist = filter.find((item) => item === "or");
                  andExist = filter.find((item) => item === "and");
                  if (filter[1] == "or") {
                    // Header Filter - Gather In One Condition
                    if (
                      filter[0][1] === ">=" ||
                      filter[0][1] === "<=" ||
                      filter[0][1] === "<"
                    ) {
                      const finalFilter = {};
                      const condition = [];
                      for (const filterItem of filter) {
                        if (filterItem[2]) condition.push(filterItem[2][0]);
                      }
                      finalFilter[filter[0][0]] = {
                        start: condition[0].replace(/\//g, "-"),
                        end: condition[1].replace(/\//g, "-"),
                      };
                      this.multipleFilters.push(finalFilter);
                    } else {
                      // Gather In One Condition
                      for (const filter of filter) {
                        if (filter[1] === "contains" || filter[1] === "=") {
                          const finalFilter = {};
                          finalFilter[filter[0]] =
                            filter[1] === "contains" || filter[1] === "="
                              ? filter[2]
                              : filter[2];

                          // Header Filter - Gather In One Condition
                          const filterExist = this.multipleFilters.find(
                            (item) => item[filter[0]]
                          );
                          if (!filterExist)
                            this.multipleFilters.push(finalFilter);
                          else filterExist[filter[0]].push(filter[2][0]);
                        }
                      }
                    }
                  } // -------------- Header Filter --------------------
                  if (filter[1] == "and" && filter[0][1] == ">=") {
                    // Range Condition
                    const finalFilter = {};
                    const condition = [];
                    //"Arrival":{"start":"2022-03-10 00:00:00","end":"2022-03-12 23:59:59"}
                    for (const filterItem of filter) {
                      if (typeof filterItem === "object" && filterItem[2])
                        condition.push(filterItem[2]);
                    }
                    finalFilter[filter[0][0]] = {
                      start: condition[0].replace(/\//g, "-"),
                      end: condition[1].replace(/\//g, "-"),
                    };
                    this.multipleFilters.push(finalFilter);
                  } // -------------- Range Condition --------------------
                }
                if (
                  filter.length > 0 &&
                  filter[0] &&
                  filter[0] !== "Actions" &&
                  !orExist &&
                  !andExist
                ) {
                  if (filter[1] === "contains" || filter[1] === "=") {
                    const finalFilter = {};
                    finalFilter[filter[0]] =
                      filter[1] === "contains" || filter[1] === "="
                        ? filter[2]
                        : filter[2];

                    // Header Filter - Gather In One Condition
                    const filterExist = this.multipleFilters.find(
                      (item) => item[filter[0]]
                    );
                    if (!filterExist) this.multipleFilters.push(finalFilter);
                    else filterExist[filter[0]].push(filter[2][0]);
                  }
                  if (
                    filter[1] === ">=" ||
                    filter[1] === "<=" ||
                    filter[1] === "<"
                  ) {
                    const finalFilter = {};
                    const filter2 =
                      typeof filter[2] !== "number" && filter[2].includes("/")
                        ? filter[2].replace(/\//g, "-")
                        : filter[2];
                    finalFilter[filter[0]] = { start: "", end: "" };
                    // Range Condition
                    const filterExist = this.multipleFilters.find(
                      (item) => item[filter[0]]
                    );
                    if (!filterExist) {
                      finalFilter[filter[0]].start = filter2;
                      this.multipleFilters.push(finalFilter);
                    } else filterExist[filter[0]].end = filter2;
                  }
                } else if (andExist) {
                  for (const andFilter of filter) {
                    if (
                      andFilter.length > 0 &&
                      andFilter[0] &&
                      andFilter[0] !== "Actions"
                    ) {
                      if (andFilter[1] === "contains" || andFilter[1] === "=") {
                        const finalFilter = {};
                        finalFilter[andFilter[0]] =
                          andFilter[1] === "contains" || andFilter[1] === "="
                            ? andFilter[2]
                            : andFilter[2];
                        this.multipleFilters.push(finalFilter);
                      }
                      if (andFilter[1] === "and" && andFilter[0][1] == ">=") {
                        // range condition
                        const finalFilter = {};
                        const condition = [];
                        for (const filterItem of andFilter) {
                          const filterItem2 =
                            typeof filterItem[2] !== "number" &&
                            filterItem[2].includes("/")
                              ? filterItem[2].replace(/\//g, "-")
                              : filterItem[2];
                          if (typeof filterItem === "object" && filterItem[2])
                            condition.push(filterItem2);
                        }
                        finalFilter[andFilter[0][0]] = {
                          start: condition[0].replace(/\//g, "-"),
                          end: condition[1].replace(/\//g, "-"),
                        };
                        this.multipleFilters.push(finalFilter);
                      }
                    }
                  }
                }
              }
          }
          finalFilterObject =
            this.multipleFilters && this.multipleFilters.length > 0
              ? Object.assign({}, ...this.multipleFilters)
              : finalFilterObject;
          console.log(
            "fffff",
            finalFilterObject,
            JSON.stringify(finalFilterObject)
          );
          return Api()
            .get(
              `/visit_list/${store.getters["authfack/currentEntity"].id}${params}`,
              {
                params: {
                  filterBy: finalFilterObject,
                  orderBy: sortObject ? sortObject : { sortField: null },
                },
              }
            )
            .then((data) => {
              console.log("dashboarddata", data);
              const dd = [];
              let entity = store.getters["authfack/currentEntity"];
              data.data.data.map((scan) => {
                let userTimezone = moment.tz.guess();
                let imageScan = "";
                if (scan.scan[0])
                  scan.scan.map((item) => {
                    if (item.image_base64 && !imageScan)
                      imageScan = item.image_base64;
                  });
                // console.log("found", imageScan);
                // if (imageScan !== null) {
                // imageScan = imageScan.replace("entity_id", entity.id);
                // }
                let degre =
                  scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                    ? scan.scan[0].temperature_type == "f"
                      ? scan.scan[0].temperature * (9 / 5) + 32
                      : scan.scan[0].temperature
                    : entity && entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value == "f"
                    ? scan.scan[0].temperature * (9 / 5) + 32
                    : scan.scan[0].temperature;
                
                let scanUserTypeName =
                  scan && scan.scan && scan.scan[0] && scan.scan[0].user_type
                    ? scan.scan[0].user_type.name
                    : null;
                let userUserTypeName =
                  scan.user &&
                  scan.user.current_entity &&
                  scan.user.current_entity.user_type
                    ? scan.user.current_entity.user_type.name
                    : null;

                const scans = [];
                for (let i = 0; i < scan.scan.length; i++) {
                  const degree =
                  scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                    ? scan.scan[i].temperature_type == "f"
                      ? scan.scan[i].temperature * (9 / 5) + 32
                      : scan.scan[i].temperature
                    : entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value == "f"
                    ? scan.scan[i].temperature * (9 / 5) + 32
                    : scan.scan[i].temperature;
                  scans.push({
                    id: scan.scan[i].id,
                    failed_message: scan.scan[i].failed_message,
                    scan_data_type: scan.scan[i].scan_data_type
                      ? scan.scan[i].scan_data_type
                      : "",
                    notes: "-",
                    Image: scan.scan[i].image ? scan.scan[i].image : null,
                    FirstName: scan.user ? scan.user.first_name : "-",
                    kiosk: scan.scan[i].kiosk ? scan.scan[i].kiosk.name : "",
                    action: scan.scan[i].scan_data_type.name,
                    Area:
                      scan && scan.scan && scan.scan[i] && scan.scan[i].area
                        ? scan.scan[i].area.name
                        : "-",
                    InputType:
                      scan.scan && scan.scan[i]
                        ? scan.scan[i].input_method.name
                        : "-",
                    Temperature:
                      scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                        ? Math.round(degree * 10) / 10 +
                          (scan.scan[i].temperature_type == "f" ? " °F" : " °C")
                        : Math.round(degree * 10) / 10 +
                          (entity && entity.setting &&
                          entity.setting.length > 0 &&
                          entity.setting[0].pivot.value == "f"
                            ? " °F"
                            : " °C"),
                    hasMask:
                      scan.scan[i].has_mask == 1
                        ? "Yes"
                        : scan.scan[i].has_mask == 0
                        ? "No"
                        : "Not Applicable",
                    Compliances:
                      scan.scan && scan.scan[i]
                        ? scan.scan[i].compliances
                        : "-",
                    unit:
                      scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                        ? scan.scan[i].temperature_type
                        : entity.setting &&
                          entity.setting.length > 0 &&
                          entity.setting[0].pivot.value,
                    deg: Math.round(degre * 10) / 10,
                    defaultUnit:
                      scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                        ? scan.scan[i].temperature_type == "f"
                          ? " °F"
                          : " °C"
                        : entity.setting &&
                          entity.setting.length > 0 &&
                          entity.setting[0].pivot.value == "f"
                        ? " °F"
                        : " °C",
                    defaultDeg: Math.round(degre * 10) / 10,
                    defaultUnitType:
                      scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                        ? scan.scan[i].temperature_type
                        : entity.setting &&
                          entity.setting.length > 0 &&
                          entity.setting[0].pivot.value,
                    vaccine_document:
                      scan.scan && scan.scan[i]
                        ? scan.scan[i].user_document.length > 0 &&
                          scan.scan[i].user_document[0].pivot &&
                          scan.scan[i].user_document[0].pivot.document_status
                          ? scan.scan[i].user_document[0].pivot.document_status
                          : scan.scan[i].metadata &&
                            scan.scan[i].metadata.checks &&
                            scan.scan[i].metadata.checks.length > 0 &&
                            scan.scan[i].metadata.checks[0].type ==
                              "vaccine_document"
                          ? "Unchecked"
                          : "Not Applicable"
                        : "-",
                    LastVaccine:
                      scan.scan && scan.scan[i]
                        ? scan.scan[i].user_document[0]
                        : "-",
                    action_by: scan.scan[i].action_by
                      ? scan.scan[i].action_by
                      : "-",
                    created_at: moment
                      .utc(scan.scan[i].created_at)
                      .tz(userTimezone)
                      .format("YYYY-MM-DD hh:mm:ss"),
                    Data: scan,
                  });
                }

                dd.push({
                  scans,
                  scan_data_type: scan.scan_data_type
                    ? scan.scan_data_type
                    : "",
                  RFID: scan.user ? scan.user.rfid_number : "",
                  Email: scan.user ? scan.user.email : "",
                  Phone: scan.user ? scan.user.phone : "",
                  companyName: scan.user ? scan.user.company_name : "",
                  vehicleRegistration: scan.user
                    ? scan.user.vehicle_registration
                    : "",
                  visitNotes: scan.notes
                    ? this.trimText(scan.notes, false)
                    : "-",
                  originalVisitNotes: scan.notes ? scan.notes : "-",
                  showingFullText: false,
                  faceID: scan.user ? scan.user.faceID : "",
                  ID: scan.user ? scan.user.user_user_id : "",
                  visit_id: scan.id,
                  user_id: scan.user_id,
                  user_type_id: scan.user_type_id,
                  user: scan.user,
                  // Picture: imageScan ? scan.scan[0].image_base64 : null, // base64Img
                  Image: imageScan ? imageScan : null, // base64Img
                  // 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png'
                  Status: scan.scan_data_type ? scan.scan_data_type.name : "-",
                  FirstName: scan.user ? scan.user.first_name : "-",
                  LastName: scan.user ? scan.user.last_name : "-",
                  entity_id: scan.entity_id,
                  UserType: scanUserTypeName
                    ? scanUserTypeName
                    : userUserTypeName,
                  Area:
                    scan && scan.scan && scan.scan[0] && scan.scan[0].area
                      ? scan.scan[0].area.name
                      : "-",
                  InputType:
                    scan.scan && scan.scan[0]
                      ? scan.scan[0].input_method.name
                      : "-",
                  Temperature:
                    scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                      ? Math.round(degre * 10) / 10 +
                        (scan.scan[0].temperature_type == "f" ? " °F" : " °C")
                      : Math.round(degre * 10) / 10 +
                        (entity.setting &&
                        entity.setting.length > 0 &&
                        entity.setting[0].pivot.value == "f"
                          ? " °F"
                          : " °C"),
                  hasMask:
                    scan.scan[0].has_mask == 1
                      ? "Yes"
                      : scan.scan[0].has_mask == 0
                      ? "No"
                      : "Not Applicable",
                  Arrival: scan.signed_in
                    ? moment
                        .utc(scan.signed_in)
                        .tz(userTimezone)
                        .format("YYYY-MM-DD hh:mm:ss")
                    : scan.signed_in,
                  Compliances:
                    scan.scan && scan.scan[0] ? scan.scan[0].compliances : "-",
                  unit:
                    scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                      ? scan.scan[0].temperature_type
                      : entity.setting &&
                        entity.setting.length > 0 &&
                        entity.setting[0].pivot.value,
                  deg: Math.round(degre * 10) / 10,
                  defaultUnit:
                    scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                      ? scan.scan[0].temperature_type == "f"
                        ? " °F"
                        : " °C"
                      : entity.setting &&
                        entity.setting.length > 0 &&
                        entity.setting[0].pivot.value == "f"
                      ? " °F"
                      : " °C",
                  defaultDeg: Math.round(degre * 10) / 10,
                  defaultUnitType:
                    scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                      ? scan.scan[0].temperature_type
                      : entity.setting &&
                        entity.setting.length > 0 &&
                        entity.setting[0].pivot.value,
                  Date: moment
                    .utc(scan.date)
                    .tz(userTimezone)
                    .format("YYYY-MM-DD"),
                  Departure: scan.signed_out
                    ? moment
                        .utc(scan.signed_out)
                        .tz(userTimezone)
                        .format("YYYY-MM-DD hh:mm:ss")
                    : scan.signed_out,
                  Data: scan,
                  vaccine_document:
                    scan.scan && scan.scan[0]
                      ? scan.scan[0].user_document.length > 0 &&
                        scan.scan[0].user_document[0].pivot &&
                        scan.scan[0].user_document[0].pivot.document_status
                        ? scan.scan[0].user_document[0].pivot.document_status
                        : scan.scan[0].metadata &&
                          scan.scan[0].metadata.checks &&
                          scan.scan[0].metadata.checks.length > 0 &&
                          scan.scan[0].metadata.checks[0].type ==
                            "vaccine_document"
                        ? "Unchecked"
                        : "Not Applicable"
                      : "-",
                  FullName: scan.user ? scan.user.fullName : "-",
                  LastVaccine:
                    scan.scan && scan.scan[0]
                      ? scan.scan[0].user_document[0]
                      : "-",
                  site: scan.scan[0].area
                    ? scan.scan[0].area.site.name +
                      " > " +
                      scan.scan[0].area.name
                    : "",
                  area: scan.scan[0].area,
                });
                switch (this.selectedTempreture) {
                  case "f":
                    if (dd[dd.length - 1].unit == "c") {
                      dd[dd.length - 1].unit = "f";
                      dd[dd.length - 1].deg =
                        dd[dd.length - 1].deg * (9 / 5) + 32;
                      dd[dd.length - 1].Temperature =
                        Math.round(dd[dd.length - 1].deg * 10) / 10 + " °F";
                    }
                    break;
                  case "c":
                    if (dd[dd.length - 1].unit == "f") {
                      dd[dd.length - 1].unit = "c";
                      dd[dd.length - 1].deg =
                        (dd[dd.length - 1].deg - 32) * (5 / 9);
                      dd[dd.length - 1].Temperature =
                        Math.round(dd[dd.length - 1].deg * 10) / 10 + " °C";
                    }
                    break;
                  case "default":
                    dd[dd.length - 1].unit = "c";
                    dd[dd.length - 1].deg =
                      (dd[dd.length - 1].deg - 32) * (5 / 9);
                    return (dd[dd.length - 1].Temperature =
                      Math.round(dd[dd.length - 1].deg * 10) / 10 + " °C");
                  default:
                    break;
                }
                // scans
                dd[dd.length - 1].scans.map((scan) => {
                  switch (this.selectedTempreture) {
                    case "f":
                      if (scan.unit == "c") {
                        scan.unit = "f";
                        scan.deg = scan.deg * (9 / 5) + 32;
                        scan.Temperature =
                          Math.round(scan.deg * 10) / 10 + " °F";
                      }
                      break;
                    case "c":
                      if (scan.unit == "f") {
                        scan.unit = "c";
                        scan.deg = (scan.deg - 32) * (5 / 9);
                        scan.Temperature =
                          Math.round(scan.deg * 10) / 10 + " °C";
                      }
                      break;
                    case "default":
                      scan.unit = scan.defaultUnitType;
                      scan.deg = scan.defaultDeg;
                      return (scan.Temperature =
                        scan.defaultDeg + scan.defaultUnit);
                    default:
                      break;
                  }
                });
              });

              this.isServerSideExport =
                data.data.totalCount >= process.env.VUE_APP_EXPORT_LIST_COUNT;
              this.finalFilterObject = finalFilterObject;
              this.sortObject = sortObject ? sortObject : { sortField: null };
              this.totalCount = data.data.totalCount;
              // this.resetDashboardData();

              return {
                data: dd,
                totalCount: data.data.totalCount,
                summary: data.data.summary,
                groupCount: data.data.groupCount,
              };
            })
            .catch((err) => {
              throw new Error(err);
            });
        },
        // eslint-disable-next-line no-unused-vars
        update: (key, values) => {
          // eslint-disable-next-line no-unused-vars
          const { updateUserAction } = this;
          const entity_id = store.getters["authfack/currentEntity"].id;
          const { FirstName, LastName } = values;

          // eslint-disable-next-line no-unused-vars
          const data = {
            entity_id,
            // user_user_id,
            first_name: FirstName,
            last_name: LastName,
            // email,
            // phone,
            // image,
            // rfid_number,
            // user_type_id,
            // system_user,
            // password,
          };
        },
      }),
      buttonData: ["Excel", "CSV", "PDF"],
      hasMaskHeaderFilter: [
        {
          text: "Yes",
          value: ["hasMask", "contains", "Yes"],
        },
        {
          text: "No",
          value: ["hasMask", "contains", "No"],
        },
      ],
      tempHeaderFilter: [
        {
          name: "<= 30",
          id: [0, 30],
        },
        {
          name: "30 - 34",
          id: [30, 34],
        },
        {
          name: "34 - 40",
          id: [34, 40],
        },
        {
          name: ">= 40",
          id: [40, 50],
        },
      ],
      vaccineHeaderFilter: [
        {
          name: "Vaccinated",
          id: "Vaccinated",
        },
        {
          name: "Not Applicable",
          id: "Not Applicable",
        },
        {
          name: "Negative PCR",
          id: "Negative PCR",
        },
        {
          name: "Positive PCR",
          id: "Positive PCR",
        },
        {
          name: "Unchecked",
          id: "Unchecked",
        },
        {
          name: "Expired",
          id: "Expired",
        },
        {
          name: "Not Supported",
          id: "Not Supported",
        },
      ],
      userTypeHeaderFilter: [],
      statusHeaderFilter: [],
      inputTypeHeaderFilter: [],
      areaHeaderFilter: [],
      allowedOperations: ["contains"],
      selectedOperation: "contains", // default icon
      filterBy: {},
      orderBy: {},
      filterChanged: 0,
      items: [
        {
          text: "Dashboards",
          href: "/",
        },
        {
          text: "Default",
          active: true,
        },
      ],
      dashboardColumns: dashboardColumns,
      hasMaskOptions: ["Yes", "No", "Not Applicable"],
      updatedInputTypes: [],
      vaccineOptions: [
        "Vaccinated",
        "Not Applicable",
        "Negative PCR",
        "Positive PCR",
        "Unchecked",
        "Expired",
        "Not Supported",
      ],
      vaccineDocument: false,
      selectedTempreture: "c",
      options: [
        { text: "°F", value: "f" },
        { text: "°C", value: "c" },
      ],
      dataGridRef,
      pdfTableHeaders: [],
    };
  },
  watch: {
    getDocuments(Documents) {
      this.vaccineDocument = Documents.length > 0;
    },

    getTableHeaders(value) {
      console.log("watch", value);
    },

    getExportProgessAppearance(value) {
      value && this.$bvModal.show("exportingProgress");
    },

    getInputTypes(getInputTypes) {
      this.updatedInputTypes = JSON.parse(JSON.stringify(getInputTypes));
      const objIndex = this.updatedInputTypes.findIndex(
        (obj) => obj.name == "face recognition"
      );
      this.updatedInputTypes[objIndex].name = "Facial Recognition";
      console.log("updatedInputTypes", this.updatedInputTypes);
    },
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "dashboardCounts",
      "getDashboardData",
      "getScanDataTypes",
      "getLoadingStatus",
      "getAreas",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("grid", [
      "getSelectedRows",
      "getTableHeaders",
      "getTableFilters",
      "getLoading",
      "getRecordsCount",
      "getVaccinePCRColumnAppearance",
      "getExportURL",
      "getFilterValues",
      "getExportData",
      "getPDFLoading",
      "getExportProgessAppearance",
    ]),
    ...mapGetters("modal", ["getModalData"]),
    ...mapGetters("sites", ["getCompliances"]),
    ...mapGetters("compliance", ["getComplianceList"]),
    ...mapGetters("users", ["getDocuments"]),
    ...mapGetters("authfack", ["currentEntity", "userDetails"]),
    userEmail() {
      return this.userDetails && this.userDetails.email;
    },
    dashboardData() {
      let entity = store.getters["authfack/currentEntity"];
      console.log("getDashboardData", this.getDashboardData);
      return this.getDashboardData && this.getDashboardData.length > 0
        ? this.getDashboardData.map((scan) => {
            let userTimezone = moment.tz.guess();
            let imageScan = "";
            if (scan.scan[0])
              scan.scan.map((item) => {
                if (item.image_base64 && !imageScan)
                  imageScan = item.image_base64;
              });
            // if (imageScan !== null) {
            // imageScan = imageScan.replace("entity_id", entity.id);
            // console.log('imageScan', imageScan);
            // }

            let degre =
              scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                ? scan.scan[0].temperature_type == "f"
                  ? scan.scan[0].temperature * (9 / 5) + 32
                  : scan.scan[0].temperature
                : entity.setting &&
                  entity.setting.length > 0 &&
                  entity.setting[0].pivot.value == "f"
                ? scan.scan[0].temperature * (9 / 5) + 32
                : scan.scan[0].temperature;

            let scanUserTypeName =
              scan && scan.scan && scan.scan[0] && scan.scan[0].user_type
                ? scan.scan[0].user_type.name
                : null;
            let userUserTypeName =
              scan.user &&
              scan.user.current_entity &&
              scan.user.current_entity.user_type
                ? scan.user.current_entity.user_type.name
                : null;

            const scans = [];
            for (let i = 0; i < scan.scan.length; i++) {
              scans.push({
                Area:
                  scan && scan.scan && scan.scan[i] && scan.scan[i].area
                    ? scan.scan[i].area.name
                    : "-",
                InputType:
                  scan.scan && scan.scan[i]
                    ? scan.scan[i].input_method.name
                    : "-",
                Temperature:
                  scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                    ? Math.round(degre * 10) / 10 +
                      (scan.scan[i].temperature_type == "f" ? " °F" : " °C")
                    : Math.round(degre * 10) / 10 +
                      (entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value == "f"
                        ? " °F"
                        : " °C"),
                hasMask:
                  scan.scan[i].has_mask == 1
                    ? "Yes"
                    : scan.scan[i].has_mask == 0
                    ? "No"
                    : "Not Applicable",
                Compliances:
                  scan.scan && scan.scan[i] ? scan.scan[i].compliances : "-",
                unit:
                  scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                    ? scan.scan[i].temperature_type
                    : entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value,
                deg: Math.round(degre * 10) / 10,
                defaultUnit:
                  scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                    ? scan.scan[i].temperature_type == "f"
                      ? " °F"
                      : " °C"
                    : entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value == "f"
                    ? " °F"
                    : " °C",
                defaultDeg: Math.round(degre * 10) / 10,
                defaultUnitType:
                  scan.scan && scan.scan[i] && scan.scan[i].temperature_type
                    ? scan.scan[i].temperature_type
                    : entity.setting &&
                      entity.setting.length > 0 &&
                      entity.setting[0].pivot.value,
                vaccine_document:
                  scan.scan && scan.scan[i]
                    ? scan.scan[i].user_document.length > 0 &&
                      scan.scan[i].user_document[0].pivot &&
                      scan.scan[i].user_document[0].pivot.document_status
                      ? scan.scan[i].user_document[0].pivot.document_status
                      : scan.scan[i].metadata &&
                        scan.scan[i].metadata.checks &&
                        scan.scan[i].metadata.checks.length > 0 &&
                        scan.scan[i].metadata.checks[0].type ==
                          "vaccine_document"
                      ? "Unchecked"
                      : "Not Applicable"
                    : "-",
                LastVaccine:
                  scan.scan && scan.scan[i]
                    ? scan.scan[i].user_document[0]
                    : "-",
              });
            }

            return {
              scans,
              scan_data_type: scan.scan_data_type ? scan.scan_data_type : "",
              RFID: scan.user ? scan.user.rfid_number : "",
              Email: scan.user ? scan.user.email : "",
              Phone: scan.user ? scan.user.phone : "",
              companyName: scan.user ? scan.user.company_name : "",
              vehicleRegistration: scan.user
                ? scan.user.vehicle_registration
                : "",
              visitNotes: scan.notes ? this.trimText(scan.notes, false) : "-",
              originalVisitNotes: scan.notes ? scan.notes : "-",
              showingFullText: false,
              faceID: scan.user ? scan.user.faceID : "",
              ID: scan.user ? scan.user.user_user_id : "",
              visit_id: scan.id,
              user_id: scan.user_id,
              user_type_id: scan.user_type_id,
              user: scan.user,
              // Picture: imageScan ? scan.scan[0].image_base64 : null, // base64Img
              Image: imageScan ? imageScan : null, // base64Img
              // 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png'
              Status: scan.scan_data_type ? scan.scan_data_type.name : "-",
              FirstName: scan.user ? scan.user.first_name : "-",
              LastName: scan.user ? scan.user.last_name : "-",
              entity_id: scan.entity_id,
              UserType: scanUserTypeName ? scanUserTypeName : userUserTypeName,
              Area:
                scan && scan.scan && scan.scan[0] && scan.scan[0].area
                  ? scan.scan[0].area.name
                  : "-",
              InputType:
                scan.scan && scan.scan[0]
                  ? scan.scan[0].input_method.name
                  : "-",
              Temperature:
                scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                  ? Math.round(degre * 10) / 10 +
                    (scan.scan[0].temperature_type == "f" ? " °F" : " °C")
                  : Math.round(degre * 10) / 10 +
                    (entity.setting &&
                    entity.setting.length > 0 &&
                    entity.setting[0].pivot.value == "f"
                      ? " °F"
                      : " °C"),
              hasMask:
                scan.scan[0].has_mask == 1
                  ? "Yes"
                  : scan.scan[0].has_mask == 0
                  ? "No"
                  : "Not Applicable",
              Arrival: scan.signed_in
                ? moment
                    .utc(scan.signed_in)
                    .tz(userTimezone)
                    .format("YYYY-MM-DD hh:mm:ss")
                : scan.signed_in,
              Compliances:
                scan.scan && scan.scan[0] ? scan.scan[0].compliances : "-",
              unit:
                scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                  ? scan.scan[0].temperature_type
                  : entity.setting &&
                    entity.setting.length > 0 &&
                    entity.setting[0].pivot.value,
              deg: Math.round(degre * 10) / 10,
              defaultUnit:
                scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                  ? scan.scan[0].temperature_type == "f"
                    ? " °F"
                    : " °C"
                  : entity.setting &&
                    entity.setting.length > 0 &&
                    entity.setting[0].pivot.value == "f"
                  ? " °F"
                  : " °C",
              defaultDeg: Math.round(degre * 10) / 10,
              defaultUnitType:
                scan.scan && scan.scan[0] && scan.scan[0].temperature_type
                  ? scan.scan[0].temperature_type
                  : entity.setting &&
                    entity.setting.length > 0 &&
                    entity.setting[0].pivot.value,
              Date: moment.utc(scan.date).tz(userTimezone).format("YYYY-MM-DD"),
              Departure: scan.signed_out
                ? moment
                    .utc(scan.signed_out)
                    .tz(userTimezone)
                    .format("YYYY-MM-DD hh:mm:ss")
                : scan.signed_out,
              Data: scan,
              vaccine_document:
                scan.scan && scan.scan[0]
                  ? scan.scan[0].user_document.length > 0 &&
                    scan.scan[0].user_document[0].pivot &&
                    scan.scan[0].user_document[0].pivot.document_status
                    ? scan.scan[0].user_document[0].pivot.document_status
                    : scan.scan[0].metadata &&
                      scan.scan[0].metadata.checks &&
                      scan.scan[0].metadata.checks.length > 0 &&
                      scan.scan[0].metadata.checks[0].type == "vaccine_document"
                    ? "Unchecked"
                    : "Not Applicable"
                  : "-",
              FullName: scan.user ? scan.user.fullName : "-",
              LastVaccine:
                scan.scan && scan.scan[0] ? scan.scan[0].user_document[0] : "-",
              site: scan.scan[0].area
                ? scan.scan[0].area.site.name + " > " + scan.scan[0].area.name
                : "",
              area: scan.scan[0].area,
            };
          })
        : [];
    },
    getCurrentDate() {
      return [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")];
    },
    dataGrid() {
      return this.$refs[this.dataGridRef].instance;
    },
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      // this.isConnected = true;
      console.log("server connected");
    },

    disconnect() {
      // this.isConnected = false;
      console.log("server disconnected");
    },

    welcome(data) {
      console.log("welcome", data);
    },
    update(data) {
      console.log("update row", data);
      // this.getAll();
      this.dataGrid.refresh().then(function () {
        console.log("refreshed");
      });
    },
    joined(data) {
      console.log("joined", data);
    },
  },
  created() {
    document.addEventListener("mousedown", (e) => {
      // console.log('mousedown');
      if (e.path) {
        // console.log("path", e.path);
        let isColumnChooser = false;
        for (let i = 0; i < e.path.length; i++) {
          if (typeof e.path[i].matches == "function") {
            if (e.path[i].matches(".dx-overlay-content")) {
              isColumnChooser = true;
            }
          }
        }
        if (!isColumnChooser) this.dataGrid.hideColumnChooser();
      }
    });
    // console.log(
    //   "date",
    //   moment
    //     .utc(new Date(Date.now()))
    //     .tz(moment.tz.guess())
    //     .format("YYYY-MM-DD")
    // );
    // const editor = document.getElementById('gridContainer');
    // var self = this;
    //     setTimeout(() => {
    //       console.log('storeee',this.dataGrid.getDataSource());
    // }, 5000);
    // setTimeout(() => {
    // document.addEventListener("paste", (event) => {
    //   console.log("weee", event, event.clipboardData.getData("text/plain"));
    //   var clipboardData, pastedData;

    //   // event.stopPropagation();
    //   // event.preventDefault();

    //   clipboardData = event.clipboardData || window.clipboardData;
    //   pastedData = clipboardData.getData("Text");

    //   var data = pastedData;

    //   var rows = data.split("\n");
    //   console.log("rows :" + rows);
    //   for (var y in rows) {
    //     var cells = rows[y].split("\t");
    //     if (cells !== "" || cells !== null) {
    //       console.log(
    //         "cells: " + cells,
    //         cells[0],
    //         cells[1],
    //         this.dataGrid.getDataSource()
    //       );
    //       // console.log("customers :" + customers);
    //       // customers.push({"FirstName":cells[0],"LastName":cells[1],"Age":cells[2],"Email":cells[3]});
    //       this.dataGrid
    //         .getDataSource()
    //         .store()
    //         .push([
    //           {
    //             type: "insert",
    //             data: { FirstName: cells[0], LastName: cells[1] },
    //           },
    //         ]);
    //       // setTimeout(() => {
    //       // console.log('selectedTemperature', this.selectedTempreture, this.dataGrid.getDataSource()._items[0].FirstName);
    //       this.dataGrid.getDataSource()._items[0].FirstName = "edittttttttt";
    //       this.dataGrid
    //         .getDataSource()
    //         .store()
    //         .push([
    //           {
    //             type: "update",
    //             key: {
    //               id: "f13ef38f-9fde-4bd7-b57d-65cd34843ce6",
    //               user_id: "069571b3-1f3b-4019-812a-ae423d2a00f6",
    //             },
    //             data: { FirstName: cells[0], LastName: cells[1] },
    //           },
    //           // { type: "remove", key: "Apples" }
    //         ]);
    //       // }, 5000);
    //     }
    //   }
    //   // bindGrid();
    // });
    //  }, 5000);

    // editor.onpaste = this.logPaste();
    let entity = store.getters["authfack/currentEntity"];

    this.getUserTypes.map((userType) => {
      this.userTypeHeaderFilter.push({
        text: userType.name,
        value: ["UserType", "contains", [userType.id]],
      });
    });

    //  default walkin user => data.user_id == data.current_entity.entity_id

    // this.orderDateHeaderFilter = [
    //   {
    //     text: "site 1",
    //     value: ["UserType", "contains", ["userType.id"]],
    //     items: [
    //       {
    //         text: "area 1",
    //         value: ["UserType", "contains", ["area.id"]],
    //       },
    //       {
    //         text: "area2",
    //         value: ["UserType", "contains", ["area2.id"]],
    //       },
    //     ],
    //   },
    //   {
    //     text: "site2",
    //     value: ["UserType", "contains", ["userType.id"]],
    //     items: [
    //       {
    //         text: "area1",
    //         value: ["UserType", "contains", ["userType.id"]],
    //       },
    //       {
    //         text: "area2",
    //         value: ["UserType", "contains", ["userType.id"]],
    //       },
    //     ],
    //   },
    // ];

    this.getScanDataTypes.map((status) => {
      this.statusHeaderFilter.push({
        text: status.name,
        value: ["Status", "contains", [status.id]],
      });
    });

    // this.statusHeaderFilter = {
    //   store: {
    //     type: "array",
    //     data: this.getScanDataTypes,
    //     key: "id",
    //   },
    // };
    //         setTimeout(() => {
    //       console.log('selectedTemperature', this.selectedTempreture, this.dataGrid.getDataSource()._items[0].FirstName);
    //       this.dataGrid.getDataSource()._items[0].FirstName = 'edittttttttt';
    //       this.dataGrid.getDataSource().store().push([
    //     { type: "update", key:{id: "f13ef38f-9fde-4bd7-b57d-65cd34843ce6"}, data: { FirstName: 'hjjhjhhjhjhj' } },
    //     // { type: "remove", key: "Apples" }
    // ]);
    //     }, 5000);

    this.getInputTypes.map((inputType) => {
      this.inputTypeHeaderFilter.push({
        text: inputType.name,
        value: ["InputType", "contains", [inputType.id]],
      });
    });

    console.log("getareas", this.getAreas);
    // this.areaHeaderFilter = this.getAreas;
    this.getAreas.map((site) => {
      // console.log('site', site);
      const areas = [];
      if (site.items)
        for (let i = 0; i < site.items.length; i++) {
          areas.push(site.items[i].value);
          if (site.items[i].items)
            for (let ii = 0; ii < site.items[i].items.length; ii++) {
              areas.push(site.items[i].items[ii].value);
              if (site.items[i].items[ii].items)
                for (
                  let iii = 0;
                  iii < site.items[i].items[ii].items.length;
                  iii++
                ) {
                  areas.push(site.items[i].items[ii].items[iii].value);
                  if (site.items[i].items[ii].items[iii].items)
                    for (
                      let iiii = 0;
                      iiii < site.items[i].items[ii].items[iii].items.length;
                      iiii++
                    ) {
                      areas.push(
                        site.items[i].items[ii].items[iii].items[iiii].value
                      );
                    }
                }
            }
        }
      // console.log('arr', areas);
      this.areaHeaderFilter.push({
        text: site.text,
        value: ["Area", "contains", areas],
        items: site.items
          ? site.items.map((item) => {
              return {
                text: item.text,
                value: ["Area", "contains", [item.value]],
                items: item.items
                  ? item.items.map((item2) => {
                      return {
                        text: item2.text,
                        value: ["Area", "contains", [item2.value]],
                        items: item2.items
                          ? item2.items.map((item3) => {
                              return {
                                text: item3.text,
                                value: ["Area", "contains", [item3.value]],
                                items: item3.items
                                  ? item3.items.map((item4) => {
                                      return {
                                        text: item4.text,
                                        value: [
                                          "Area",
                                          "contains",
                                          [item4.value],
                                        ],
                                        items: item4.items
                                          ? item4.items.map((item5) => {
                                              return {
                                                text: item5.text,
                                                value: [
                                                  "Area",
                                                  "contains",
                                                  [item5.value],
                                                ],
                                                items: item5.items,
                                              };
                                            })
                                          : [],
                                      };
                                    })
                                  : [],
                              };
                            })
                          : [],
                      };
                    })
                  : [],
              };
            })
          : [],
      });
    });
    // this.areaHeaderFilter.map((area) => {
    //   area.value = ["Site", "contains", [area.text]];
    //   area.items.map((item) => {
    //     item.value = ["Site", "contains", [item.text]];
    //     item.items.map((item2) => {
    //       item2.value = ["Site", "contains", [item2.text]];
    //       item2.items.map((item3) => {
    //         item3.value = ["Site", "contains", [item3.text]];
    //         item3.items.map((item4) => {
    //         item4.value = ["Site", "contains", [item4.text]];
    //       });
    //       });
    //     });
    //   });
    // });

    console.log("this.areaHeaderFilter", this.areaHeaderFilter);

    console.log("socket connected: ", this.$socket.connected);
    this.$socket.emit("message", "Socket Works From VUE!!!");
    this.$socket.emit("join", { entity: entity.id });

    // this.dashboardData.map(item => {
    //   // 'http://placekitten.com/g/200/300'
    //   if (item.Image) {
    //     getBase64Image('http://placekitten.com/g/200/300').then(base64Image => {
    //       // console.log('base64Image', base64Image);
    //       item.Picture = base64Image;
    //     });
    //   }
    // });
    // console.log('dashboard data created', this.dashboardData);
  },
  methods: {
    ...mapActions("dailyLogbook", [
      "getCounts",
      "getAll",
      "fetchScanDatatypes",
      "fetchUserTypes",
      "fetchAreas",
      "fetchInputTypes",
      "resetDashboardData",
    ]),
    ...mapActions("grid", [
      "onTableHeader",
      "updateTableHeaders",
      "createTableHeaders",
      "resetTableHeaders",
      "resetFilterValues",
      "checkVaccinePCRColumnAppearance",
      "resetSelectedRows",
      "onSelectedRows",
      "onSelectedTempreture",
      "exportBE",
      "exportJobBE",
      "onSetLoading",
    ]),
    ...mapActions("modal", ["onResetModal", "setData"]),
    ...mapActions("compliance", ["fetchComplianceList"]),
    ...mapActions("users", [
      "fetchDocuments",
      "updateUserAction",
      "addUserWalkin",
    ]),
    async customLoad() {
      if (this.userEmail !== "lt_techteam@visipoint.com") {
        await this.onTableHeader({
          url: "/",
          // headers: reportHistoryColumns,
        });
        let value = this.getTableHeaders;
        // console.log("customLoad", value, this.getTableFilters);
        // if (this.getTableFilters) {
        //   this.dateRange = JSON.parse(this.getTableFilters);
        //   this.dateChanged();
        // }
        // localStorage.getItem("dashboardGrid");

        // if (value) {
        // value = JSON.parse(value);
        // value.searchText = '';
        // value.pageIndex = 0;
        // value.pageSize = 10;
        // for (let i = 0; i < value.columns.length; i++) {
        //   value.columns[i].filterValue = null;
        //   value.columns[i].filterValues = null;
        //   value.columns[i].sortOrder = null;
        // }
        // }
        return value;
      }
    },

    customSave(gridState) {
      if (this.userEmail !== "lt_techteam@visipoint.com") {
        let value = JSON.stringify(gridState);
        value = value.replace(',"selectedRowKeys":[]', "");

        if (!this.getTableHeaders) {
          this.createTableHeaders({
            url: "/",
            headers: value,
            filters: "[]",
          });
        } else if (value != JSON.stringify(this.getTableHeaders)) {
          this.updateTableHeaders({
            url: "/",
            headers: value,
            filters: "[]",
            // this.getTableFilters
            //   ? this.getTableFilters
            //   : JSON.stringify(this.dateRange),
          });
        }
        console.log(
          "customSave vslue",
          // this.getTableFilters,
          // JSON.stringify(this.dateRange),
          value == JSON.stringify(this.getTableHeaders)
        );
        // console.log("customsave headers", JSON.stringify(this.getTableHeaders));
      }
    },

    handlePropertyChange() {},
    // keyPressed(e) {
    //   console.log(e, this.visitNotes.length);
    //   if (this.visitNotes.length > 255) {
    //     e.preventDefault();
    //   }
    // },
    // calculateFilter(value, operation, target) {
    //   console.log("calc", value, operation, target);
    //   if (target === "headerFilter") {
    //     if (value) {
    //       return [
    //         ["CustomerStoreCity", "=", value],
    //         "or",
    //         ["CustomerStoreState", "=", value],
    //       ];
    //     }
    //   }
    //   return this.defaultCalculateFilterExpression.apply(this, arguments);
    // },
    openCheckInModal(data) {
      this.checkInStatus = data.Status;
      this.checkInData = data.Data;
      console.log("kkk", this.checkInData);
      setTimeout(() => {
        this.$refs.checkInUser.$el.click();
      }, 400);
    },
    calculateActionBy(rowData) {
      let actionBy = rowData.action_by;
      try {
        const type = actionBy.type;
        if (type == "Admin" || type == "admin")
          return type + " - " + actionBy.fullName;
        else return type;
      } catch (e) {
        return "";
      }
    },
    changeFullText(data) {
      console.log(data);
      // data.showingFullText = !data.showingFullText;
      // this.dataGrid
      //   .getDataSource()
      //   ._items.map((item) => item.showingFullText = true);
      const newNotes = this.trimText(
        data.originalVisitNotes,
        !data.showingFullText
      );
      // console.log("newNotes", newNotes);
      this.dataGrid
        .getDataSource()
        .store()
        .push([
          {
            type: "update",
            key: { visit_id: data.visit_id, user_id: data.user_id },
            data: {
              showingFullText: !data.showingFullText,
              visitNotes: newNotes,
            },
          },
        ]);
      // console.log(data);
    },
    trimText(data, showingFullText) {
      if (showingFullText) {
        return data;
      }
      return data && data !== "-" && data.length > 37
        ? `${data.slice(0, 37).trim()}...`
        : data;
    },
    getStatusData(rowData) {
      // console.log('rowdata', rowData);
      return {
        scans: rowData.scans,
        scan_data_type: rowData.scan_data_type,
      };
    },
    validateUser(e) {
      console.log("this.isWalkinUser", this.isWalkinUser, e);
      if (!this.isWalkinUser && this.isSystemUser && !e.value) return false;
      return true;
    },
    validatePhone(e) {
      console.log("validatePhone", this.isWalkinUser, this.isSystemUser, e);
      // var key = e.validator.option("validationGroup").key;
      // var rowIndex = this.dataGrid.getRowIndexByKey(key);
      // this.dataGrid.getDataSource()._items[rowIndex].Phone = e.value;
      // console.log("rowIndex", this.dataGrid.getDataSource()._items[rowIndex]);
      if (
        !this.isWalkinUser &&
        this.isSystemUser &&
        !e.value &&
        !e.data.Email
      ) {
        // console.log('failed');
        return false;
      }
      return true;
      // console.log(this.dataGrid.option("formData").Phone);
    },
    validateEmail(e) {
      // console.log("validateEmail", this.isWalkinUser, this.isSystemUser, e);
      if (
        !this.isWalkinUser &&
        this.isSystemUser &&
        !e.value &&
        !e.data.Phone
      ) {
        // console.log('failed');
        return false;
      }
      return true;
      // console.log(this.dataGrid.option("formData").Phone);
    },
    validateLastName(e) {
      if (this.isWalkinUser) return true;
      else if (!e.value) return false;
      return true;
    },
    dateChanged() {
      console.log(
        "datechanged",
        this.dateRange,
        JSON.stringify(this.dateRange)
        // JSON.stringify(this.dateRange) != this.getTableFilters
      );
      // let finalFilterObject;
      // if (JSON.stringify(this.dateRange) != this.getTableFilters)
      //   this.updateTableHeaders({
      //     url: "/",
      //     headers: JSON.stringify(this.getTableHeaders),
      //     filters: JSON.stringify(this.dateRange),
      //   });
      if (!this.dateRange[0]) {
        const i = this.multipleFilters.findIndex((item) => item["Date"]);
        // console.log("index", i);
        this.multipleFilters.splice(i, 1);
        console.log(this.multipleFilters);
      } else {
        this.finalFilterObject["Date"] = {
          start: this.dateRange[0].replace(/\//g, "-"),
          end: this.dateRange[1].replace(/\//g, "-"),
        };
        // const filter = this.multipleFilters.find(item => item['Date']);
        // if (filter) {
        const i = this.multipleFilters.findIndex((item) => item["Date"]);
        this.multipleFilters.splice(i, 1);
        // console.log("finl", this.multipleFilters);
        // }
        this.multipleFilters.push(this.finalFilterObject);
        // console.log(this.finalFilterObject);
      }
      this.dataGrid.refresh().then(function () {
        console.log("refreshed");
      });
    },
    serverSideExport(e) {
      // if (e.itemData == "Excel")
      console.log(e);
      const columnNames = this.dataGrid.getVisibleColumns();
      const columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i].allowExporting)
          columns.push(columnNames[i].dataField);
      }
      this.exportJobBE({
        type: e.itemData,
        headers: columns,
        gridName: "Dashboard",
        entity_id: this.currentEntity.id,
        filterBy: this.finalFilterObject,
        orderBy: this.sortObject,
      });
    },
    checkInClick(e) {
      console.log("e", e);
      e.event.preventDefault();
      this.$bvModal.show("dashboardAction");
      this.setData(e.row.data.Data);
      this.dataGrid.refresh().then(function () {
        console.log("refreshed");
      });
    },
    openVisitNotes(visit_id, visitNotes) {
      this.visitNotes = this.visitNotesCopy = visitNotes !== "-" ? visitNotes : "";
      this.visit_id = visit_id;
      this.$bvModal.show("visitNotes");
    },
    addVisitNotes() {
      console.log("hii", this.visit_id, this.visitNotes, this.visitNotesCopy);
      if (!this.visitNotes) return;
      this.$store.dispatch("dailyLogbook/addVisitNotes", {
        visit_id: this.visit_id,
        notes: this.visitNotes,
      });
      this.dataGrid.refresh().then(function () {
        console.log("refreshed");
      });
      this.$bvModal.hide("visitNotes");
    },
    logPaste(event) {
      console.log("paste", event);
      // var clipboardData, pastedData;

      //   event.stopPropagation();
      //   event.preventDefault();

      //   clipboardData = event.clipboardData || window.clipboardData;
      //   pastedData = clipboardData.getData('Text');

      // var data = pastedData;

      // var rows = data.split("\n");
      // console.log("rows :" + rows);
      // for(var y in rows) {
      //   var cells = rows[y].split("\t");
      //   if(cells !== "" || cells !== null){
      //     console.log("cells :" + cells);
      //     console.log("customers :" + customers);
      //     customers.push({"FirstName":cells[0],"LastName":cells[1],"Age":cells[2],"Email":cells[3]});
      //   }
      // }
      // bindGrid();
    },
    setUserData(data) {
      this.setData({
        type: "report_document",
        data,
      });
    },
    getStatusvaccine(metdata) {
      let text = "Not Applicable";
      let status = false;
      metdata.map((data) => {
        if (data.type == "vaccine_document") {
          status = true;
        }
      });
      text = status ? "Unchecked" : "Not Applicable";
      return text;
    },
    setResetModal() {
      this.$store.dispatch("modal/setData", null);
      this.$bvModal.hide("add-edit-user");
    },
    onToggleVisible() {
      this.$bvModal.show("dashboardColumns");
    },
    onRowClicked() {
      return "";
    },
    vaccineDocumentText(docment) {
      let vaccine = null;
      if (docment.type == "covid_pcr") {
        vaccine = "Negative PCR";
      }
      if (docment.type == "covid_vaccine") {
        if (docment.scan_is_expiry) {
          vaccine = "Expired";
        } else {
          vaccine = "Vaccinated";
        }
      }
      return vaccine;
    },
    renderVaccineDocumentColor(type) {
      switch (type) {
        case "Vaccinated":
          return "text-primary font-weight-bold";
        case "Not Applicable":
          return "text-secondary";
        case "Expired":
          return "text-warning font-weight-bold";
        case "Negative PCR":
          return "text-success font-weight-bold";
        default:
          return "text-danger font-weight-bold";
      }
    },
    fetchTableHeaders() {
      this.onTableHeader({
        url: "/",
        headers: dashboardColumns,
      });
    },
    getScanTime(createdAt) {
      let userTimezone = moment.tz.guess();
      if (createdAt)
        return moment.utc(createdAt).tz(userTimezone).format("hh:mm");
      return "";
    },
    async exportPDF() {
      // console.log("dx", this.dataGrid.getVisibleColumns());
      await this.getAll({
        sortObject: this.sortObject,
        finalFilterObject: this.finalFilterObject,
        limit: this.totalCount,
      });
      console.log("exportpdf");
      const columnNames = this.dataGrid.getVisibleColumns();
      const columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i].allowExporting)
          columns.push(columnNames[i].dataField);
      }
      // console.log("ff", columns);
      const doc = new jsPDF('landscape');
      // this.onSetLoading({ value: true });
      const { extractedData } = this;
      const headers = columns;
      this.pdfTableHeaders = headers;
      doc.autoTable({
        columns: this.pdfTableHeaders,
        body: extractedData("pdf"),
        styles: {
          fontSize: this.onSetPdfFont(this.pdfTableHeaders.length),
          cellWidth: "wrap",
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
          // console.log('coor', data.cell.x, data.cell.y);
          // console.log('dataaa', data);
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
      doc.save("Dashboard.pdf");
      // this.onSetLoading({ value: false });

      // const doc = new jsPDF();
      // exportDataGridToPdf({
      //   jsPDFDocument: doc,
      //   component: this.dataGrid,
      // }).then(() => {
      //   doc.save("Dashboard.pdf");
      // });
    },
    exportXLSX() {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Main sheet");

      exportDataGrid({
        component: this.dataGrid,
        worksheet,
        autoFilterEnabled: true,
        // topLeftCell: { row: 2, column: 2 },
        customizeCell: ({ gridCell, excelCell }) => {
          if (gridCell.rowType === "data") {
            if (gridCell.column.dataField === "Image" && gridCell.value) {
              excelCell.value = undefined;

              const image = workbook.addImage({
                base64: gridCell.value,
                extension: "png",
              });

              worksheet.getRow(excelCell.row).height = 90;
              worksheet.addImage(image, {
                tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
                br: { col: excelCell.col, row: excelCell.row },
              });
            }
          }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "Dashboard.xlsx"
          );
        });
      });
    
    },
    exportCSV() {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Main sheet");

      exportDataGrid({
        component: this.dataGrid,
        worksheet: worksheet,
        customizeCell: function (options) {
          const excelCell = options;
          excelCell.font = { name: "Arial", size: 12 };
          excelCell.alignment = { horizontal: "left" };
        },
      }).then(function () {
        workbook.csv.writeBuffer().then(function (buffer) {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "Dashboard.csv"
          );
        });
      });
      // e.cancel = true;
    },
    onItemClick(e) {
      if (e.itemData == "Excel") this.exportXLSX();
      else if (e.itemData == "CSV") this.exportCSV();
      else if (e.itemData == "PDF") this.exportPDF();
    },
    // editStart(e) {
    //   console.log("edit start", e);
    //   this.isEdit = true;
    // },
    // onCellPrepared(e) {
    // console.log("prepared", e);
    // console.log(
    //   this.dataGrid
    // );
    // if (this.isEdit && e.rowType === "data") {
    //   e.cellElement.style.backgroundColor = "rgba(98, 215, 172, 0.13)";
    // }
    // },
    start(e) {
      console.log("e", e);
      // this.hasEmail = !!e.data.Email;
      // this.hasPhone = !!e.data.Phone;
      this.visit_id = e.key.visit_id;
      this.email = e.data.Email;
      this.isWalkinUser =
        e.data.user_id == e.data.entity_id + "-" + e.data.user_type_id;
      console.log("isWalkinUser", this.isWalkinUser);
      this.isSystemUser = e.data.user.system_user;
      console.log("isSystemUser", this.isSystemUser);
      this.isEdit = true;
      this.editedUser = e.data;
    },
    updateRow(event) {
      this.isEdit = false;
      console.log("event", event, this.editedUser);
      const row = this.dataGrid
        .getDataSource()
        ._items.find((item) => item.visit_id == event.key.visit_id);
      console.log("row", row);
      const { updateUserAction, addUserWalkin } = this;
      const entity_id = store.getters["authfack/currentEntity"].id;
      // console.log(' entity_id',  entity_id)
      // const update = true;
      const { user_user_id, user_type_id, system_user, password } = row.user;
      const FirstName = event.data.FirstName
        ? event.data.FirstName
        : row.FirstName;
      const LastName = event.data.LastName ? event.data.LastName : row.LastName;
      const RFID = event.data.RFID || event.data.RFID == "" ? event.data.RFID : row.RFID;
      const companyName = event.data.companyName || event.data.companyName == ""
        ? event.data.companyName
        : row.companyName;
      const vehicleRegistration = event.data.vehicleRegistration || event.data.vehicleRegistration == ""
        ? event.data.vehicleRegistration
        : row.vehicleRegistration;
      const phone =
        event.data.countryCode ||
        event.data.Phone == "" ||
        (event.data.Phone && event.data.Phone.length > 0)
          ? event.data.countryCode
            ? event.data.countryCode + "" + event.data.Phone
            : event.data.Phone
          : row.Phone
          ? row.Phone
          : null;
      const email =
        event.data.Email == "" ||
        (event.data.Email && event.data.Email.length > 0)
          ? event.data.Email
          : row.Email;
      let data;
      if (this.isWalkinUser) {
        let length = 8,
          charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          retVal = "";
        let i = 0,
          n = charset.length;
        for (; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        data = {
          entity_id,
          user_user_id: "VP-" + retVal,
          first_name: FirstName,
          last_name: LastName,
          user_type_id,
          system_user: 0,
          password,
          company_name: companyName,
          vehicle_registration: vehicleRegistration,
          visit_id: this.editedUser.visit_id,
        };
      } else {
        data = {
          entity_id,
          user_user_id,
          first_name: FirstName,
          last_name: LastName,
          email,
          user_type_id,
          system_user,
          password,
          company_name: companyName,
          rfid_number: RFID,
          phone,
          vehicle_registration: vehicleRegistration,
          // visit_id: this.editedUser.visit_id,
        };
        // if (RFID) data.rfid_number = RFID;
        // if (phone) data.phone = phone;
      }
      console.log("data", data);
      this.isWalkinUser
        ? addUserWalkin({ user: data })
        : updateUserAction({ id: event.key.user_id, user: data });
      setTimeout(() => {
        this.dataGrid.refresh().then(function () {
          console.log("refreshed");
        });
      }, 3000);
    },
    reset() {
      this.dataGrid.clearFilter("row");
      this.dataGrid.clearFilter("header");
      // this.dateRange = [];
      // this.dateChanged();
    },
    contentReady() {
      // console.log("ready", e);
      if (this.pageInit) this.setColumnChooserPosition();
    },
    visitNotesChanged(e) {
      // console.log('visitNotesChanged', e.target.value);
      this.visitNotes = e.target.value;
      if (!e.target.value) this.isDisabled = true;
      else this.isDisabled = false;
    },
    onEditorPreparing(e) {
      if (e.parentType == "filterRow") {
        e.editorOptions.placeholder = "Search";
      }
    },
    setColumnChooserPosition() {
      // this.dataGrid.showColumnChooser();
      this.pageInit = false;
      console.log("columnChooserView");

      var columnChooserView = this.dataGrid.getView("columnChooserView");

      if (!columnChooserView._popupContainer) {
        columnChooserView._initializePopupContainer();
        columnChooserView.render();
      }

      columnChooserView._popupContainer.option("position", {
        of: this.dataGrid.element(),
        my: "left top",
        at: "left top",
        offset: "0 50",
      });
    },
    changeTemperature() {
      console.log("change", this.selectedTempreture);
      // this.dashboardData.length > 0
      //   this.dashboardData.map((row) => {
      //     switch (this.selectedTempreture) {
      //       case "f":
      //         if (row.unit == "c") {
      //           row.unit = "f";
      //           row.deg = row.deg * (9 / 5) + 32;
      //           row.Temperature = Math.round(row.deg * 10) / 10 + " °F";
      //         }
      //         break;
      //       case "c":
      //         if (row.unit == "f") {
      //           row.unit = "c";
      //           row.deg = (row.deg - 32) * (5 / 9);
      //           row.Temperature = Math.round(row.deg * 10) / 10 + " °C";
      //         }
      //         break;
      //       case "default":
      //         row.unit = row.defaultUnitType;
      //         row.deg = row.defaultDeg;
      //         return (row.Temperature = row.defaultDeg + row.defaultUnit);
      //       default:
      //         break;
      //     }

      //     // scans
      //     row.scans.map(scan => {
      //       switch (this.selectedTempreture) {
      //         case "f":
      //           if (scan.unit == "c") {
      //             scan.unit = "f";
      //             scan.deg = scan.deg * (9 / 5) + 32;
      //             scan.Temperature = Math.round(scan.deg * 10) / 10 + " °F";
      //           }
      //           break;
      //         case "c":
      //           if (scan.unit == "f") {
      //             scan.unit = "c";
      //             scan.deg = (scan.deg - 32) * (5 / 9);
      //             scan.Temperature = Math.round(scan.deg * 10) / 10 + " °C";
      //           }
      //           break;
      //         case "default":
      //           scan.unit = scan.defaultUnitType;
      //           scan.deg = scan.defaultDeg;
      //           return (scan.Temperature = scan.defaultDeg + scan.defaultUnit);
      //         default:
      //         break;
      //     }
      //     });
      //   });
      //   this.dataGrid.refresh().then(function() {
      //     console.log('refreshed temps');
      //   });

      this.dataGrid.getDataSource()._items.map((row) => {
        switch (this.selectedTempreture) {
          case "f":
            if (row.unit == "c") {
              this.dataGrid
                .getDataSource()
                .store()
                .push([
                  {
                    type: "update",
                    key: { visit_id: row.visit_id, user_id: row.user_id },
                    data: { unit: "f", deg: row.deg * (9 / 5) + 32 },
                  },
                ]);
              row.unit = "f";
              row.deg = row.deg * (9 / 5) + 32;
              row.Temperature = Math.round(row.deg * 10) / 10 + " °F";
              this.dataGrid
                .getDataSource()
                .store()
                .push([
                  {
                    type: "update",
                    key: { visit_id: row.visit_id, user_id: row.user_id },
                    data: {
                      Temperature: Math.round(row.deg * 10) / 10 + " °F",
                    },
                  },
                ]);

              this.tempHeaderFilter = [
                {
                  name: "<= 90",
                  id: [0, 90],
                },
                {
                  name: "90 - 94",
                  id: [90, 94],
                },
                {
                  name: "94 - 100",
                  id: [94, 100],
                },
                {
                  name: ">= 100",
                  id: [100, 150],
                },
              ];
            }
            break;
          case "c":
            if (row.unit == "f") {
              this.dataGrid
                .getDataSource()
                .store()
                .push([
                  {
                    type: "update",
                    key: { visit_id: row.visit_id, user_id: row.user_id },
                    data: { unit: "c", deg: (row.deg - 32) * (5 / 9) },
                  },
                ]);
              row.unit = "c";
              row.deg = (row.deg - 32) * (5 / 9);
              row.Temperature = Math.round(row.deg * 10) / 10 + " °C";
              this.dataGrid
                .getDataSource()
                .store()
                .push([
                  {
                    type: "update",
                    key: { visit_id: row.visit_id, user_id: row.user_id },
                    data: {
                      Temperature: Math.round(row.deg * 10) / 10 + " °C",
                    },
                  },
                ]);
              this.tempHeaderFilter = [
                {
                  name: "<= 30",
                  id: [0, 30],
                },
                {
                  name: "30 - 34",
                  id: [30, 34],
                },
                {
                  name: "34 - 40",
                  id: [34, 40],
                },
                {
                  name: ">= 40",
                  id: [40, 50],
                },
              ];
            }
            break;
          case "default":
            this.dataGrid
              .getDataSource()
              .store()
              .push([
                {
                  type: "update",
                  key: { visit_id: row.visit_id, user_id: row.user_id },
                  data: { unit: "c", deg: (row.deg - 32) * (5 / 9) },
                },
              ]);
            row.unit = "c";
            row.deg = (row.deg - 32) * (5 / 9);
            row.Temperature = Math.round(row.deg * 10) / 10 + " °C";
            this.dataGrid
              .getDataSource()
              .store()
              .push([
                {
                  type: "update",
                  key: { visit_id: row.visit_id, user_id: row.user_id },
                  data: { Temperature: Math.round(row.deg * 10) / 10 + " °C" },
                },
              ]);
            return (this.tempHeaderFilter = [
              {
                name: "<= 30",
                id: [0, 30],
              },
              {
                name: "30 - 34",
                id: [30, 34],
              },
              {
                name: "34 - 40",
                id: [34, 40],
              },
              {
                name: ">= 40",
                id: [40, 50],
              },
            ]);
          default:
            break;
        }

        // scans
        row.scans.map((scan) => {
          switch (this.selectedTempreture) {
            case "f":
              if (scan.unit == "c") {
                scan.unit = "f";
                scan.deg = scan.deg * (9 / 5) + 32;
                scan.Temperature = Math.round(scan.deg * 10) / 10 + " °F";
              }
              break;
            case "c":
              if (scan.unit == "f") {
                scan.unit = "c";
                scan.deg = (scan.deg - 32) * (5 / 9);
                scan.Temperature = Math.round(scan.deg * 10) / 10 + " °C";
              }
              break;
            case "default":
              scan.unit = scan.defaultUnitType;
              scan.deg = scan.defaultDeg;
              return (scan.Temperature = scan.defaultDeg + scan.defaultUnit);
            default:
              break;
          }
        });
      });
      this.dataGrid.refresh("changesOnly");
    },
    extractedData(type) {
      const { dashboardData } = this;
      const columnNames = this.dataGrid.getVisibleColumns();
      const columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i].allowExporting)
          columns.push(columnNames[i].dataField);
      }
      const columnsObject = columns.reduce((a, v) => ({ ...a, [v]: v }), {});
      console.log("columnsObject", columnsObject);
      const data = dashboardData;
      console.log("extracteddata", dashboardData);
      return data && data.length > 0
        ? data.map((row) => {
            ["data", "Data", "Compliances"].forEach((e) => delete row[e]); // reomve unexported columns
            // const keys = Object.keys(row);
            const filterdRow = {};
            columns.forEach((key) => {
              if (key in columnsObject) {
                return (filterdRow[key] = row[key]);
              }
            });

            return type == "pdf" ? Object.values(filterdRow) : filterdRow;
          })
        : [];
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
  },
  mounted() {
    window.addEventListener("unload", this.resetFilterValues());
    // this.fetchTableHeaders();
    // console.log("getTableHeaders", this.getTableHeaders);
    console.log("multipleFilters", this.multipleFilters);
    this.getCounts();
    this.fetchComplianceList();
    this.fetchDocuments();
    const { resetSelectedRows } = this;
    let entity = store.getters["authfack/currentEntity"];
    console.log("mounted dashbb", entity.setting);
    this.selectedTempreture =
      Object.keys(entity).length > 0 &&
      entity.setting &&
      entity.setting.length > 0 &&
      entity.setting[0].pivot
        ? entity.setting[0].pivot.value
        : "c";
    resetSelectedRows();
  },
  destroyed() {
    // this.resetTableHeaders();
    this.resetFilterValues();
    this.onResetModal();
  },
  beforeMount() {
    this.checkVaccinePCRColumnAppearance();
  },
};
</script>

<template>
  <Layout>
    <!-- exporting -->
    <b-modal
      id="exportingProgress"
      hide-footer
      hide-header
      size="lg"
      :scrollable="false"
    >
      <ExportProgress />
    </b-modal>

    <!-- dashboard compliances  -->
    <b-modal
      id="dashboardCompliances"
      hide-footer
      hide-header
      size="lg"
      scrollable
    >
      <Compliances />
    </b-modal>
    <!-- action modal -->
    <b-modal id="dashboardAction" scrollable hide-footer hide-header size="lg">
      <UserCheckinAction />
    </b-modal>
    <!-- list view modal  -->
    <Modal :title="'View List Settings'" modalID="dashboardColumns">
      <template>
        <ColumnsSwitcher
          :vaccineColumn="getVaccinePCRColumnAppearance"
          grid="dashboard"
          :tableHeaders="getTableHeaders"
          url="/"
          modalID="dashboardColumns"
          :fetchTableHeaders="fetchTableHeaders"
        />
      </template>
    </Modal>
    <!-- scan modal -->
    <Modal title="Scan Data Types" modalID="scanDataTypes" :scrollable="true">
      <div>
        <div
          class="p-2 border mb-2"
          v-for="(scan, index) in getModalData"
          :key="scan ? scan.id : index"
        >
          <div v-if="scan && scan.scan_data_type">
            <div class="d-flex align-items-center">
              <h5
                class="mb-0"
                :class="
                  scan.scan_data_type.name == `Checked in`
                    ? 'in-color'
                    : 'out-color '
                "
              >
                {{ scan.scan_data_type.name }}
              </h5>
              <i
                class="mdi mdi-account-arrow-left status-icon mx-2"
                :class="
                  scan.scan_data_type.name == `Checked in`
                    ? `in-color`
                    : `out-color `
                "
              ></i>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <p class="mb-0 text-secondary">
                {{ scan.input_method.name }}
              </p>
              <p class="mb-0 text-secondary w-25 no-wrap">
                {{ scan.user_type ? scan.user_type.name : "-" }}
              </p>
              <p class="mb-0 text-secondary time">
                {{ getScanTime(scan.created_at) }}
              </p>
              <p class="mb-0 text-secondary area" v-if="scan && scan.kiosk">
                {{ scan.kiosk.name }}
              </p>
              <p class="mb-0 text-secondary area">
                {{ scan.failed_message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- vaccine details  -->
    <b-modal
      id="vaccineDetails"
      :scrollable="getCompliances.length > 0 ? true : false"
      hide-footer
      hide-header
      size="lg"
    >
      <VaccineDetails />
    </b-modal>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-4"></div>
    </div>
    <!-- Counts -->
    <div class="users-scan-wrapper mb-3" v-if="dashboardCounts">
      <div class="d-flex gap">
        <div class="total-scan scan-box">
          <div class="scan-info m-auto">
            <h5 class="scan-item no-wrap">Checked in Now</h5>
            <p class="mb-0 scan-item-two text-center">
              {{ dashboardCounts.signedInNow }}
            </p>
            <h5 class="scan-item-user m-auto no-wrap">Users</h5>
          </div>
        </div>
        <div class="today-scan scan-box">
          <div class="scan-info m-auto">
            <h5 class="scan-item no-wrap">Checked in Today</h5>
            <p class="mb-0 scan-item-two text-center">
              {{ dashboardCounts.signedInToday }}
            </p>
            <h5 class="scan-item-user m-auto no-wrap">Users</h5>
          </div>
        </div>
        <div
          class="staff-scan scan-box"
          v-for="(userType, propertyName, i) in dashboardCounts.userType"
          :key="i"
        >
          <div class="scan-info m-auto">
            <h5 class="scan-item">{{ propertyName }}</h5>
            <p class="mb-0 scan-item-two text-center">{{ userType }}</p>
            <h5 class="scan-item-user m-auto no-wrap">Users</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- grid -->
    <section class="white-bg-sec dashboard-grid">
      <DxDataGrid
        id="gridContainer"
        :ref="dataGridRef"
        :data-source="dataStore"
        :remote-operations="true"
        :showBorders="false"
        :columnAutoWidth="true"
        :allowColumnReordering="true"
        :allowColumnResizing="true"
        :rowAlternationEnabled="true"
        :showColumnLines="true"
        :showRowLines="true"
        :repaint-changes-only="true"
        :two-way-binding-enabled="true"
        :no-data-text="''"
        @editing-start="start($event)"
        @edit-canceling="isEdit = false"
        @edit-canceled="isEdit = false"
        @saved="isEdit = false"
        @row-updated="updateRow($event)"
        @content-ready="contentReady($event)"
        @editor-preparing="onEditorPreparing($event)"
        @option-changed="handlePropertyChange"
      >
        <DxEditing
          :use-icons="false"
          :allow-updating="true"
          :allow-adding="false"
          :allow-deleting="false"
          mode="row"
        />

        <DxStateStoring
          :enabled="true"
          type="custom"
          :customLoad="customLoad"
          :customSave="customSave"
          storage-key="dashboardGrid"
        />

        <DxPaging :page-size="10" />
        <DxPager
          :visible="true"
          :allowed-page-sizes="[5, 10, 25, 50, 100, 'all']"
          :display-mode="'full'"
          :show-page-size-selector="true"
          :show-info="true"
          :show-navigation-buttons="true"
        />

        <!-- <DxSelection mode="multiple"/> -->

        <DxFilterRow :visible="true" />
        <!-- <DxFilterRow :visible="true" :apply-filter="currentFilter"/> -->

        <DxHeaderFilter :visible="true" />

        <!-- <DxSearchPanel :visible="true" placeholder="Search..."/> -->

        <DxColumnChooser :enabled="true" mode="select" />

        <!-- <DxGrouping :context-menu-enabled="true"/>
      <DxGroupPanel :visible="true"/> -->

        <DxExport :enabled="true" :allow-export-selected-data="false" />

        <DxToolbar>
          <!-- <DxItem name="groupPanel"/> -->
          <DxItem location="before" template="columnButtonTemplate" />
          <DxItem template="exportButtonTemplate" location="before" />
          <DxItem template="dateFilterTemplate" location="before" />
          <DxItem template="clearAllTemplate" location="before" />
          <DxItem template="tempUnitsTemplate" location="after" />
          <!-- <DxItem template="exportCSVTemplate"/>
        <DxItem template="exportExcelTemplate"/>
        <DxItem template="exportPDFTemplate"/> -->
          <!-- <DxItem name="searchPanel"/> -->
        </DxToolbar>

        <DxColumn
          data-field="Image"
          caption=""
          cell-template="image-cell"
          :allow-filtering="false"
          :allow-editing="false"
          :show-in-column-chooser="false"
          :visible="true"
          alignment="center"
        >
          <DxHeaderFilter :allow-search="false" />
        </DxColumn>

        <DxColumn
          data-field="FirstName"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
          :width="200"
        >
          <DxRequiredRule />
          <DxStringLengthRule
            :max="15"
            message="The maximum length is 15 characters."
          />
        </DxColumn>

        <DxColumn
          data-field="LastName"
          :visible="true"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :width="200"
        >
          <DxCustomRule
            :validation-callback="validateLastName"
            message="Last Name is required"
          />
          <DxStringLengthRule
            :max="15"
            message="The maximum length is 15 characters."
          />
        </DxColumn>

        <DxColumn
          data-field="Status"
          caption="Status"
          cell-template="status-cell"
          :allow-editing="false"
          :visible="true"
          :allow-filtering="false"
          :allow-header-filtering="true"
        >
          <DxHeaderFilter :data-source="statusHeaderFilter" />
          <!-- <DxLookup
            :data-source="statusHeaderFilter"
            value-expr="id"
            display-expr="name"
          /> -->
        </DxColumn>

        <DxColumn
          data-field="site"
          :allow-filtering="false"
          :allow-header-filtering="true"
          :allow-editing="false"
          :visible="true"
          cell-template="site-cell"
        >
          <DxHeaderFilter
            :group-interval="[['site'], ['area']]"
            :data-source="areaHeaderFilter"
          />
        </DxColumn>

        <DxColumn
          data-field="UserType"
          :allow-editing="false"
          :visible="true"
          :allow-filtering="false"
          :allow-header-filtering="true"
        >
          <DxHeaderFilter :data-source="userTypeHeaderFilter" />
        </DxColumn>

        <DxColumn
          data-field="Arrival"
          caption="Arrival Time"
          :allow-editing="false"
          data-type="datetime"
          format="yyyy-MM-dd, HH:mm:ss"
          selected-filter-operation="between"
          :visible="true"
          :allow-header-filtering="false"
          :allow-filtering="true"
          :filter-operations="['between']"
        />

        <DxColumn
          data-field="Departure"
          caption="Departure Time"
          :allow-editing="false"
          data-type="datetime"
          format="yyyy-MM-dd, HH:mm:ss"
          selected-filter-operation="between"
          :allow-header-filtering="false"
          :allow-filtering="true"
          :filter-operations="['between']"
          :visible="true"
        />

        <DxColumn
          data-field="companyName"
          caption="Company"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
        />

        <DxColumn
          data-field="visitNotes"
          :allow-editing="false"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :width="250"
          :visible="true"
          cell-template="visit-notes-cell"
        />

        <DxColumn
          data-field="Email"
          caption="Email Address"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
          :width="200"
        >
          <DxPatternRule :pattern="pattern" message="Email is invalid" />
          <DxCustomRule
            :validation-callback="validateEmail"
            :reevaluate="true"
            message="Email or Phone is required"
          />
          <!-- <DxCompareRule
            :comparison-target="compareEmail"
            message="Phone or Email is required"
          /> -->
        </DxColumn>

        <DxColumn
          data-field="countryCode"
          caption="Country Code"
          :allow-header-filtering="false"
          :allow-filtering="false"
          :visible="isEdit"
          :show-in-column-chooser="false"
          :set-cell-value="resetPhone"
        >
          <DxLookup
            :data-source="countryCodes"
            value-expr="dial_code"
            display-expr="finalCode"
          />
        </DxColumn>

        <DxColumn
          data-field="Phone"
          caption="Phone Number"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
        >
          <DxCustomRule
            :validation-callback="validatePhone"
            :reevaluate="true"
            message="Phone or Email is required"
          />
          <!-- <DxCompareRule
            :comparison-target="comparePhone"
            message="Phone or Email is required"
          /> -->
        </DxColumn>

        <DxColumn
          data-field="vehicleRegistration"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
        />

        <DxColumn
          data-field="RFID"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :visible="true"
        />

        <DxColumn
          data-field="ID"
          caption="ID"
          :allow-header-filtering="false"
          :filter-operations="allowedOperations"
          :allow-editing="false"
          :width="200"
          :visible="false"
        />

        <DxColumn
          data-field="UserData"
          caption="User Data"
          type="buttons"
          :allow-filtering="false"
          :allow-exporting="false"
          :allow-editing="false"
          :visible="true"
          :width="164"
        >
          
          <DxButton class="edit-user" name="edit" text="Edit User" />
        </DxColumn>

        <DxColumn
          data-field="Actions"
          caption="Actions"
          :width="349"
          :allow-filtering="false"
          :allow-exporting="false"
          :allow-editing="false"
          :visible="true"
          css-class="select-actions select-actionsDAsh"
          cell-template="action-cell"
        />

        <DxMasterDetail :enabled="true" template="master-detail" />
        <template #master-detail="{ data }">
          <div>
            <h5 class="master-detail-caption text-dark">Visit History</h5>
            <DxDataGrid
              :data-source="data.data.scans"
              :showBorders="false"
              :columnAutoWidth="true"
              :allowColumnReordering="true"
              :allowColumnResizing="true"
              :rowAlternationEnabled="false"
              :showColumnLines="true"
              :showRowLines="true"
            >
              <DxPaging :page-size="1000" />

              <DxColumn
                data-field="action"
                cell-template="status-cell"
                :calculate-cell-value="getStatusData"
              />

              <DxColumn
                data-field="action_by"
                caption="By"
                :calculate-cell-value="calculateActionBy"
              />

              <DxColumn data-field="created_at" caption="At" />

              <DxColumn
                data-field="Image"
                caption="Scan Image"
                
                id="ScanImage"
                cell-template="image-cell"
                :allow-filtering="false"
                :allow-editing="false"
                :allow-sorting="false"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.Image
                    : true
                "
                
              >
                <DxHeaderFilter :allow-search="false" />
              </DxColumn>

              <DxColumn
                data-field="Area"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.Area
                    : true
                "
              />

              <DxColumn data-field="kiosk" />

              <DxColumn
                data-field="InputType"
                caption="Input"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.InputType
                    : true
                "
              />

              <DxColumn data-field="Temperature" cell-template="temp-cell" />

              <DxColumn
                data-field="hasMask"
                caption="Has a Mask?"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.hasMask
                    : true
                "
              />

              <DxColumn
                data-field="Compliances"
                caption="Compliance"
                cell-template="compliance-cell"
                :allow-filtering="false"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.Compliances
                    : true
                "
              >
                <DxHeaderFilter :allow-search="false" />
              </DxColumn>

              <DxColumn
                data-field="VaccineDocument"
                caption="Document - Vaccine/PCR"
                cell-template="document-cell"
                :visible="
                  Object.keys(getTableHeaders).length > 0
                    ? getTableHeaders.VaccineDocument &&
                      getVaccinePCRColumnAppearance &&
                      getVaccinePCRColumnAppearance.scanDocument
                    : true
                "
              />

              <DxColumn data-field="notes" />

              <template #status-cell="{ data }">
                <div>
                  <!-- DENIED & AUTO SIGNED OUT STATUS -->
                  <div
                    v-if="
                      data.data.scan_data_type.id == 5 ||
                      data.data.scan_data_type.id == 8
                    "
                  >
                    <span class="text-red font-weight-bold">{{
                      data.data.scan_data_type.name
                    }}</span>

                    <svg
                      tabindex="0"
                      v-b-tooltip
                      :id="data.data.id"
                      style="margin-left: 10px; outline: none"
                      width="17.73"
                      height="17.73"
                      viewBox="0 0 17.73 17.73"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.86201 5.64211e-08C7.10912 0.000197833 5.39565 0.520172 3.93827 1.49417C2.48089 2.46817 1.34505 3.85245 0.674388 5.47197C0.00372177 7.09149 -0.171673 8.87351 0.170421 10.5927C0.512514 12.3119 1.35671 13.891 2.59626 15.1304C3.83582 16.3698 5.41506 17.2139 7.13429 17.5558C8.85351 17.8977 10.6355 17.7221 12.255 17.0512C13.8744 16.3804 15.2586 15.2444 16.2324 13.7869C17.2062 12.3294 17.726 10.6159 17.726 8.86299C17.726 7.699 17.4967 6.54641 17.0513 5.47104C16.6058 4.39567 15.9529 3.41857 15.1297 2.59555C14.3066 1.77253 13.3295 1.11971 12.254 0.674362C11.1786 0.229014 10.026 -0.000131275 8.86201 5.64211e-08ZM10.021 13.5C10.021 13.8074 9.89891 14.1022 9.68156 14.3195C9.4642 14.5369 9.1694 14.659 8.86201 14.659C8.55462 14.659 8.25982 14.5369 8.04246 14.3195C7.82511 14.1022 7.70301 13.8074 7.70301 13.5V8C7.70301 7.69261 7.82511 7.39781 8.04246 7.18045C8.25982 6.9631 8.55462 6.84099 8.86201 6.84099C9.1694 6.84099 9.4642 6.9631 9.68156 7.18045C9.89891 7.39781 10.021 7.69261 10.021 8V13.5ZM8.86201 5.388C8.63336 5.3874 8.41001 5.31913 8.2201 5.19179C8.0302 5.06445 7.88223 4.88374 7.79487 4.67244C7.70751 4.46114 7.68466 4.22871 7.7292 4.00444C7.77373 3.78017 7.88368 3.57412 8.04515 3.41223C8.20661 3.25035 8.41239 3.13987 8.63655 3.09476C8.8607 3.04964 9.09317 3.07191 9.3047 3.15872C9.51622 3.24554 9.69732 3.39302 9.82514 3.5826C9.95297 3.77217 10.0218 3.99536 10.023 4.224C10.0237 4.37674 9.9941 4.5281 9.93602 4.66937C9.87793 4.81064 9.79246 4.93902 9.68455 5.04712C9.57664 5.15522 9.4484 5.24091 9.30723 5.29924C9.16606 5.35757 9.01475 5.38739 8.86201 5.38699V5.388Z"
                        fill="#ACACAC"
                      />
                    </svg>

                    <b-tooltip
                      placement="bottomright"
                      :target="data.data.id"
                      triggers="click blur"
                    >
                      {{
                        data.data && data.data.failed_message
                          ? data.data.failed_message
                          : "-"
                      }}
                    </b-tooltip>
                  </div>

                  <!-- AUTO SIGNED IN STATUS -->
                  <div v-else-if="data.data.scan_data_type.id == 9">
                    <span class="text-green font-weight-bold">
                      {{ data.data.scan_data_type.name }}</span
                    >
                    <svg
                      tabindex="0"
                      v-b-tooltip
                      :id="data.data.id"
                      style="margin-left: 10px; outline: none"
                      width="17.73"
                      height="17.73"
                      viewBox="0 0 17.73 17.73"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.86201 5.64211e-08C7.10912 0.000197833 5.39565 0.520172 3.93827 1.49417C2.48089 2.46817 1.34505 3.85245 0.674388 5.47197C0.00372177 7.09149 -0.171673 8.87351 0.170421 10.5927C0.512514 12.3119 1.35671 13.891 2.59626 15.1304C3.83582 16.3698 5.41506 17.2139 7.13429 17.5558C8.85351 17.8977 10.6355 17.7221 12.255 17.0512C13.8744 16.3804 15.2586 15.2444 16.2324 13.7869C17.2062 12.3294 17.726 10.6159 17.726 8.86299C17.726 7.699 17.4967 6.54641 17.0513 5.47104C16.6058 4.39567 15.9529 3.41857 15.1297 2.59555C14.3066 1.77253 13.3295 1.11971 12.254 0.674362C11.1786 0.229014 10.026 -0.000131275 8.86201 5.64211e-08ZM10.021 13.5C10.021 13.8074 9.89891 14.1022 9.68156 14.3195C9.4642 14.5369 9.1694 14.659 8.86201 14.659C8.55462 14.659 8.25982 14.5369 8.04246 14.3195C7.82511 14.1022 7.70301 13.8074 7.70301 13.5V8C7.70301 7.69261 7.82511 7.39781 8.04246 7.18045C8.25982 6.9631 8.55462 6.84099 8.86201 6.84099C9.1694 6.84099 9.4642 6.9631 9.68156 7.18045C9.89891 7.39781 10.021 7.69261 10.021 8V13.5ZM8.86201 5.388C8.63336 5.3874 8.41001 5.31913 8.2201 5.19179C8.0302 5.06445 7.88223 4.88374 7.79487 4.67244C7.70751 4.46114 7.68466 4.22871 7.7292 4.00444C7.77373 3.78017 7.88368 3.57412 8.04515 3.41223C8.20661 3.25035 8.41239 3.13987 8.63655 3.09476C8.8607 3.04964 9.09317 3.07191 9.3047 3.15872C9.51622 3.24554 9.69732 3.39302 9.82514 3.5826C9.95297 3.77217 10.0218 3.99536 10.023 4.224C10.0237 4.37674 9.9941 4.5281 9.93602 4.66937C9.87793 4.81064 9.79246 4.93902 9.68455 5.04712C9.57664 5.15522 9.4484 5.24091 9.30723 5.29924C9.16606 5.35757 9.01475 5.38739 8.86201 5.38699V5.388Z"
                        fill="#ACACAC"
                      />
                    </svg>
                    <b-tooltip
                      placement="bottomright"
                      :target="data.data.id"
                      triggers="click blur"
                    >
                      {{
                        data.data && data.data.failed_message
                          ? data.data.failed_message
                          : "-"
                      }}
                    </b-tooltip>
                  </div>

                  <div v-else-if="data.data.scan_data_type.id == 4">
                    <span class="text-red font-weight-bold">{{
                      data.data.scan_data_type.name
                    }}</span>
                  </div>

                  <!-- VISIT UPDATED STATUS -->
                  <div v-else-if="data.data.scan_data_type.id == 10">
                    <span>{{ data.data.scan_data_type.name }}</span>
                    <svg
                      tabindex="0"
                      v-b-tooltip
                      :id="data.data.id"
                      style="margin-left: 10px; outline: none"
                      width="17.73"
                      height="17.73"
                      viewBox="0 0 17.73 17.73"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.86201 5.64211e-08C7.10912 0.000197833 5.39565 0.520172 3.93827 1.49417C2.48089 2.46817 1.34505 3.85245 0.674388 5.47197C0.00372177 7.09149 -0.171673 8.87351 0.170421 10.5927C0.512514 12.3119 1.35671 13.891 2.59626 15.1304C3.83582 16.3698 5.41506 17.2139 7.13429 17.5558C8.85351 17.8977 10.6355 17.7221 12.255 17.0512C13.8744 16.3804 15.2586 15.2444 16.2324 13.7869C17.2062 12.3294 17.726 10.6159 17.726 8.86299C17.726 7.699 17.4967 6.54641 17.0513 5.47104C16.6058 4.39567 15.9529 3.41857 15.1297 2.59555C14.3066 1.77253 13.3295 1.11971 12.254 0.674362C11.1786 0.229014 10.026 -0.000131275 8.86201 5.64211e-08ZM10.021 13.5C10.021 13.8074 9.89891 14.1022 9.68156 14.3195C9.4642 14.5369 9.1694 14.659 8.86201 14.659C8.55462 14.659 8.25982 14.5369 8.04246 14.3195C7.82511 14.1022 7.70301 13.8074 7.70301 13.5V8C7.70301 7.69261 7.82511 7.39781 8.04246 7.18045C8.25982 6.9631 8.55462 6.84099 8.86201 6.84099C9.1694 6.84099 9.4642 6.9631 9.68156 7.18045C9.89891 7.39781 10.021 7.69261 10.021 8V13.5ZM8.86201 5.388C8.63336 5.3874 8.41001 5.31913 8.2201 5.19179C8.0302 5.06445 7.88223 4.88374 7.79487 4.67244C7.70751 4.46114 7.68466 4.22871 7.7292 4.00444C7.77373 3.78017 7.88368 3.57412 8.04515 3.41223C8.20661 3.25035 8.41239 3.13987 8.63655 3.09476C8.8607 3.04964 9.09317 3.07191 9.3047 3.15872C9.51622 3.24554 9.69732 3.39302 9.82514 3.5826C9.95297 3.77217 10.0218 3.99536 10.023 4.224C10.0237 4.37674 9.9941 4.5281 9.93602 4.66937C9.87793 4.81064 9.79246 4.93902 9.68455 5.04712C9.57664 5.15522 9.4484 5.24091 9.30723 5.29924C9.16606 5.35757 9.01475 5.38739 8.86201 5.38699V5.388Z"
                        fill="#ACACAC"
                      />
                    </svg>
                    <b-tooltip
                      placement="bottomright"
                      :target="data.data.id"
                      triggers="click blur"
                    >
                      {{
                        data.data && data.data.failed_message
                          ? data.data.failed_message
                          : "-"
                      }}
                    </b-tooltip>
                  </div>

                  <div v-else class="text-green font-weight-bold">
                    {{ data.data.scan_data_type.name }}
                  </div>
                </div>
              </template>

              <template #image-cell="{ data }">
                <div class="dash-img">
                  <ImageCell
                   :image="data.data.Image"
                    :name="data.data.FirstName.charAt(0)"
                  />
                </div>
              </template>

              <template #temp-cell="{ data }">
                <span class="text-green font-weight-bold">{{
                  data.value
                }}</span>
              </template>

              <template #compliance-cell="{ data }">
              <div class="dash-comp">
                <CompliancesCell :data="data.data.Compliances" />
                </div>
              </template>

              <template #document-cell="{ data }">
                <span
                  class="text-capitalize"
                  @click="
                    (data.data.vaccine_document != 'Not Applicable'&& data.data.vaccine_document != '-') &&
                      setUserData(data.data)
                  "
                  v-b-modal="
                    (data.data.vaccine_document != 'Not Applicable'&& data.data.vaccine_document != '-') &&
                    'vaccineDetails'
                  "
                  :class="
                    renderVaccineDocumentColor(data.data.vaccine_document)
                  "
                  >{{ data.data.vaccine_document }}
                  <svg v-if="data.data.vaccine_document == '-'"
                      tabindex="0"
                      v-b-tooltip
                      :id="data.data.id"
                      style="margin-left: 10px; outline: none"
                      width="17.73"
                      height="17.73"
                      viewBox="0 0 17.73 17.73"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.86201 5.64211e-08C7.10912 0.000197833 5.39565 0.520172 3.93827 1.49417C2.48089 2.46817 1.34505 3.85245 0.674388 5.47197C0.00372177 7.09149 -0.171673 8.87351 0.170421 10.5927C0.512514 12.3119 1.35671 13.891 2.59626 15.1304C3.83582 16.3698 5.41506 17.2139 7.13429 17.5558C8.85351 17.8977 10.6355 17.7221 12.255 17.0512C13.8744 16.3804 15.2586 15.2444 16.2324 13.7869C17.2062 12.3294 17.726 10.6159 17.726 8.86299C17.726 7.699 17.4967 6.54641 17.0513 5.47104C16.6058 4.39567 15.9529 3.41857 15.1297 2.59555C14.3066 1.77253 13.3295 1.11971 12.254 0.674362C11.1786 0.229014 10.026 -0.000131275 8.86201 5.64211e-08ZM10.021 13.5C10.021 13.8074 9.89891 14.1022 9.68156 14.3195C9.4642 14.5369 9.1694 14.659 8.86201 14.659C8.55462 14.659 8.25982 14.5369 8.04246 14.3195C7.82511 14.1022 7.70301 13.8074 7.70301 13.5V8C7.70301 7.69261 7.82511 7.39781 8.04246 7.18045C8.25982 6.9631 8.55462 6.84099 8.86201 6.84099C9.1694 6.84099 9.4642 6.9631 9.68156 7.18045C9.89891 7.39781 10.021 7.69261 10.021 8V13.5ZM8.86201 5.388C8.63336 5.3874 8.41001 5.31913 8.2201 5.19179C8.0302 5.06445 7.88223 4.88374 7.79487 4.67244C7.70751 4.46114 7.68466 4.22871 7.7292 4.00444C7.77373 3.78017 7.88368 3.57412 8.04515 3.41223C8.20661 3.25035 8.41239 3.13987 8.63655 3.09476C8.8607 3.04964 9.09317 3.07191 9.3047 3.15872C9.51622 3.24554 9.69732 3.39302 9.82514 3.5826C9.95297 3.77217 10.0218 3.99536 10.023 4.224C10.0237 4.37674 9.9941 4.5281 9.93602 4.66937C9.87793 4.81064 9.79246 4.93902 9.68455 5.04712C9.57664 5.15522 9.4484 5.24091 9.30723 5.29924C9.16606 5.35757 9.01475 5.38739 8.86201 5.38699V5.388Z"
                        fill="#ACACAC"
                      />
                    </svg>
                    <b-tooltip v-if="data.data.vaccine_document == '-'"
                      placement="bottomright"
                      :target="data.data.id"
                      triggers="click blur"
                    >
                    Not required according to the compliance frequency settings
                    </b-tooltip>
                  </span
                >
              </template>
            </DxDataGrid>
          </div>
        </template>

        <template #image-cell="{ data }">
          <div class="dash-img">
            <ImageCell
              :image="data.data.Image"
              :name="data.data.FirstName.charAt(0)"
            />
          </div>
        </template>

        <template #tempUnitsTemplate>
          <div class="tempreture-settings my-2 d-flex align-items-center p-1">
            <label class="mb-0 mr-3 text-muted" for="radio-slots"
              >Temperature Units</label
            >
            <b-form-group class="mb-0 custom-activeRadio circle-position">
              <b-form-radio-group
                id="radio-slots"
                v-model="selectedTempreture"
                :options="options"
                v-on:change="changeTemperature()"
                name="radio-options-slots"
              >
              </b-form-radio-group>
            </b-form-group>
          </div>
        </template>

        <template #clearAllTemplate>
          <div class="clear-cols">
            <div class="custom-line"></div>
            <Button
              text="Clear columns filters"
              @click="reset()"
              styling-mode="outlined"
              type="danger"
              class="clear-CustomColums"
            />
          </div>
        </template>

        <template #dateFilterTemplate>
          <div>
            <!-- <label for="example-datepicker">Choose a date</label> -->
            <!-- <b-form-datepicker id="example-datepicker" class="mb-2"></b-form-datepicker> -->
            <!-- <p>Value: '{{ value }}'</p> -->
            <!-- <b-button size="sm" @click="open = !open" variant="primary"
              >Filter by date</b-button

              :open="open"
              :style="{ opacity: '0' }"
            > -->
            <div class="d-flex filter-input">
              <div class="datee mx-1">
                <date-picker
                  range
                  append-to-body
                  lang="en"
                  value-type="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="Filter by date"
                  :clearable="false"
                  range-separator=""
                  ref="datePick"
                  :class="{
                    'date-noDataWidth': !dateRange[0],
                    'date-dataWidth': !!dateRange[0],
                  }"
                  v-model="dateRange"
                  @change="dateChanged()"
                >
                  <i slot="icon-calendar" class="mdi mdi-calendar"> </i>
                </date-picker>
              </div>
              <div class="center-icon d-flex h-30">
                <div
                  class="date-close-style d-flex align-items-center mx-1"
                  v-if="dateRange && dateRange.length > 0"
                  @click="
                    dateRange = [];
                    dateChanged();
                  "
                >
                  <svg
                  style="cursor:pointer"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.02 0 0 4.02 0 9C0 13.98 4.02 18 9 18C13.98 18 18 13.98 18 9C18 4.02 13.98 0 9 0ZM13.58 12.04C14 12.46 14 13.14 13.58 13.56C13.36 13.78 13.1 13.88 12.82 13.88C12.54 13.88 12.26 13.78 12.06 13.56L9.06 10.56L6.04 13.56C5.82 13.78 5.56 13.88 5.28 13.88C5 13.88 4.72 13.78 4.52 13.56C4.1 13.14 4.1 12.46 4.52 12.04L7.54 9.02L4.52 6.02C4.1 5.6 4.1 4.92 4.52 4.5C4.94 4.08 5.62 4.08 6.04 4.5L9.06 7.52L12.08 4.5C12.5 4.08 13.18 4.08 13.6 4.5C14.02 4.92 14.02 5.6 13.6 6.02L10.58 9.04L13.58 12.04Z"
                      fill="#F46A6A"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #exportButtonTemplate>
          <DxDropDownButton
            :items="buttonData"
            text="Export"
            @item-click="serverSideExport"
            v-if="isServerSideExport"
          />

          <DxDropDownButton
            :items="buttonData"
            text="Export"
            @item-click="onItemClick"
            v-else
          />
        </template>

        <template #columnButtonTemplate>
          <button
            class="custom-columns mx-1"
            @click="dataGrid.showColumnChooser()"
          >
            <span class="custom-text">Columns </span>

            <span class="custom-icon">
              <b-icon icon="caret-down-fill"></b-icon>
            </span>
          </button>
        </template>

        <!-- <template #exportCSVTemplate>
          <DxButton icon="export" hint="Export to CSV" @click="exportCSV()" />
        </template>

        <template #exportExcelTemplate>
          <DxButton
            icon="exportxlsx"
            hint="Export to Excel"
            @click="exportXLSX()"
          />
        </template>

        <template #exportPDFTemplate>
          <DxButton
            icon="exportpdf"
            hint="Export to PDF"
            @click="exportPDF()"
          />
        </template> -->

        <template #status-cell="{ data }">
          <!-- <StatusCell :status="data.data.Status" :data="data.data.Data" /> -->

          <div
            v-if="
              data.data.scan_data_type.id == 4 ||
              data.data.scan_data_type.id == 5 ||
              data.data.scan_data_type.id == 8
            "
          >
            <span class="text-red font-weight-bold">{{
              data.data.scan_data_type.name
            }}</span>
          </div>

          <div v-else class="text-green font-weight-bold">
            {{ data.data.scan_data_type.name }}
          </div>
        </template>

        <template #site-cell="{ data }">
          <div>
            <span>{{ data.value }}</span>
            <svg
              tabindex="0"
              v-b-tooltip
              :id="data.data.visit_id"
              style="margin-left: 10px; outline: none"
              width="17.73"
              height="17.73"
              viewBox="0 0 17.73 17.73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-if="data.data.area.full_path.includes('>')"
            >
              <path
                d="M8.86201 5.64211e-08C7.10912 0.000197833 5.39565 0.520172 3.93827 1.49417C2.48089 2.46817 1.34505 3.85245 0.674388 5.47197C0.00372177 7.09149 -0.171673 8.87351 0.170421 10.5927C0.512514 12.3119 1.35671 13.891 2.59626 15.1304C3.83582 16.3698 5.41506 17.2139 7.13429 17.5558C8.85351 17.8977 10.6355 17.7221 12.255 17.0512C13.8744 16.3804 15.2586 15.2444 16.2324 13.7869C17.2062 12.3294 17.726 10.6159 17.726 8.86299C17.726 7.699 17.4967 6.54641 17.0513 5.47104C16.6058 4.39567 15.9529 3.41857 15.1297 2.59555C14.3066 1.77253 13.3295 1.11971 12.254 0.674362C11.1786 0.229014 10.026 -0.000131275 8.86201 5.64211e-08ZM10.021 13.5C10.021 13.8074 9.89891 14.1022 9.68156 14.3195C9.4642 14.5369 9.1694 14.659 8.86201 14.659C8.55462 14.659 8.25982 14.5369 8.04246 14.3195C7.82511 14.1022 7.70301 13.8074 7.70301 13.5V8C7.70301 7.69261 7.82511 7.39781 8.04246 7.18045C8.25982 6.9631 8.55462 6.84099 8.86201 6.84099C9.1694 6.84099 9.4642 6.9631 9.68156 7.18045C9.89891 7.39781 10.021 7.69261 10.021 8V13.5ZM8.86201 5.388C8.63336 5.3874 8.41001 5.31913 8.2201 5.19179C8.0302 5.06445 7.88223 4.88374 7.79487 4.67244C7.70751 4.46114 7.68466 4.22871 7.7292 4.00444C7.77373 3.78017 7.88368 3.57412 8.04515 3.41223C8.20661 3.25035 8.41239 3.13987 8.63655 3.09476C8.8607 3.04964 9.09317 3.07191 9.3047 3.15872C9.51622 3.24554 9.69732 3.39302 9.82514 3.5826C9.95297 3.77217 10.0218 3.99536 10.023 4.224C10.0237 4.37674 9.9941 4.5281 9.93602 4.66937C9.87793 4.81064 9.79246 4.93902 9.68455 5.04712C9.57664 5.15522 9.4484 5.24091 9.30723 5.29924C9.16606 5.35757 9.01475 5.38739 8.86201 5.38699V5.388Z"
                fill="#ACACAC"
              />
            </svg>
            <b-tooltip
              placement="bottomright"
              :target="data.data.visit_id"
              triggers="click blur"
              v-if="data.data.area.full_path.includes('>')"
            >
              {{
                data.data.area
                  ? data.data.area.full_path + " > " + data.data.area.name
                  : ""
              }}
            </b-tooltip>
          </div>
        </template>

        <template #departure-cell="{ data }">
          {{ data.data.Departure ? data.data.Departure : "-" }}
        </template>

        <template #visit-notes-cell="{ data }">
          <div
            style="
              white-space: normal;
              overflow-wrap: break-word;
              height: 90;
              width: 90;
            "
          >
            {{ data.value }}

            <a
              class="read_more"
              style="cursor: pointer"
              v-if="
                data.data.originalVisitNotes &&
                data.data.originalVisitNotes.length > 37 &&
                data.data.originalVisitNotes !== '-'
              "
              @click="changeFullText(data.data)"
            >
              Read {{ data.data.showingFullText ? "Less" : "More" }}
            </a>
          </div>
        </template>

        <template #action-cell="{ data }">
          <div>
            <div class="text-center" style="display: none">
              <ActionCell
                :status="checkInStatus"
                :data="checkInData"
                id="checkInUser"
                ref="checkInUser"
              />
              <!-- <DxButton icon="fas fa-edit font-16 mr-2" name="edit"> </DxButton> -->
              <!-- <DxColumn icon="fas fa-edit font-16 mr-2" name="edit" [onClick]="editOrderItem">
                    </DxColumn> -->
            </div>

            <b-dropdown
              id="#selectDashActions"
              text="Select Actions"
              class="
                d-flex
                align-items-center
                
                mx-3
                top-page-btn
                m-md-2
                custom-selectWidth
              "
              variant="primary"
              size="sm"
            >
              <template v-slot:button-content>
                <span class="custom-fontActions">Select Actions</span>
                <svg style="margin-left:8px" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.91961 4.64098C4.01093 4.74571 4.12395 4.82975 4.25102 4.88734C4.37809 4.94494 4.51622 4.97475 4.65598 4.97475C4.79573 4.97475 4.93384 4.94494 5.06091 4.88734C5.18798 4.82975 5.30103 4.74571 5.39235 4.64098L8.87415 0.810973C9.27819 0.363973 9.11961 0.000975021 8.51254 0.000975126L0.799387 0.000976461C0.193327 0.000976566 0.0337599 0.366974 0.4378 0.810974L3.91961 4.64098Z" fill="white"/>
</svg>
              </template>
              <b-dropdown-item
                href="#"
                @click="openCheckInModal(data.data)"
                style=""
                >Check in user</b-dropdown-item
              >

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-item
                href="#"
                @click="
                  openVisitNotes(
                    data.data.visit_id,
                    data.data.originalVisitNotes
                  )
                "
                
                style="padding-bottom: 12px"
                >Add Visit Notes</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </template>
      </DxDataGrid>
    </section>

    <!-- warning  -->
    <b-modal
      id="visitNotes"
      class="popover-modal"
      hide-header
      hide-footer
      no-close-on-esc
      ref="visitNotes"
    >
      <slot name="modal-header">
        <div
          class="modal-header flex-row"
          style="padding-left: 0; padding-top: 0"
        >
          <h4 class="modal-title">
            <slot name="modal-title"> Visit Notes </slot>
          </h4>
        </div>
      </slot>
      <div class="d-block text-center mb-4" style="padding-left: 0">
        <b-form-textarea
        id="myTextarea"
          :value="visitNotesCopy"
          @keyup="visitNotesChanged($event)"
          class="form-control visitNotesText"
          rows="5"
          placeholder="Notes"
          :maxlength="max"
        ></b-form-textarea>
      </div>
      <!-- <hr class="mt-1" /> -->
      <div class="action-btns">
        <b-button
          variant="primary"
          type="button"
          pill
          :disabled="isDisabled"
          class="text-center mt-2 px-5 mr-2"
          @click="addVisitNotes"
        >
          
          <span>Save</span>
        </b-button>

        <b-button
          variant="outline-danger"
          type="button"
          pill
          class="text-center mt-2 px-5"
          @click="$bvModal.hide('visitNotes')"
        >
          
          <span>Cancel</span>
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>

<style lang="scss" scoped>


.custom-selectWidth {
  width: 141.41px !important;
  height: 27px !important;
}
.tempreture-settings {
  position: relative;
}

.read_more {
  width: 69px;
  height: 17px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-decoration-line: underline;
  color: #2680eb;
}
.visitNotesText {
  left: 32.99%;
  right: 33.12%;
  top: 42.67%;
  bottom: 43.56%;
  background-color: #f2f2f2;
  border-color: #f2f2f2;
  border-radius: 4px;
}
h4 {
  left: 33.01%;
  right: 61.09%;
  top: 36.11%;
  bottom: 61.67%;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  line-height: 20px;
  color: #495057;
}
// counts
.scan-box {
  flex: 0 0 121px;
  height: 96px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.875rem;
  margin-bottom: 1%;
  -webkit-box-shadow: 1px 13px 12px 6px rgba(242, 242, 242, 0.98);
  box-shadow: 1px 13px 12px 6px rgba(242, 242, 242, 0.98);

  .scan-info {
    .scan-item {
      font-family: "Lato";
      font-style: normal;
      font-weight: 900;
      line-height: 12px;
      text-transform: uppercase;
      color: #c7c7c7;
      // font-size: 0.625;
      font-size: 10px;
      text-align: center;
      @media only screen and (max-width: 1120px) {
        font-size: 0.7rem;
      }
      @media only screen and (max-width: 768px) {
        width: 100%;

        .scan-item {
          font-size: 0.6rem;
        }
      }
    }
    .scan-item-user {
      font-family: "Lato";
      font-style: normal;
      font-weight: 900;
      line-height: 12px;
      color: #000000;
      opacity: 0.2;
      font-size: 10px;
      text-align: center;
      @media only screen and (max-width: 1120px) {
        font-size: 0.7rem;
      }
      @media only screen and (max-width: 768px) {
        width: 100%;

        .scan-item-user {
          font-size: 0.6rem;
        }
      }
    }
    .scan-item-two {
      font-family: "lato";
      font-style: normal;
      font-weight: 900;
      font-size: 30px;
      line-height: 36px;
      color: #103f5e;

      @media only screen and (max-width: 1120px) {
        font-size: 1.25rem;
      }
      @media only screen and (max-width: 768px) {
        width: 100%;

        .scan-item-two {
          font-size: 0.625rem;
        }
      }
    }
  }

  .icon-wrapper {
    background-color: #103f5e;
    width: 25px;
    height: 25px;
    line-height: 25px;
    border-radius: 50%;
    text-align: center;

    i {
      color: #fff;
      font-size: 1rem;
    }

    @media only screen and (max-width: 1120px) {
      width: 20px;
      height: 20px;
      line-height: 20px;

      i {
        color: #fff;
        font-size: 0.7rem;
      }
    }
  }
}

.visible-icon {
  font-size: 2rem;
  color: #103f5e;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    color: aquamarine;
  }
}

.clear-icon {
  font-size: 1.1rem;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    color: #f46a6a;
  }
}

.toggle-cols-wrapper {
  background-color: #fff;
  padding: 1%;
}

.in-color {
  color: #34c38f;
}

.out-color {
  color: #f46a6a;
}

.status-icon {
  font-size: 1.5rem;
}



.dashboard-grid {
  @media only screen and (max-width: 700px) {
    font-size: 0.6rem !important;
  }
}

#exportButton {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
.dashboard-grid{
  td.dx-cell-focus-disabled.dx-master-detail-cell {
    background:white!important;
    padding-left:0!important;
}
tr.dx-row.dx-data-row.dx-row-lines.dx-column-lines {
     height: 59px !important;
  }
}
.user-col,.dash-comp,.dash-img{
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
}
.user-col{
  height:59px!important;
}
.dash-img {
 
    transition: all 1s ease-in-out;
}

.dash-img:hover img{
  // width:15px!important;
  // height:15px!important;
  // z-index:99999;
  transform:scale(1.5);
}
 .dx-datagrid-header-panel{
    padding-left:0!important;
    padding-right:0!important;
    
  }
.select-actionsDAsh {
  ul.dropdown-menu.show {
    background: #ffffff !important;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.161) !important;
    border-radius: 6px !important;
    text-align: center !important;
    min-width: 176px !important;
    min-height: 86px !important;
    margin-top: 8px !important;
  }
  a.dropdown-item {
    margin: auto !important;
    font-family: "Lato";
    font-style: normal;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 19px !important;
    text-align: center !important;
    color: #787878 !important;
    padding-right: 22px !important;
  }
}

// a.dx-link.dx-link-edit {
//   width: 116px !important;
//  font-family: 'Lato';
// font-style: normal;
// font-weight: 400;
// font-size: 16px;
// line-height: 19px;
// text-align: center;
// color: #FFFFFF;
// margin-bottom:20px;

// }

// td.dx-command-edit.dx-cell-focus-disabled {
//   height:59px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }
.dx-widget.dx-button.dx-button-mode-outlined.dx-button-danger.dx-button-has-text.clear-CustomColums {
  height: 27px;
  margin-left: 34px !important;
  border: 1.5px solid #f46a6a !important;
  border-radius: 4px !important;
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #f46a6a;

  .dx-button-content {
    display: flex;
    align-items: center;
  }
}
.custom-columns {
  display: inline-flex;
  margin-left: 32px !important;
  margin-right: 20px !important ;
  width: 97px;
  height: 27px !important;
  border: none;
  outline: none;
  border-radius: 4px;
  letter-spacing: 0.04em;
  background: #2680eb;
  overflow: hidden;
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  position: relative;
  cursor: pointer;
  .custom-text,
  .custom-icon {
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    height: 100%;
  }
  .custom-text {
    padding: 0 5px 0 5px !important;
  }
  .custom-icon {
    position: absolute;
    padding: 0 5px !important;
    bottom: -5%;
    right: -1%;
    border-radius: 0%;
    font-size: 12px !important;
    line-height: 16px !important;
  }
}

.custom-activeRadio.circle-position
  .custom-radio
  .custom-control-label::before {
  top: 0;
}
.custom-activeRadio.circle-position .custom-radio .custom-control-label::after {
  top: 0.245rem;
}
.tooltip .tooltip-inner {
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.161);
  color: #787878;
  width: 137px;
}

.dx-pager .dx-page-sizes .dx-selection,
.dx-pager .dx-pages .dx-selection {
  font-weight: 500;
  background-color: #103f5e;
  color: #fff;
}

.tooltip .arrow {
  display: none !important;
}
// .date-close-style {
//   width: 18px;
//   height: 18px;
//   border-radius: 50%;
//   justify-content: center;
//   justify-items: center;
//   left: 70.21%;
//   right: 28.26%;
//   top: 33.67%;
//   bottom: 63.89%;
//   color: blue !important;
//   margin-right: 34px !important;
//   background: #f46a6a !important;
// }
// .date-close {
//   color: #ffffff;
//   font-size: large;
//   line-height: 1.7 !important;
//   font-weight: bold !important;
//   background-color: transparent !important;
//   border: none !important;
// }
// .date-close:active {
//   outline: none;
// }
.datee {
  .date-noDataWidth {
    .mx-input {
      width: 134px !important;
      padding: 0 6px;
    }
  }
  .date-dataWidth {
    .mx-input {
      width: 226px !important;
    }
  }
  .mx-datepicker {
    .mx-icon-calendar {
      color: #ffffff !important;
    }
    .mdi {
      color: #ffffff !important;
    }
    .mx-input::placeholder {
      color: #ffffff !important;
      font-family: "Lato";
      font-style: normal;
      font-weight: 400 !important;
      font-size: 16px !important;
      line-height: 19px !important;
    }
    .mx-input {
      height: 27px !important ;
      top: 34.11% !important;
      bottom: 62.89% !important;
      // padding: 0 5px !important;
      background: #2680eb !important;
      border-color: #2680eb !important;
      border-radius: 4px !important;
      color: #ffffff !important;
      font-weight: 400 !important;
      font-size: 16px !important;
      line-height: 19px !important;
    }
  }
}

filter-input {
  justify-items: center;
  align-items: center;
}
.center-icon {
  align-items: center;
  justify-content: center;
}
.custom-clo {
  height: 200px;
  width: 20px;
  background-color: blue;
}
.datee {
  margin-left: 20px !important;
  margin-right: 20px !important;
  .mx-datepicker {
    .mx-icon-calendar {
      color: #ffffff !important;
    }
    .mdi {
      color: #ffffff !important;
    }
    .mx-input::placeholder {
      color: #ffffff !important;
    }
  }
}
.custom-line {
  width: 1px;
  height: 27px;
  opacity: 0.08;
  background: #000000;
  opacity: 0.08;
  position: absolute;
  // left: 69%;
  // top: 10px;
}

</style>