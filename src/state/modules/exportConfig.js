import exportService from "@/services/exportConfig";

const getDefaultState = () => {
  return {
    exportList: [],
  };
};

export const state = getDefaultState();

export const actions = {
  fetchExportList({ commit }) {
    commit("grid/setLoading", true, { root: true });
    commit("grid/setRecordsCount", null, { root: true });
    return new Promise((resolve, reject) => {
      exportService
        .getExportList()
        .then((data) => {
          resolve(data);
          commit("setExportList", data.data);
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
};

export const mutations = {
  setExportList(state, payload) {
    state.exportList = payload;
  },
};

export const getters = {
  getExportList(state) {
    return state.exportList;
  },
};
