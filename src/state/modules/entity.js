import entityService from "@/services/entity";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    subdomain: null,
    isValidSubdomian: false,
    loading: false,
    entities: [],
  };
};

export const state = getDefaultState();

export const actions = {
  // check subdomain
  checkDomain({ commit }, params) {
    return new Promise((reject) => {
      entityService
        .checkSubdomain(params)
        .then((data) => {
          commit("setSubdomain", data.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  checkEntitySubdomain({ commit }, params) {
    return new Promise((reject) => {
      entityService
        .checkEntitySubdomain(params)
        .then((data) => {
          commit("setIsValidSubdomian", data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchEntities({ commit, dispatch }, id) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      entityService
        .getEntities(id)
        .then((data) => {
          resolve(data);
          localStorage.setItem("userEntities", JSON.stringify(data.data));
          if (localStorage.getItem("entityId")) {
            data.data.map((entity) => {
              if (entity.id == localStorage.getItem("entityId")) {
                dispatch("authfack/setCurrentEntity", entity, { root: true });
                if (entity.package == "Cloud") {
                  router.push("/");
                } else if (entity.package == "Standalone") {
                  router.push("/sites");
                }
              }
            });
          }
          commit("setEntities", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchCurrentEntities({ commit }, id) {
    commit("grid/setLoading", true, { root: true });
    return new Promise((resolve, reject) => {
      entityService
        .getEntities(id)
        .then((data) => {
          resolve(data);
          localStorage.setItem("userEntities", JSON.stringify(data.data));
          commit("setEntities", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("grid/setLoading", false, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("grid/setLoading", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  createEntity({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      entityService
        .createEntity(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Company Created, Please Check your Email.");
          commit("modal/setModalState", true, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
          commit("modal/setModalState", false, { root: true });
        });
    });
  },
  updateEntity({ commit, dispatch, rootState }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      entityService
        .updateEntity(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message);
          dispatch("fetchCurrentEntities", rootState.authfack.userDetails.id);
          commit("modal/setModalState", true, { root: true });
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
};

export const mutations = {
  resetEntityState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  },
  setSubdomain(state, payload) {
    state.subdomain = payload;
  },
  setIsValidSubdomian(state, payload) {
    state.isValidSubdomian = payload;
  },
  setEntities(state, payload) {
    state.entities = payload;
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
};

export const getters = {
  getSubdomain(state) {
    return state.subdomain;
  },
  getIsValidSubdomian(state) {
    return state.isValidSubdomian;
  },
  getLoading(state) {
    return state.loading;
  },
  getEntities(state) {
    return state.entities;
  },
};
