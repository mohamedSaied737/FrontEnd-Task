import privacyManager from "@/services/privacyManager";
export const state = {
  loading: false,
  cron:null,
  isValidPassword:false,
};

export const actions = {
  editUserType({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      privacyManager
        .editUserType(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Data & Scans Updated");
          dispatch("entity/fetchEntities", data.data.owner_id, { root: true });
          dispatch("userType/fetchUserTypeList", null, { root: true });
          dispatch("getLastCronExecution");
          commit("modal/setModalState", true, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  deleteNowUserType({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      privacyManager
        .deleteNowUserType(params)
        .then((data) => {
          resolve(data);
          params.params.type == 'data'
            ?
            this._vm.$toast.success(`${params.params.name ? params.params.name : 'UserType'} Data Deleted`)
            :
            params.params.type == 'scan'
              ?
              this._vm.$toast.success(`${params.params.name ? params.params.name : 'UserType'} Scans Deleted`)
              :
              this._vm.$toast.success(`${params.params.name ? params.params.name : 'UserType'} Data & Scans Deleted`)
          dispatch("userType/fetchUserTypeList", null, { root: true });
          dispatch("getLastCronExecution");
          commit("modal/setModalState", true, { root: true });
          setTimeout(() => { commit("setLoading", false); }, 500);
        })
        .catch((err) => {
          commit("setLoading", true);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  togglePrivacyManager({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      privacyManager
        .togglePrivacyManager(params)
        .then((data) => {
          resolve(data);
          dispatch("entity/fetchEntities", data.data.owner_id, { root: true });
          dispatch("userType/fetchUserTypeList", null, { root: true });
          dispatch("getLastCronExecution");
          commit("modal/setModalState", true, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", true);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  resetValues({ commit }) {
    commit("setLoading", false);
    commit("setIsValidPassword", false);
  },
  getLastCronExecution({ commit }) {
    return new Promise((resolve, reject) => {
      privacyManager
        .getLastCronExecution()
        .then((data) => {
          commit("setCron", data.data);
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
  checkUserPassword({ commit }, params) {
    return new Promise((reject) => {
      privacyManager
        .checkUserPassword(params)
        .then((data) => {
          const value = JSON.parse(data.data.password.toLowerCase())
          commit("setIsValidPassword",  value);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setCron(state, payload) {
    state.cron = payload;
  },
  setIsValidPassword(state, payload) {
    state.isValidPassword = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getCron(state) {
    return state.cron;
  },
  getIsValidPassword(state) {
    return state.isValidPassword;
  },
};
