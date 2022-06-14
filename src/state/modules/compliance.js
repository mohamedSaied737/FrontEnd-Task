import complianceService from "@/services/compliance";
import router from "../../router/index";


const getDefaultState = () => {
  return {
    complianceList: [],
    complianceDetails: [],
    loading:false,
  };
};

export const state = getDefaultState();

export const actions = {
  fetchComplianceList({ commit }, ) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      complianceService
        .getCompliance()
        .then((data) => {
          resolve(data);
          commit("setComplianceList", data.data);
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
        });
    });
  },
  complianceDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      complianceService
        .getComplianceDetails(id)
        .then((data) => {
          resolve(data);
          commit("setComplianceDetails", data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createCompliance({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      complianceService
        .createCompliance(payload)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Compliance Added");
          router.push('/compliances');
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
          commit("setLoading", false);
        });
    });
  },
  deleteCompliance({ commit, dispatch }, id) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      complianceService
        .deleteCompliance(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Compliance Deleted");
          commit("grid/setLoading", false, { root: true });
          dispatch("fetchComplianceList");
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateComplianceAction({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      complianceService
        .updateCompliance(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Compliance Updated");
          router.push('/compliances');
          commit("setLoading", false);
          dispatch("fetchComplianceList");
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  resetComplianceState (state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setComplianceList(state, payload) {
    state.complianceList = payload;
  },
  setComplianceDetails(state, payload) {
    state.complianceDetails = payload;
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
};

export const getters = {
  getComplianceList(state) {
    return state.complianceList;
  },
  getComplianceDetails(state) {
    return state.complianceDetails;
  },
  getLoading(state) {
    return state.loading;
  },
};
