import journeyFlowService from "@/services/journeyFlow";
import router from "../../router/index";

export const state = {
  journeyFlowList: [],
  loading:false,
};

export const actions = {
  fetchJourneyFlowList({ commit }, ) {
    commit("setLoadong", true);
    return new Promise((resolve, reject) => {
      journeyFlowService
        .getJourneyFlows()
        .then((data) => {
          resolve(data);
          commit("setjourneyFlowList", data.data);
          commit("setLoadong", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoadong", false);
        });
    });
  },
  createjourneyFlow({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyFlowService
        .createJourneyFlow(payload)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message);
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  deletejourneyFlow({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      journeyFlowService
        .deleteJourneyFlow(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Journey Flow Deleted");
          dispatch("journeyBuilder/fetchJourneys",null,{root:true});
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updatejourneyFlowAction({ commit }, params) {
    commit("setLoading", true);
    return new Promise(() => {
      journeyFlowService
        .updateJourneyFlow(params)
        .then((data) => {
          this._vm.$toast.success(data.message);
          commit("setLoading", false);
          router.push('/journeys');
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  setJourneyFlowList(state, payload) {
    state.journeyFlowList = payload;
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
};

export const getters = {
  getJourneyFlowList(state) {
    return state.journeyFlowList;
  },
  getLoading(state) {
    return state.loading;
  },
};
