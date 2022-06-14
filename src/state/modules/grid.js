import gridService from "@/services/grid";

export const state = {
  loading: false,
  pdfLoading: false,
  tableHeaders: {},
  tableFilters: {},
  adminPreferenceId: null,
  selectedRows: [],
  filterValues: {},
  filterInputValue: {},
  selectedTempreture: "default",
  exportURL: null,
  exportData: null,
  recordsCount: 5,
  vaccinePCRColumn: null,
  show_export_progess_hint: false,
  current_page: 1,
  page_limit: 10,
};

export const actions = {
  onTableHeader({ commit, dispatch }, params) {
    commit("setLoading", true);
    // console.log('setHeaders', params);
    return new Promise((resolve, reject) => {
      gridService
        .getTableHeaders(params)
        .then((data) => {
          resolve(data)
          console.log('setHeaders', params, data),
            data.data &&
              data.data.length > 0
              //  && Object.keys(JSON.parse(params.headers)).length == Object.keys(JSON.parse(data.data[0].table_head)).length)
              ?
              (commit("setTableHeaders", data.data[0].table_head && typeof data.data[0].table_head != 'object' ? JSON.parse(data.data[0].table_head) : data.data[0].table_head ? data.data[0].table_head : null),
                commit("setTableFilters", data.data[0].url ? data.data[0].url : null),
                commit("setAdminPreferenceId", data.data[0].id),
                commit("setLoading", false))
              :
              (commit("setTableHeaders", null),
                commit("setTableFilters", null),
                commit("setAdminPreferenceId", null),
                commit("setLoading", false))

          if (params.url != '/reporting/history' && params.url != '/') {
            if (!data.data[0])
              dispatch("createTableHeaders", params);
            else if (Object.keys(params.headers).length != (typeof data.data[0].table_head != 'object' ? Object.keys(JSON.parse(data.data[0].table_head)).length : Object.keys(data.data[0].table_head).length))
              dispatch("createTableHeaders", params);
          }
        })
        .catch((err) => {
          reject(err);
          console.log('err', err);
          err.status != 401 && this._vm.$toast.error(err.data && err.data.message ? err.data.message : "-");
          commit("setLoading", false);
        });
    });
  },
  resetTableHeaders({ commit }) {
    commit("setTableHeaders", {});
  },
  createTableHeaders({ commit }, params) {
    return new Promise((resolve, reject) => {
      gridService
        .createTableHeaders(params)
        .then((data) => {
          resolve(data);
          console.log('createTableHeaders', data);
          commit("setTableHeaders", typeof data.data.table_head != 'object' ? JSON.parse(data.data.table_head) : data.data.table_head);
          commit("setTableFilters", data.data.url);
          commit("setAdminPreferenceId", data.data.id);
          // dispatch("onTableHeader", params);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
          commit("setLoading", false);
        });
    });
  },
  updateTableHeaders({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      gridService
        .updateTableHeaders(params)
        .then((data) => {
          resolve(data);
          console.log('updateTableHeaders', data, params);
          commit("setAdminPreferenceId", data.data.id);
          dispatch("onTableHeader", params);
          commit("setLoading", false);
          // if (params.url !== "/")
          // this._vm.$toast.success("Table View Updated");
        })
        .catch((err) => {
          reject(err);
          dispatch("notification/error", err, { root: true });
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  onSelectedRows({ commit }, payload) {
    commit("setSelectedRows", payload);
  },
  resetSelectedRows({ commit }) {
    commit("setSelectedRows", []);
    commit("setExportURL", null);
  },
  // filtration
  onSetFilterValue({ commit }, payload) {
    commit("setFilterValue", payload);
  },
  onsetFilterInputValue({ commit }, payload) {
    commit("setFilterInputValue", payload);
  },
  onClearFilterValue({ commit }, key) {
    commit("clearFilterValue", key);
  },
  resetFilterValues({ commit }) {
    commit("resetFilterValues");
  },
  // tempreture
  onSelectedTempreture({ commit }, payload) {
    commit("setSelectedTempreture", payload);
  },
  // export
  exportBE({ commit }, params) {
    params.type == 'pdf'
      ?
      commit("setPDFLoading", true)
      :
      commit("setLoading", true);
    commit("setExportURL", null);
    return new Promise((resolve, reject) => {
      gridService
        .exportBE(params)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setPDFLoading", false);
          params.type == "pdf"
            ?
            commit("setExportData", data.data)
            :
            commit("setExportURL", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("setPDFLoading", false);
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
        });
    });
  },
  exportJobBE({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      gridService
        .exportJobBE(params)
        .then(() => {
          commit("setLoading", false);
          commit("setExportProgressAppearance", true);
          setTimeout(() => {
            commit("setExportProgressAppearance", false);
          }, 4000);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("setExportProgressAppearance", false);
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
        });
    });
  },
  // vaccine pcr column appearance
  checkVaccinePCRColumnAppearance({ commit }) {
    return new Promise((resolve, reject) => {
      gridService
        .checkVaccinePCRColumnAppearance()
        .then((data) => {
          resolve(data);
          commit("setVaccinePCRColumnAppearance", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // clear all vuex state
  clearAllStoreState({ commit }) {
    commit("dailyLogbook/resetDashboardState", null, { root: true });
    commit("authfack/resetAuthenticationState", null, { root: true });
    commit("reports/resetReportState", null, { root: true });
    commit("entity/resetEntityState", null, { root: true });
    commit("sites/resetSitesState", null, { root: true });
    commit("kiosks/resetKiosksState", null, { root: true });
    commit("compliance/resetComplianceState", null, { root: true });
    commit("journeyBuilder/resetJourneyBuilderState", null, { root: true });
    commit("userType/resetUserTypesState", null, { root: true });
    commit("setPDFLoading", false);
  },
  onSetLoading({ commit }, payload) {
    commit("setLoading", payload.value);
  },
  resetExportProgress({ commit }) {
    commit("setExportProgressAppearance", false);
  },
  onPaginate({ commit }, page) {
    commit("setCurrentPage", page);
  },
  onChangePageLimit({ commit }, limit) {
    commit("setPageLimit", limit);
  },
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setPDFLoading(state, payload) {
    state.pdfLoading = payload;
  },
  setTableHeaders(state, payload) {
    state.tableHeaders = payload;
  },
  setSelectedRows(state, payload) {
    state.selectedRows = payload;
  },
  setTableFilters(state, payload) {
    state.tableFilters = payload;
  },
  setAdminPreferenceId(state, payload) {
    state.adminPreferenceId = payload;
  },
  // filtration
  setFilterValue(state, payload) {
    Object.keys(payload)[0];
    Object.values(payload)[0];
    state.filterValues[Object.keys(payload)[0]] = Object.values(payload)[0];
  },
  clearFilterValue(state, key) {
    delete state.filterValues[key];
  },
  resetFilterValues(state) {
    state.filterValues = {};
    state.selectedTempreture = "default";
  },
  // tempreture
  setSelectedTempreture(state, payload) {
    state.selectedTempreture = payload;
  },
  // export
  setExportURL(state, payload) {
    state.exportURL = payload;
  },
  setExportData(state, payload) {
    state.exportData = payload;
  },
  setFilterInputValue(state, payload) {
    state.filterInputValue[payload.name] = payload.value;
  },
  // record
  setRecordsCount(state, payload) {
    state.recordsCount = payload;
  },
  setVaccinePCRColumnAppearance(state, payload) {
    state.vaccinePCRColumn = payload;
  },
  setExportProgressAppearance(state, payload) {
    state.show_export_progess_hint = payload;
  },
  // pagination
  setCurrentPage(state, payload) {
    state.current_page = payload;
  },
  setPageLimit(state, payload) {
    state.page_limit = payload;
  },

};

export const getters = {
  getTableHeaders(state) {
    return state.tableHeaders;
  },
  getSelectedRows(state) {
    return state.selectedRows;
  },
  getTableFilters(state) {
    return state.tableFilters;
  },
  getAdminPreferenceId(state) {
    return state.adminPreferenceId;
  },
  getLoading(state) {
    return state.loading;
  },
  getPDFLoading(state) {
    return state.pdfLoading;
  },
  getFilterValues(state) {
    return state.filterValues;
  },
  getFilterInputValue(state) {
    return state.filterValues;
  },
  getSelectedTempreture(state) {
    return state.selectedTempreture;
  },
  getExportURL(state) {
    return state.exportURL;
  },
  getExportData(state) {
    return state.exportData;
  },
  getRecordsCount(state) {
    return state.recordsCount;
  },
  getVaccinePCRColumnAppearance(state) {
    return state.vaccinePCRColumn;
  },
  getExportProgessAppearance(state) {
    return state.show_export_progess_hint;
  },
  getCurrentPage(state) {
    return state.current_page;
  },
  getPageLimit(state) {
    return state.page_limit;
  },
};
