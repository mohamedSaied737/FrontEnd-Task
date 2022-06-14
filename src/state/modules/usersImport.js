import usersService from "@/services/usersImport";
import router from "../../router/index";

export const state = {
  importedUsers: [],
  validUsers: [],
  importedList:[],
  importDetails:[],
  loadingStatus: false,
};

export const actions = {
  resetLoading({commit}){
    commit("setLoadongStatus", false);
  },
  importUsers({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit("setLoadongStatus", true);
      usersService
        .importUsers(params)
        .then((data) => {
          resolve(data);
          commit("setImportedUsers", data.data);
          router.push("/users/import/grid");
          commit("setLoadongStatus", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoadongStatus", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  runImportedUsers({ commit }, params) {
    commit("setLoadongStatus", true);
    setTimeout(() => {
      router.push("/users/import/queue");
    }, 1500);
    return new Promise((resolve, reject) => {
      usersService
        .runImportedUsers(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message);
          commit("setValidUsers", data.data);
          commit("setLoadongStatus", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoadongStatus", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchImportedTasks({ commit }) {
    commit("setLoadongStatus", true);
    return new Promise((resolve, reject) => {
      usersService
        .fetchImportedTasks()
        .then((data) => {
          resolve(data);
          commit("setImportedList", data.data);
          commit("setLoadongStatus", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoadongStatus", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchImportedDetails({ commit },id) {
    commit("setLoadongStatus", true);
    return new Promise((resolve, reject) => {
      usersService
        .fetchImportDetails(id)
        .then((data) => {
          resolve(data);
          commit("setImportDetails", data.data);
          commit("setLoadongStatus", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoadongStatus", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  setLoadongStatus(state, loading) {
    state.loadingStatus = loading;
  },
  setImportedUsers(state, payload) {
    state.importedUsers = payload;
  },
  setValidUsers(state, payload) {
    state.validUsers = payload;
  },
  setImportedList(state, payload){
    state.importedList = payload;
  },
  setImportDetails(state, payload){
    state.importDetails = payload;
  },
};

export const getters = {
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
  getImportedUsers(state) {
    return state.importedUsers;
  },
  getImportedList(state){
    return state.importedList;
  },
  getImportDetails(state){
    return state.importDetails;
  }
};
