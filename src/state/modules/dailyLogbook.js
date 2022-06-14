import logbookService from "@/services/dailyLogbook";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    logbookData: [],
    dashboardCounts: [],
    loadingStatus: false,
    ScanDataTypes: [],
    inputTypes: [],
    userTypes: [],
    areas: [],
    kiosks: [],
  }
}

export const state = getDefaultState();

export const actions = {
  async resetDashboardData({ commit }) {
    await commit("logbookData", null);
  },
  async getAll({ commit, dispatch }, params) {
    commit("grid/setLoading", true, { root: true });
    commit("grid/setRecordsCount", null, { root: true });
    await dispatch("resetDashboardData");
    return new Promise((resolve, reject) => {
      logbookService
        .getAll(params)
        .then((data) => {
          resolve(data);
          console.log('logbook', data.data.data, params);
          commit("logbookData", data.data.data);
          commit("grid/setRecordsCount", data.data.count, { root: true });
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          commit("grid/setLoading", false, { root: true });
          reject(err);
        });
    });
  },
  getCounts({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getCounts()
        .then((data) => {
          commit("dashboardCounts", data.data.totals.daily);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchScanDatatypes({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getScanDatatypes()
        .then((data) => {
          commit("setScanDataTypes", data.data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchInputTypes({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getInputTypes()
        .then((data) => {
          commit("setInputTypes", data.data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchAreas({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getAreas()
        .then((data) => {
          commit("setAreas", data.data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchKiosks({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getKiosks()
        .then((data) => {
          commit("setKiosks", data.data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchUserTypes({ commit }) {
    return new Promise((resolve, reject) => {
      logbookService
        .getUserTypes()
        .then((data) => {
          commit("setUserTypes", data.data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  scanAttendances({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      logbookService
        .scanAction(payload)
        .then((data) => {
          dispatch("notification/success", data.message, { root: true });
          resolve(data);
          dispatch("getAll");
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  dashboardAction({ dispatch, commit }, params) {
    commit("setLoadongStatus", true);
    return new Promise((resolve, reject) => {
      logbookService
        .dashboardAction(params)
        .then((data) => {
          this._vm.$toast.success("Visit Added");
          resolve(data);
          router.history.current.path != "/" &&
            router.push("/");
          dispatch("getAll");
          dispatch("getCounts");
          commit("modal/setModalState", true, { root: true });
          setTimeout(() => {
            commit("setLoadongStatus", false);
          }, 1000);
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(err.data.message?err.data.message:err.data.data);
          commit("modal/setModalState", false, { root: true });
          commit("setLoadongStatus", false);
        });
    });
  },
  resetState({ commit }){
    commit("setLoadongStatus",false);
  },
  addVisitNotes({ commit }, payload) {
    commit("setLoadongStatus",false);
    return new Promise((resolve, reject) => {
      console.log('add', payload);
      logbookService
        .addVisitNotes(payload)
        .then((data) => {
          // this._vm.$toast.success("Visit Notes Added");
          resolve(data);
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(err.data.message?err.data.message:err.data.data);
        });
    });
  }
};

export const mutations = {
  resetDashboardState (state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setLoadongStatus(state, loading) {
    state.loadingStatus = loading;
  },
  logbookData(state, payload) {
    state.logbookData = payload;
  },
  dashboardCounts(state, payload) {
    state.dashboardCounts = payload;
  },
  setScanDataTypes(state, payload) {
    state.ScanDataTypes = payload;
  },
  setInputTypes(state, payload) {
    state.inputTypes = payload;
  },
  setUserTypes(state, payload) {
    state.userTypes = payload;
  },
  setAreas(state, payload) {
    state.areas = payload;
  },
  setKiosks(state, payload) {
    state.kiosks = payload;
  },
};

export const getters = {
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
  getDashboardData(state) {
    return state.logbookData;
  },
  dashboardCounts(state) {
    return state.dashboardCounts;
  },
  getScanDataTypes(state) {
    return state.ScanDataTypes;
  },
  getInputTypes(state) {
    return state.inputTypes;
  },
  getUserTypes(state) {
    return state.userTypes;
  },
  getAreas(state) {
    return state.areas;
  },
  getKiosks(state) {
    return state.kiosks;
  },
};
