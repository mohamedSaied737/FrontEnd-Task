import settingService from "@/services/setting";

export const state = {
  childSettings: [],
  loadingStatus: false,
};

export const actions = {
  fetchChildSettings({ commit }) {
    return new Promise((resolve, reject) => {
      settingService
        .getChildSettings()
        .then((data) => {
          commit("setChildSettings", data.data);
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
};

export const mutations = {
  loadongStatus(state, loading) {
    state.loadingStatus = loading;
  },
  setChildSettings(state, payload) {
    state.childSettings = payload;
  },
};

export const getters = {
  loadingStatus(state) {
    return state.loadingStatus;
  },
  getchildSettings(state) {
    return state.childSettings;
  },
};
