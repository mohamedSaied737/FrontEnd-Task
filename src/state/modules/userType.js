import userTypeService from "@/services/userType";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    userTypeList: [],
    parentsList: [],
    allUsersTypes: [],
    pre_registration_user_types: [],
    loading: false,
    modalState: false,
  };
};

export const state = getDefaultState();

export const actions = {
  fetchUserTypeList({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      userTypeService
        .getUserTypesWithChildren(params)
        .then((data) => {
          resolve(data);
          commit("setUserTypeList", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
        });
    });
  },
  fetchAllUserType({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      userTypeService
        .getAllUsersTypes(params)
        .then((data) => {
          resolve(data);
          commit("setAllUsersTypes", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
        });
    });
  },
  fetchParentsList({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit("setLoading", true);
      userTypeService
        .getTypesParent()
        .then((data) => {
          resolve(data);
          commit("setParentsList", data.data);
          commit("setLoading", false);
          dispatch("grid/resetSelectedRows", null, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
        });
    });
  },
  createUserType({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      userTypeService
        .createUserType(payload)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Type Created");
          router.push("/user-types");
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  deleteUserType({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      userTypeService
        .deleteUserType(params)
        .then((data) => {
          resolve(data);
          data.data.length 
          &&
          data.data.map(item=>{
            item == 1 
            ? 
            this._vm.$toast.success("User type deleted")
            :
            this._vm.$toast.error("User type can not be deleted");
          })
          commit("setLoading", false);
          dispatch("fetchUserTypeList");
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
  updateUserType({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      userTypeService
        .updateUserType(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("User Type Updated");
          commit("setLoading", false);
          dispatch("fetchUserTypeList");
          commit("setModalState", true);
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setModalState", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  moveUserType({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      userTypeService
        .moveUserType(params)
        .then((data) => {
          resolve(data);
          data.data.length 
          &&
          data.data.map(item=>{
            item == 1 
            ? 
            this._vm.$toast.success("User type moved")
            :
            this._vm.$toast.error("User type can not be moved");
          })
          commit("setModalState", true);
          commit("setLoading", false);
          dispatch("fetchUserTypeList");
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setModalState", false);
          commit("modal/setModalState", false, { root: true });
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchRegistrationTypes({ commit }, id) {
    const pre_reg_url= process.env.VUE_APP_PRE_REGISTRATION_URL;
    return new Promise((resolve, reject) => {
      userTypeService
        .getRegistrationTypes(id)
        .then((data) => {
          resolve(data);
          commit("setPreRegistrationTypes", data.data.data);
        })
        .catch((err) => {
          reject(err);
          router.push({ path: '/404', hash: `#${pre_reg_url}` })
        });
    });
  },
  resetState({ commit }) {
    commit("setModalState", false);
    commit("setLoading", false);
  },
};

export const mutations = {
  resetUserTypesState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setUserTypeList(state, payload) {
    state.userTypeList = payload;
  },
  setParentsList(state, payload) {
    state.parentsList = payload;
  },
  setAllUsersTypes(state, payload) {
    state.allUsersTypes = payload;
  },
  setModalState(state, payload) {
    state.modalState = payload;
  },
  setPreRegistrationTypes(state, payload) {
    state.pre_registration_user_types = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getModalState(state) {
    return state.modalState;
  },
  getUserTypeList(state) {
    return state.userTypeList;
  },
  getParentsList(state) {
    return state.parentsList;
  },
  getAllUsersTypes(state) {
    return state.allUsersTypes;
  },
  getPreRegistrationTypes(state) {
    return state.pre_registration_user_types.user_types;
  },
};
