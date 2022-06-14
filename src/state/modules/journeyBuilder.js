import journeyService from "@/services/journeyBuilder";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    journeysList: [],
    loading: false,
    journeyDetails:{},
    flowsAndTypes:{},
  };
};

export const state = getDefaultState();

export const actions = {
  addJourney({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .addJourney(params)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          this._vm.$toast.success("Journey Flow Created");
          router.push(`/update/journey/${params.journey_id}`);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchJourneys({ commit },params) {
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneys(params)
        .then((data) => {
          resolve(data);
          commit("setJourneys", data.data);
          commit("setJourneyDetails", {});
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchJourneyDetails({ commit }, id) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .journeyDetails(id)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setJourneyDetails", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateJourney({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .updateJourney(params)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          this._vm.$toast.success("Journey Flow Updated");
          router.push(`/update/journey/${params.journey_id}`);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  deleteJourney({ commit,dispatch }, id) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .deleteJourney(id)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          this._vm.$toast.success("Journey Flow Deleted");
          dispatch("fetchJourneys");
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchJourneysFlowandTypes({ commit }, id) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneysFlowandTypes(id)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setFlowsandTypes", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  resetJourneyBuilderState (state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setJourneys(state, payload) {
    state.journeysList = payload;
  },
  setJourneyDetails(state, payload) {
    state.journeyDetails = payload;
  },
  setFlowsandTypes(state, payload) {
    state.flowsAndTypes = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getJourneys(state) {
    return state.journeysList;
  },
  getJourneyDetails(state) {
    return state.journeyDetails;
  },
  getFlowsandTypes(state) {
    return state.flowsAndTypes;
  },
};
