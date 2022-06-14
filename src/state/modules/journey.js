import journeyService from "@/services/journey";
import store from "@/state/store";

import router from "../../router/index";

export const state = {
  journeyList: [],
  journeys: [],
  loading: false,
  selectedJourney: null,
  journeyDetails:null,
  journeyUserTypes:null,
  journeyInputs:[],
};

export const actions = {
  fetchJourneyList({ commit }) {
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneys()
        .then((data) => {
          resolve(data);
          commit("setJourneyList", data.data);
          commit("setSelectedJourney", null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchJourneys({ commit }) {
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneys()
        .then((data) => {
          resolve(data);
          commit("setJourneys", data.data);
          commit("setSelectedJourney", null);
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(err.data.message);
          commit("setLoading", false);
        });
    });
  },
  createJourney({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      journeyService
        .createJourney(payload)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Journey Created");
          commit("setSelectedJourney", data.data);
          router.push('/add-flow');
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchUserTypeRelatedToJourney({ dispatch,commit }, id) {
    return new Promise((resolve, reject) => {
      journeyService
        .getUserTypeRelatedToJourney(id)
        .then((data) => {
          resolve(data);
          commit("setJourneyUserTypes", data.data);
          dispatch('fetchJourneyDetails',id);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchJourneyInputs({ commit }, id) {
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneyInputs(id)
        .then((data) => {
          resolve(data);
          commit("setJourneyInputs", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchJourneyDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      journeyService
        .getJourneyDetails(id)
        .then((data) => {
          resolve(data);
          commit("setJourneyDetails", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  deleteJourney({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      journeyService
        .deleteJourney(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Journey Deleted");
          dispatch("journeyBuilder/fetchJourneys",null,{root:true});
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateJourney({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      journeyService
        .updateJourney(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Journey Updated");
          commit("setLoading", false);
          router.push('/journeys');
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  changeJourney({ commit }, payload) {
    commit("setLoading", true);
    console.log('p', payload);
    return new Promise((resolve) => {
      journeyService
        .changeJourney(payload)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message);
          commit("setLoading", false);
          // router.push('/journeys');
          store.dispatch("sites/fetchAreasFilter", {
            id: router.history.current.params.id,
          });
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  }
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setJourneyList(state, payload) {
    state.journeyList = payload;
  },
  setJourneys(state, payload) {
    state.journeys = payload;
  },
  setSelectedJourney(state, payload) {
    state.selectedJourney = payload;
  },
  setJourneyDetails(state, payload) {
    state.journeyDetails = payload;
  },
  setJourneyUserTypes(state, payload) {
    state.journeyUserTypes = payload;
  },
  setJourneyInputs(state, payload) {
    state.journeyInputs = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getJourneyList(state) {
    return state.journeyList;
  },
  getJourneys(state) {
    return state.journeys;
  },
  getSelectedJourney(state) {
    return state.selectedJourney;
  },
  getJourneyDetails(state) {
    return state.journeyDetails;
  },
  getJourneyUserTypes(state) {
    return state.journeyUserTypes;
  },
  getJourneyInputs(state) {
    return state.journeyInputs;
  },
};
