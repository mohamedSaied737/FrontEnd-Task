import reportsService from "@/services/reports";

const getDefaultState = () => {
  return {
    reportsTimeList: {},
    reportsHistoryList: {},
    trackTraceList: [],
    Users: [],
  };
};

export const state = getDefaultState();

export const actions = {
  TimeRportAction({ commit }, params) {
    commit("grid/setLoading", true, { root: true });
    commit("grid/setRecordsCount", null, { root: true });
    return new Promise((resolve, reject) => {
      reportsService
        .getTimeRports(params)
        .then((data) => {
          resolve(data);
          commit("setTimeRports", data.data.data);
          commit("grid/setRecordsCount", data.data.count, { root: true });
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  async resetHistoryData({ commit }) {
    await commit("setHistoryRports", null);
  },
  async HistoryRportAction({ commit, dispatch }, params) {
    commit("grid/setLoading", true, { root: true });
    commit("grid/setRecordsCount", null, { root: true });
    await dispatch("resetHistoryData");
    return new Promise((resolve, reject) => {
      reportsService
        .getHistoryRports(params)
        .then((data) => {
          resolve(data);
          console.log('hhh', data);
          commit("setHistoryRports", data.data.data);
          commit("grid/setRecordsCount", data.data.count, { root: true });
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchTrackTrace({ commit }, params) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      reportsService
        .getTrackTrace(params)
        .then((data) => {
          resolve(data);
          commit("setTrackTrace", data.data);
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  clearTrackTraceData({ commit }) {
    commit("setTrackTrace", []);
  },
  fetchUsers({ commit },) {
    return new Promise((resolve, reject) => {
      reportsService
        .getUsers()
        .then((data) => {
          resolve(data);
          commit("setUsers", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  resetReportState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setTimeRports(state, payload) {
    state.reportsTimeList = payload;
  },
  setHistoryRports(state, payload) {
    state.reportsHistoryList = payload;
  },
  setTrackTrace(state, payload) {
    state.trackTraceList = payload;
  },
  setUsers(state, payload) {
    state.Users = payload;
  },
};

export const getters = {
  getTimeRports(state) {
    return state.reportsTimeList;
  },
  getHistoryRports(state) {
    return state.reportsHistoryList;
  },
  getTrackTrace(state) {
    return state.trackTraceList;
  },
  getUsers(state) {
    return state.Users;
  },

};
