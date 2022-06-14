import kiosksService from "@/services/kiosks";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    kiosks: [],
    loading: false,
    kioskSettings: [],
  };
};

export const state = getDefaultState();

export const actions = {
  getAll({ commit }) {
    return new Promise((resolve, reject) => {
      kiosksService
        .getAll()
        .then((data) => {
          commit("setKiosks", data.data);
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
  // move kiosk 
  moveKiosk({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .moveKisok(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Kiosk Moved");
          commit("setLoading", false);
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  moveMultipleKiosks({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .moveMultipleKisoks(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Kiosks Moved");
          commit("setLoading", false);
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // delete kiosk 
  deleteKiosk({ commit, dispatch }, id) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .deleteKiosk(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Kiosk Deleted");
          commit("setLoading", false);
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateKiosk({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .updateKiosk(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Kiosk Settings Updated");
          commit("modal/setModalState", true, { root: true });
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateKiosksSettings({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .updateKiosksSettings(params)
        .then((data) => {
          resolve(data);
          const {params:{site_id}} = params;
          this._vm.$toast.success("Kiosk Settings Updated");
          commit("modal/setModalState", true, { root: true });
          site_id
          ?
          dispatch("sites/fetchSiteswithAreas", null, { root: true })
          :
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  addKiosk({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      kiosksService
        .addKiosk(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Kiosk Added");
          dispatch("sites/fetchAreasFilter", { id: router.history.current.params.id }, { root: true });
          commit("modal/setModalState", true, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          this._vm.$toast.error(Object.values(err.data.errors).join('\r\n'));
          commit("modal/setModalState", false, { root: true });
        });
    });
  },
  kioskDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      kiosksService
        .kioskDetails(id)
        .then((data) => {
          resolve(data);
          commit("setKioskSettings", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  resetKiosksState (state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setKiosks(state, payload) {
    state.kiosks = payload;
  },
  setKioskSettings(state, payload) {
    state.kioskSettings = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getKiosks(state) {
    return state.kiosks;
  },
  getKiosksSettings(state) {
    return state.kioskSettings;
  },
};
