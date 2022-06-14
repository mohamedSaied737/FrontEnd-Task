<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
// grid imports
import ImageCell from "@/components/sharedCells/ImageCell";
import { reportHistoryColumns } from "@/utils/dataSource";
import { exportExel } from "@/utils/mixins/exportMixin";
import CompliancesCell from "@/components/dashboard/CompliancesCell";
import Compliances from "@/components/dashboard/Compliances";
import store from "@/state/store";
import VaccineDetails from "@/components/users/VaccineDetails";
import CustomStore from "devextreme/data/custom_store";
import Api from "../../../services/Api";
import { default as Button } from "devextreme-vue/button";
import DxDropDownButton from "devextreme-vue/drop-down-button";
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxFilterRow,
  DxHeaderFilter,
  DxColumnChooser,
  DxExport,
  DxStateStoring,
  DxPaging,
  DxPager,
  DxToolbar,
  DxItem,
} from "devextreme-vue/data-grid";
import { exportDataGrid } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import "jspdf-autotable";

const dataGridRef = "dataGrid";

export default {
  title: "History",
  name: "History",
  mixins: [exportExel],
  components: {
    Layout,
    PageHeader,
    ImageCell,
    Compliances,
    CompliancesCell,
    VaccineDetails,

    DxDataGrid,
    DxColumn,
    DxLookup,
    DxFilterRow,
    DxHeaderFilter,
    DxColumnChooser,
    DxExport,
    DxStateStoring,
    DxPaging,
    DxPager,
    DxToolbar,
    DxItem,
    Button,
    DxDropDownButton,
  },
  data() {
    return {
      title: "History",
      selectedTempreture: "c",
      multipleFilters: [],
      options: [
        { text: "°F", value: "f" },
        { text: "°C", value: "c" },
      ],
      items: [
        {
          text: "Users",
          href: "/users",
        },
        {
          text: "List",
          active: true,
        },
      ],
      reportHistoryColumns: reportHistoryColumns,
      isServerSideExport: false,
      hasMaskOptions: ["Not Applicable", "Yes", "No"],
      updatedInputTypes: [],
      vaccineOptions: [
        "Vaccinated",
        "Not Applicable",
        "Negative PCR",
        "Unchecked",
      ],
      dataGridRef,
      vaccineDocument: false,
      statusHeaderFilter: [],
      userTypeHeaderFilter: [],
      inputTypeHeaderFilter: [],
      kioskHeaderFilter: [],
      areaHeaderFilter: [],
      siteHeaderFilter: [],
      finalFilterObject: {},
      sortObject: {},
      totalCount: "",
      dataStore: new CustomStore({
        key: ["ID"],
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
            if (i in loadOptions && this.isNotEmpty(loadOptions[i])) {
              params += `${i}=${JSON.stringify(loadOptions[i])}&`;
              if (i == "filter")
                filterQuery += `${JSON.stringify(loadOptions[i])}`;
              if (i == "sort") {
                sortObject.sortField = loadOptions[i][0].selector;
                sortObject.sortOrder = loadOptions[i][0].desc ? "desc" : "asc";
              }
            }
          });
          this.resetHistoryData();
          params = params.slice(0, -1);
          let filters;
          let finalFilterObject = {};
          this.multipleFilters = [];
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
                      finalFilter[filter[0][0]].start = moment
                        .utc(new Date(finalFilter[filter[0][0]].start))
                        .tz("UTC")
                        .format("YYYY-MM-DD HH:mm:ss");
                      finalFilter[filter[0][0]].end = moment
                        .utc(new Date(finalFilter[filter[0][0]].end))
                        .tz("UTC")
                        .format("YYYY-MM-DD HH:mm:ss");
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
                    finalFilter[filter[0][0]].start = moment
                      .utc(new Date(finalFilter[filter[0][0]].start))
                      .tz("UTC")
                      .format("YYYY-MM-DD HH:mm:ss");
                    finalFilter[filter[0][0]].end = moment
                      .utc(new Date(finalFilter[filter[0][0]].end))
                      .tz("UTC")
                      .format("YYYY-MM-DD HH:mm:ss");
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
                      // finalFilter[filter[0]].start = filter2;
                      finalFilter[filter[0]].start = moment
                        .utc(new Date(filter2))
                        .tz("UTC")
                        .format("YYYY-MM-DD HH:mm:ss");
                      finalFilter[filter[0]].end = moment
                        .utc(new Date(filter2))
                        .tz("UTC")
                        .format("YYYY-MM-DD HH:mm:ss");
                      this.multipleFilters.push(finalFilter);
                      // this.multipleFilters.push(finalFilter);
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
                        finalFilter[andFilter[0][0]].start = moment
                          .utc(new Date(finalFilter[andFilter[0][0]].start))
                          .tz("UTC")
                          .format("YYYY-MM-DD HH:mm:ss");
                        finalFilter[andFilter[0][0]].end = moment
                          .utc(new Date(finalFilter[andFilter[0][0]].end))
                          .tz("UTC")
                          .format("YYYY-MM-DD HH:mm:ss");
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
          return Api()
            .get(
              `/report_list_history/${store.getters["authfack/currentEntity"].id}${params}`,
              {
                params: {
                  filterBy: finalFilterObject,
                  orderBy: sortObject ? sortObject : { sortField: null },
                },
              }
            )
            .then((data) => {
              const reportData = [];
              let entity = store.getters["authfack/currentEntity"];
              data.data.data.map((report) => {
                let userTimezone = moment.tz.guess();
                let degre = report.temperature_type
                  ? report.temperature_type == "f"
                    ? report.temperature * (9 / 5) + 32
                    : report.temperature
                  : entity.setting[0].pivot.value == "f"
                  ? report.temperature * (9 / 5) + 32
                  : report.temperature;
                reportData.push({
                  ScanId: report.id,
                  Image: report.image_base64 ? report.image_base64 : null, // base64Img
                  Status: report.scan_data_type.name,
                  scan_data_type: report.scan_data_type
                    ? report.scan_data_type
                    : "",
                  failed_message: report.failed_message,
                  FirstName: report.visite
                    ? report.visite.user.first_name
                    : "-",
                  LastName: report.visite ? report.visite.user.last_name : "-",
                  Email: report.visite ? report.visite.user.email : "-",
                  Phone: report.visite ? report.visite.user.phone : "-",
                  companyName: report.visite
                    ? report.visite.user.company_name
                    : "-",
                  vehicleRegistration: report.visite
                    ? report.visite.user.vehicle_registration
                    : "-",
                  ActionBy: report.action_by ? report.action_by : "-",
                  UserType: report.user_type
                    ? report.user_type.name
                    : report.entity_user_type_name,
                  ID:
                    report.visite && report.visite.user
                      ? report.visite.user.user_user_id
                      : "-",
                  RFID:
                    report.visite &&
                    report.visite.user &&
                    report.visite.user.rfid_number
                      ? report.visite.user.rfid_number
                      : "-",
                  Kiosk: report.kiosk ? report.kiosk.name : null,
                  Notes:
                    report.visite && report.visite.notes
                      ? report.visite.notes
                      : "-",
                  Area: report.area.name,
                  Site: report.area.site.name,
                  InputType: report.scan_by
                    ? report.input_method.name + " - " + report.scan_by
                    : report.input_method.name,
                  hasMask:
                    report.has_mask == 1
                      ? "Yes"
                      : report.has_mask == 0
                      ? "No"
                      : "Not Applicable",
                  Compliances: report.compliances,
                  Temperature:
                    Math.round(degre * 10) / 10 +
                    (report.temperature_type
                      ? report.temperature_type == "f"
                        ? " °F"
                        : " °C"
                      : entity.setting[0].pivot.value == "f"
                      ? " °F"
                      : " °C"),
                  DateTime: moment
                    .utc(report.created_at)
                    .tz(userTimezone)
                    .format("YYYY-MM-DD hh:mm:ss"),
                  unit: report.temperature_type
                    ? report.temperature_type
                    : entity.setting[0].pivot.value,
                  deg: Math.round(degre * 10) / 10,
                  defaultUnit: report.temperature_type
                    ? report.temperature_type == "f"
                      ? " °F"
                      : " °C"
                    : entity.setting[0].pivot.value == "f"
                    ? " °F"
                    : " °C",
                  defaultDeg: Math.round(degre * 10) / 10,
                  defaultUnitType: report.temperature_type
                    ? report.temperature_type
                    : entity.setting[0].pivot.value,
                  Host: report.visite
                    ? report.visite.host != null
                      ? report.visite.host.first_name +
                        " " +
                        report.visite.host.last_name
                      : ""
                    : "",
                  VaccineDocument:
                    report &&
                    report.user_document.length > 0 &&
                    report.user_document[0]
                      ? report.user_document[0].pivot &&
                        report.user_document[0].pivot.document_status
                      : report.metadata &&
                        report.metadata.checks.length > 0 &&
                        report.metadata.checks[0].type == "vaccine_document"
                      ? "Unchecked"
                      : "Not Applicable",
                  FullName: report.visite.user.fullName,
                  LastVaccine: report.user_document[0],
                });
                switch (this.selectedTempreture) {
                  case "f":
                    if (reportData[reportData.length - 1].unit == "c") {
                      reportData[reportData.length - 1].unit = "f";
                      reportData[reportData.length - 1].deg =
                        reportData[reportData.length - 1].deg * (9 / 5) + 32;
                      reportData[reportData.length - 1].Temperature =
                        Math.round(reportData[reportData.length - 1].deg * 10) /
                          10 +
                        " °F";
                    }
                    break;
                  case "c":
                    if (reportData[reportData.length - 1].unit == "f") {
                      reportData[reportData.length - 1].unit = "c";
                      reportData[reportData.length - 1].deg =
                        (reportData[reportData.length - 1].deg - 32) * (5 / 9);
                      reportData[reportData.length - 1].Temperature =
                        Math.round(reportData[reportData.length - 1].deg * 10) /
                          10 +
                        " °C";
                    }
                    break;
                  case "default":
                    reportData[reportData.length - 1].unit = "c";
                    reportData[reportData.length - 1].deg =
                      (reportData[reportData.length - 1].deg - 32) * (5 / 9);
                    return (reportData[reportData.length - 1].Temperature =
                      Math.round(reportData[reportData.length - 1].deg * 10) /
                        10 +
                      " °C");
                  default:
                    break;
                }
              });
              this.isServerSideExport =
                data.data.totalCount >= process.env.VUE_APP_EXPORT_LIST_COUNT;
              this.finalFilterObject = finalFilterObject;
              this.sortObject = sortObject ? sortObject : { sortField: null };
              this.totalCount = data.data.totalCount;
              // this.resetHistoryData();

              return {
                data: reportData,
                totalCount: data.data.totalCount,
                summary: data.data.summary,
                groupCount: data.data.groupCount,
              };
            })
            .catch((err) => {
              throw new Error(err);
            });
        },
      }),
      allowedOperations: ["contains"],
      selectedOperation: "contains", // default icon
      buttonData: ["Excel", "CSV", "PDF"],
      dataGridRefName: "History",
      filterValue: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 6
        ),
        new Date(),
      ],
      hasMaskHeaderFilter: [
        {
          text: "Yes",
          value: ["hasMask", "contains", ["Yes"]],
        },
        {
          text: "No",
          value: ["hasMask", "contains", ["No"]],
        },
        {
          text: "Not Applicable",
          value: ["hasMask", "contains", ["Not_Applicable"]],
        },
      ],
      vaccineHeaderFilter: [
        {
          text: "Vaccinated",
          value: ["VaccineDocument", "contains", ["Vaccinated"]],
        },
        {
          text: "Not Applicable",
          value: ["VaccineDocument", "contains", ["Not_Applicable"]],
        },
        {
          text: "Negative PCR",
          value: ["VaccineDocument", "contains", ["Negative PCR"]],
        },
        {
          text: "Positive PCR",
          value: ["VaccineDocument", "contains", ["Positive PCR"]],
        },
        {
          text: "Unchecked",
          value: ["VaccineDocument", "contains", ["Unchecked"]],
        },
        {
          text: "Expired",
          value: ["VaccineDocument", "contains", ["Expired"]],
        },
        {
          text: "Not Supported",
          value: ["VaccineDocument", "contains", ["Not Supported"]],
        },
      ],
      actionByHeaderFilter: [
        {
          text: "Admin",
          value: ["ActionBy", "contains", ["Admin"]],
        },
        {
          text: "User",
          value: ["ActionBy", "contains", ["User"]],
        },
        {
          text: "System",
          value: ["ActionBy", "contains", ["System"]],
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
    };
  },
  watch: {
    getInputTypes(getInputTypes) {
      this.updatedInputTypes = JSON.parse(JSON.stringify(getInputTypes));
      const objIndex = this.updatedInputTypes.findIndex(
        (obj) => obj.name == "face recognition"
      );
      this.updatedInputTypes[objIndex].name = "Facial Recognition";
    },
    getDocuments(Documents) {
      this.vaccineDocument = Documents.length > 0;
    },
  },
  computed: {
    ...mapGetters("dailyLogbook", [
      "getScanDataTypes",
      "getKiosks",
      "getAreas",
      "getUserTypes",
      "getInputTypes",
    ]),
    ...mapGetters("sites", ["getCompliances", "getSitesWithAreas"]),
    ...mapGetters("reports", ["getHistoryRports"]),
    ...mapGetters("users", ["getDocuments"]),
    ...mapGetters("grid", [
      "getSelectedRows",
      "getTableHeaders",
      "getLoading",
      "getRecordsCount",
      "getVaccinePCRColumnAppearance",
    ]),
    ...mapGetters("authfack", ["userDetails"]),
    userEmail() {
      return this.userDetails && this.userDetails.email;
    },
    rowsData() {
      let entity = store.getters["authfack/currentEntity"];
      return this.getHistoryRports && this.getHistoryRports.length > 0
        ? this.getHistoryRports.map((report) => {
            let userTimezone = moment.tz.guess();
            let imageScan = report.image;
            if (imageScan !== null) {
              imageScan = imageScan.replace("entity_id", entity.id);
            }
            let degre = report.temperature_type
              ? report.temperature_type == "f"
                ? report.temperature * (9 / 5) + 32
                : report.temperature
              : entity.setting[0].pivot.value == "f"
              ? report.temperature * (9 / 5) + 32
              : report.temperature;
            return {
              Image: imageScan,
              Status: report.scan_data_type.name,
              FirstName: report.visite ? report.visite.user.first_name : "-",
              LastName: report.visite ? report.visite.user.last_name : "-",
              Email: report.visite ? report.visite.user.email : "-",
              Phone: report.visite ? report.visite.user.phone : "-",
              companyName: report.visite
                ? report.visite.user.company_name
                : "-",
              vehicleRegistration: report.visite
                ? report.visite.user.vehicle_registration
                : "-",
              RFID:
                report.visite &&
                report.visite.user &&
                report.visite.user.rfid_number
                  ? report.visite.user.rfid_number
                  : "-",
              UserType: report.user_type_id
                ? report.user_type.name
                : report.entity_user_type_name,
              ID:
                report.visite && report.visite.user_id
                  ? report.visite.user_id
                  : "-",
              Kiosk: report.kiosk ? report.kiosk.name : null,
              Area: report.area.name,
              Site:
                report && report && report.area && report.area.site
                  ? report.area.site.name
                  : "-",
              InputType: report.scan_by
                ? report.input_method.name + " - " + report.scan_by
                : report.input_method.name,
              hasMask:
                report.has_mask == 1
                  ? "Yes"
                  : report.has_mask == 0
                  ? "No"
                  : "Not Applicable",
              Compliances: report.compliances,
              Temperature:
                Math.round(degre * 10) / 10 +
                (report.temperature_type
                  ? report.temperature_type == "f"
                    ? " °F"
                    : " °C"
                  : entity.setting[0].pivot.value == "f"
                  ? " °F"
                  : " °C"),
              Date: moment
                .utc(report.visite.date)
                .tz(userTimezone)
                .format("YYYY-MM-DD"),
              unit: report.temperature_type
                ? report.temperature_type
                : entity.setting[0].pivot.value,
              deg: Math.round(degre * 10) / 10,
              defaultUnit: report.temperature_type
                ? report.temperature_type == "f"
                  ? " °F"
                  : " °C"
                : entity.setting[0].pivot.value == "f"
                ? " °F"
                : " °C",
              defaultDeg: Math.round(degre * 10) / 10,
              defaultUnitType: report.temperature_type
                ? report.temperature_type
                : entity.setting[0].pivot.value,
              Host: report.visite
                ? report.visite.host != null
                  ? report.visite.host.first_name +
                    " " +
                    report.visite.host.last_name
                  : ""
                : "",
              VaccineDocument:
                report &&
                report.user_document.length > 0 &&
                report.user_document[0]
                  ? report.user_document[0].pivot &&
                    report.user_document[0].pivot.document_status
                  : report.metadata &&
                    report.metadata.checks.length > 0 &&
                    report.metadata.checks[0].type == "vaccine_document"
                  ? "Unchecked"
                  : "Not Applicable",
              FullName: report.visite.user.fullName,
              LastVaccine: report.user_document[0],
            };
          })
        : [];
    },
    dataGrid() {
      return this.$refs[this.dataGridRefName].instance;
    },
  },
  methods: {
    ...mapActions("dailyLogbook", [
      "fetchScanDatatypes",
      "fetchUserTypes",
      "fetchKiosks",
      "fetchAreas",
      "fetchInputTypes",
    ]),
    ...mapActions("reports", ["HistoryRportAction", "resetHistoryData"]),
    ...mapActions("users", ["fetchDocuments"]),
    ...mapActions("grid", [
      "onTableHeader",
      "createTableHeaders",
      "updateTableHeaders",
      "resetTableHeaders",
      "resetFilterValues",
      "checkVaccinePCRColumnAppearance",
    ]),
    ...mapActions("modal", ["onResetModal", "setData"]),
    ...mapActions("compliance", ["fetchComplianceList"]),
    ...mapActions("sites", ["fetchSiteswithAreas"]),

    async customLoad() {
      if (this.userEmail !== "lt_techteam@visipoint.com") {
        let value = this.getTableHeaders;
        await this.onTableHeader({
          url: "/reporting/history",
          // headers: reportHistoryColumns,
        });

        console.log("customLoad", value);
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
        // localStorage.setItem('dashboardGrid', value);
        console.log(
          "customsave",
          value == JSON.stringify(this.getTableHeaders)
        );

        if (!this.getTableHeaders) {
          this.createTableHeaders({
            url: "/reporting/history",
            headers: value,
            filters: "[]",
          });
        } else if (value != JSON.stringify(this.getTableHeaders)) {
          this.updateTableHeaders({
            url: "/reporting/history",
            headers: value,
            filters: "[]",
          });
        }
        // console.log("customSave vslue", value);
        // console.log("customsave headers", JSON.stringify(this.getTableHeaders));
      }
    },

    setUserData(data) {
      this.setData({
        type: "report_document",
        data,
      });
    },
    vaccineDocumentText(docment) {
      let vaccine = null;
      if (docment.type == "covid_pcr") {
        vaccine = "Negative PCR";
      }
      if (docment.type == "covid_vaccine") {
        vaccine = "Vaccinated";
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
        url: "/reporting/history",
        headers: reportHistoryColumns,
      });
    },
    onItemClick(e) {
      if (e.itemData == "Excel") this.exportXLSX();
      else if (e.itemData == "CSV") this.exportCSV();
      else if (e.itemData == "PDF") this.exportPDF();
    },
    isNotEmpty(value) {
      return value !== undefined && value !== null && value !== "";
    },
    clearFilter() {
      this.$refs[this.dataGridRefName].instance.clearFilter();
    },
    contentReady() {
      this.setColumnChooserPosition();
    },
    onEditorPreparing(e) {
      if (e.parentType == "filterRow") {
        e.editorOptions.placeholder = "Search";
      }
    },
    getLastWeeksDate() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    },
    calculateActionBy(rowData) {
      let actionBy = rowData.ActionBy;
      try {
        const type = actionBy.type;
        if (type == "Admin" || type == "admin")
          return type + " - " + actionBy.fullName;
        else return type;
      } catch (e) {
        return "";
      }
    },
    setColumnChooserPosition() {
      // this.dataGrid.showColumnChooser();
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
    async exportPDF() {
      await this.HistoryRportAction({
        sortObject: this.sortObject,
        finalFilterObject: this.finalFilterObject,
        limit: this.totalCount,
      });
      const columnNames =
        this.$refs[this.dataGridRefName].instance.getVisibleColumns();
      const columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i].allowExporting)
          columns.push(columnNames[i].dataField);
      }

      const doc = new jsPDF("landscape");
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
      doc.save("History.pdf");
      // this.onSetLoading({ value: false });
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
            "History.xlsx"
          );
        });
      });
      // e.cancel = true;
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
            "History.csv"
          );
        });
      });
      // e.cancel = true;
    },
    changeTemperature() {
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
                    key: row.ID,
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
                    key: row.ID,
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
                    key: row.ID,
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
                    key: row.ID,
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
                  key: row.ID,
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
                  key: row.ID,
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
      });
    },
    extractedData(type) {
      const { rowsData } = this;
      const columnNames = this.dataGrid.getVisibleColumns();
      const columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i].allowExporting)
          columns.push(columnNames[i].dataField);
      }
      const columnsObject = columns.reduce((a, v) => ({ ...a, [v]: v }), {});

      const data = rowsData;
      // console.log("extracteddata", rowsData);
      return data && data.length > 0
        ? data.map((row) => {
            ["data", "Data", "Compliances"].forEach((e) => delete row[e]); // reomve unexported columns
            // const keys = Object.keys(row);
            // console.log('keys', keys);
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
    renderDataGrid() {
      this.dataGrid.updateDimensions();
    },
  },
  created() {
    document.addEventListener("mousedown", (e) => {
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

    // this.statusHeaderFilter = {
    //   store: {
    //     type: "array",
    //     data: this.getScanDataTypes,
    //     key: "id",
    //   },
    // };

    this.getScanDataTypes.map((status) => {
      this.statusHeaderFilter.push({
        text: status.name,
        value: ["Status", "contains", [status.id]],
      });
    });

    this.getUserTypes.map((userType) => {
      this.userTypeHeaderFilter.push({
        text: userType.name,
        value: ["UserType", "contains", [userType.id]],
      });
    });

    this.getInputTypes.map((inputType) => {
      this.inputTypeHeaderFilter.push({
        text: inputType.name,
        value: ["InputType", "contains", [inputType.id]],
      });
    });

    this.getAreas.map((site) => {
      site.items
        ? site.items.map((area) => {
            this.areaHeaderFilter.push({
              text: area.text,
              value: ["Area", "contains", [area.value]],
              items: area.items
                ? area.items.map((item) => {
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
                                      value: [
                                        "Area",
                                        "contains",
                                        [item3.value],
                                      ],
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
          })
        : [];
    });

    this.getSitesWithAreas.map((site) => {
      this.siteHeaderFilter.push({
        text: site.name,
        value: ["Site", "contains", [site.id]],
      });
    });

    this.getKiosks.map((kiosk) => {
      this.kioskHeaderFilter.push({
        text: kiosk.name,
        value: ["Kiosk", "contains", [kiosk.id]],
      });
    });
  },
  mounted() {
    window.addEventListener("unload", this.resetFilterValues());
    // this.fetchTableHeaders();
    this.fetchDocuments();
    this.fetchComplianceList();
    this.fetchSiteswithAreas();
    this.resetHistoryData();
  },
  destroyed() {
    // this.resetTableHeaders();
    this.resetFilterValues();
  },
  beforeMount() {
    this.checkVaccinePCRColumnAppearance();
  },
};
</script>

<template>
  <Layout>
    <!-- vaccine details  -->
    <PageHeader :title="title" :items="items" />
    <b-modal
      id="vaccineDetails"
      :scrollable="getCompliances.length > 0 ? true : false"
      hide-footer
      hide-header
      size="lg"
    >
      <VaccineDetails />
    </b-modal>
    <!-- grid -->
    <DxDataGrid
      :data-source="dataStore"
      id="gridContainer"
      :ref="dataGridRefName"
      :remote-operations="true"
      :showBorders="false"
      :columnAutoWidth="true"
      :allowColumnReordering="true"
      :allowColumnResizing="false"
      :rowAlternationEnabled="false"
      :showColumnLines="true"
      :showRowLines="true"
      :repaint-changes-only="true"
      :two-way-binding-enabled="true"
      @content-ready="contentReady($event)"
      @editor-preparing="onEditorPreparing($event)"
    >
      <DxStateStoring
        :enabled="true"
        type="custom"
        :customLoad="customLoad"
        :customSave="customSave"
        storage-key="historyGrid"
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

      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />

      <DxColumnChooser :enabled="true" mode="select" />
      <DxExport :enabled="true" :allow-export-selected-data="false" />

      <DxToolbar>
        <!-- <DxItem name="columnChooserButton" location="before" /> -->
        <DxItem location="before" template="columnButtonTemplate" />
        <DxItem template="exportButtonTemplate" location="before" />
        <DxItem template="clearAllTemplate" location="before" />
        <DxItem template="tempUnitsTemplate" />
      </DxToolbar>

      <DxColumn
        data-field="Image"
        :width="110"
        caption="Image"
        cell-template="image-cell"
        :allow-filtering="false"
        :allow-editing="false"
        :allow-sorting="false"
        :visible="true"
        :allow-header-filtering="false"
      >
      </DxColumn>

      <DxColumn
        data-field="FirstName"
        caption="First Name"
        :visible="true"
        :allow-filtering="true"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
      >
      </DxColumn>

      <DxColumn
        data-field="LastName"
        caption="Last Name"
        :visible="true"
        :allow-filtering="true"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
      >
      </DxColumn>

      <DxColumn
        data-field="Status"
        caption="Action"
        :allow-exporting="true"
        cell-template="status-cell"
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
        data-field="ActionBy"
        caption="By"
        :calculate-cell-value="calculateActionBy"
        :allow-filtering="false"
        :allow-header-filtering="true"
        :visible="true"
      >
        <DxHeaderFilter :data-source="actionByHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="DateTime"
        caption="At"
        data-type="datetime"
        :min-width="200"
        format="yyyy-MM-dd HH:mm:ss"
        :filter-value="filterValue"
        selected-filter-operation="between"
        :visible="true"
        :allow-header-filtering="false"
        :allow-filtering="true"
        :filter-operations="['between']"
      >
      </DxColumn>

      <DxColumn
        data-field="Site"
        caption="Site"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="true"
      >
        <DxHeaderFilter :data-source="siteHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="Area"
        caption="Area"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="false"
      >
        <DxHeaderFilter
          :group-interval="[['site'], ['area']]"
          :data-source="areaHeaderFilter"
        />
      </DxColumn>

      <DxColumn
        data-field="Kiosk"
        caption="Kiosk"
        cell-template="kiosk-cell"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="true"
      >
        <DxHeaderFilter :data-source="kioskHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="UserType"
        caption="User Type"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="true"
      >
        <DxHeaderFilter :data-source="userTypeHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="InputType"
        caption="Input"
        :allow-editing="false"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="true"
      >
        <DxHeaderFilter :data-source="inputTypeHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="Temperature"
        caption="Temperature"
        :allow-editing="false"
        cell-template="temperature-cell"
        :visible="true"
        :allow-filtering="true"
        :allow-header-filtering="false"
      >
        <DxLookup
          :data-source="tempHeaderFilter"
          value-expr="id"
          display-expr="name"
        />
      </DxColumn>

      <DxColumn
        data-field="hasMask"
        caption="has a mask?"
        :visible="true"
        :allow-filtering="false"
        :allow-header-filtering="true"
      >
        <DxHeaderFilter :data-source="hasMaskHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="Compliances"
        caption="Compliances"
        cell-template="compliance-cell"
        :allow-filtering="false"
        :allow-exporting="false"
        :visible="true"
      >
        <DxHeaderFilter :allow-search="false" />
      </DxColumn>

      <DxColumn
        data-field="VaccineDocument"
        caption="Document - Vaccine/PCR"
        cell-template="document-cell"
        :allow-editing="false"
        :allow-filtering="false"
        :allow-header-filtering="true"
        :visible="true"
      >
        <DxHeaderFilter :data-source="vaccineHeaderFilter" />
      </DxColumn>

      <DxColumn
        data-field="companyName"
        caption="Company"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
        :visible="true"
      />

      <DxColumn
        data-field="Notes"
        caption="Notes"
        :min-width="250"
        cell-template="visit-notes-cell"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
        :visible="true"
      >
      </DxColumn>

      <DxColumn
        data-field="Email"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
        :visible="true"
      >
      </DxColumn>

      <DxColumn
        data-field="Phone"
        caption="Phone Number"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
        :visible="true"
      />

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
        :visible="false"
        :allow-filtering="true"
        :allow-header-filtering="false"
        :filter-operations="allowedOperations"
      >
      </DxColumn>

      <DxColumn
        :allow-editing="false"
        :allow-filtering="false"
        :allow-header-filtering="false"
        :allow-exporting="true"
        :show-in-column-chooser="false"
        :visible="false"
      />
      <template #image-cell="{ data }">
        <div>
          <ImageCell
            :image="data.data.Image"
            :name="data.data.FirstName ? data.data.FirstName.charAt(0) : ''"
          />
        </div>
      </template>
      <template #status-cell="{ data }">
        <div>
          <!-- DENIED & AUTO SIGNED OUT STATUS -->
          <div
            v-if="
              data.data.scan_data_type.id == 5 ||
              data.data.scan_data_type.id == 8
            "
          >
            <span class="text-red font-weight-bold">
              {{ data.data.scan_data_type.name }}
            </span>
            <svg
              tabindex="0"
              v-b-tooltip
              :id="data.data.ScanId"
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
              :target="data.data.ScanId"
              triggers="click blur"
            >
              {{ data.data.failed_message ? data.data.failed_message : "-" }}
            </b-tooltip>
          </div>

          <!-- AUTO SIGNED IN STATUS -->
          <div v-else-if="data.data.scan_data_type.id == 9">
            <span class="text-green font-weight-bold">
              {{ data.data.scan_data_type.name }}
            </span>
            <svg
              tabindex="0"
              v-b-tooltip
              :id="data.data.ScanId"
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
              :target="data.data.ScanId"
              triggers="click blur"
            >
              {{ data.data.failed_message ? data.data.failed_message : "-" }}
            </b-tooltip>
          </div>

          <!-- SIGNED OUT STATUS -->
          <div v-else-if="data.data.scan_data_type.id == 4">
            <span class="text-red font-weight-bold">
              {{ data.data.scan_data_type.name }}
            </span>
          </div>

          <!-- VISIT UPDATED STATUS -->
          <div v-else-if="data.data.scan_data_type.id == 10">
            <span>{{ data.data.scan_data_type.name }}</span>
            <svg
              tabindex="0"
              v-b-tooltip
              :id="data.data.ScanId"
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
              :target="data.data.ScanId"
              triggers="click blur"
            >
              {{ data.data.failed_message ? data.data.failed_message : "-" }}
            </b-tooltip>
          </div>

          <!-- SIGNED IN / CHECKED IN STATUS -->
          <div v-else class="text-green font-weight-bold">
            {{ data.data.scan_data_type.name }}
          </div>
        </div>
      </template>
      <template #kiosk-cell="{ data }">
        <span class="no-wrap" :class="!data.data.Kiosk && 'text-danger'">
          {{ data.data.Kiosk ? data.data.Kiosk : "-" }}
        </span>
      </template>
      <template #temperature-cell="{ data }">
        <span class="text-green font-weight-bold">
          {{ data.data.Temperature }}
        </span>
      </template>
      <template #compliance-cell="{ data }">
        <CompliancesCell :data="data.data.Compliances" />
      </template>
      <template #document-cell="{ data }">
        <span
          class="text-capitalize"
          @click="
            data.data.VaccineDocument != 'Not Applicable' &&
              setUserData(data.data)
          "
          v-b-modal="
            data.data.VaccineDocument != 'Not Applicable' && 'vaccineDetails'
          "
          :class="renderVaccineDocumentColor(data.data.VaccineDocument)"
          >{{ data.data.VaccineDocument }}</span
        >
      </template>

      <template #clearAllTemplate>
        <div class="clear-cols">
          <div class="custom-line"></div>
          <Button
            text="Clear columns filters"
            @click="clearFilter"
            styling-mode="outlined"
            type="danger"
            class="clear-CustomColums"
          />
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
    </DxDataGrid>

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
    <b-modal
      id="dashboardAction"
      :scrollable="getCompliances.length > 0 ? true : false"
      hide-footer
      hide-header
      size="lg"
    >
      <UserCheckinAction />
    </b-modal>
  </Layout>
</template>
<style lang="scss">
.dx-pager .dx-page-sizes .dx-selection,
.dx-pager .dx-pages .dx-selection {
  font-weight: 500;
  background-color: #103f5e;
  color: #fff;
}

.tooltip .tooltip-inner {
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.161);
  color: #787878;
  width: 137px;
}
.tooltip .arrow {
  display: none !important;
}

.dx-master-detail-cell {
  background-color: #f3f3f3 !important;
}

.dx-button-mode-text.dx-button-default {
  background-color: transparent;
  color: #103f5e;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.dx-checkbox-checked .dx-checkbox-icon {
  color: #fff;
  background-color: #103f5e;
  border: none;
  font: 16px/1em DXIcons;
  text-align: center;
}
.dx-checkbox-indeterminate .dx-checkbox-icon {
  background-color: #103f5e;
  color: #fff;
  border: none;
  font: 20px/1em DXIcons;
  text-align: center;
}
</style>
<style lang="scss" scoped>
.custom-line {
  width: 1px;
  height: 27px;
  opacity: 0.08;
  background: #000000;
  opacity: 0.08;
  position: absolute;
  right: 45% !important;
}
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
</style>
<style lang="scss">
.dx-datagrid-header-panel {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.dx-widget.dx-button.dx-button-mode-outlined.dx-button-danger.dx-button-has-text.clear-CustomColums.dx-template-wrapper.dx-item-content.dx-toolbar-item-content {
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
</style>