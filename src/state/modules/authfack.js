import authService from "@/services/auth";
import router from "../../router/index";


const user = JSON.parse(localStorage.getItem("user"));
const status = user
  ? { status: { loggeduser: true }, user }
  : { status: {}, user: null };

const getDefaultState = () => {
  return {
    status,
    loadingStatus: false,
    userDetails: {},
    userEntities: {},
    currentEntity: {},
    availableEntity: null,
    domains: [
      "app.visipoint.uk",
      "app.visipoint.us",
      "app.visipoint.co",
      "app.visipoint.app",
      "apptest.visipoint.dev",
      "appqa.visipoint.dev",
    ],
    userPassword: null,
  };
};

export const state = getDefaultState();

export const actions = {
  // Logs in the user.
  // eslint-disable-next-line no-unused-vars
  login({ dispatch, commit, getters }, data) {
    commit("loadongStatus", true);
    return new Promise((resolve, reject) => {
      authService
        .login(data)
        .then((data) => {
          resolve(data);
          localStorage.setItem("user", JSON.stringify(data.data));
          commit("loginSuccess", data.data);
          commit("loadongStatus", false);
          dispatch("fetchuserDetails");
          if (getters.getEntityByDomain) {
            dispatch("setCurrentEntity", getters.getEntityByDomain);
            if (getters.getEntityByDomain.package == "Cloud") {
               router.push("/");
            } else if (getters.getEntityByDomain.package == "Standalone") {
               router.push("/sites");
            }
          }
        })
        .catch((err) => {
          reject(err);
          commit("loadongStatus", false);
          commit("loginFailure", err);
          commit("loadongStatus", false);
          this._vm.$toast.error(err.response.data.message);
        });
    });
  },
  // Logout the user
  logout({ commit }) {
    commit("loadongStatus", true);
    return new Promise((resolve, reject) => {
      authService
        .logout()
        .then((data) => {
          resolve(data);
          commit("logout");
          commit("loadongStatus", false);
          localStorage.clear();
          if (window.location.origin == process.env.VUE_APP_DOMAIN) {
            window.location.href = `${process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT}/login`;
          } else {
            window.location.href = `${window.location.origin}/login`;
          }
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(err.data.message);
          commit("loadongStatus", false);
        });
    });
  },
  // register user
  registeruser({ dispatch, commit }, user) {
    commit("loadongStatus", true);
    commit("loginRequest", user);
    return new Promise((resolve, reject) => {
      authService
        .registerUser(user)
        .then((data) => {
          resolve(data);
          commit("loadongStatus", false);
          dispatch("notification/success", "Registration successful", {
            root: true,
          });
          this._vm.$toast.success("Registration Successful");
          window.location.href = process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT;
        })
        .catch((err) => {
          reject(err);
          this._vm.$toast.error(
            Object.values(err.response.data.errors).join("\r\n")
          );
          commit("registerFailure", err);
          dispatch("notification/error", err.response.data.errors, {
            root: true,
          });
          commit("loadongStatus", false);
          commit("loginFailure", err);
        });
    });
  },
  // get entity by subdomain
  onEntityBySubdomain({ commit }, params) {
    return new Promise((resolve, reject) => {
      authService
        .entityBySubdomain(params)
        .then((data) => {
          commit("setEntityBySubdomain", data.data.data);
          if (
            !data.data.data &&
            window.location.href != "http://192.168.1.10:8080/login"
          ) {
            window.location.href = process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT;
          }
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
  // get passport auth
  onPassportAuth({ dispatch, commit }, params) {
    return new Promise((resolve, reject) => {
      authService
        .passportAuth(params)
        .then((data) => {
          localStorage.setItem("entityId", params.entity_id);
          localStorage.setItem(
            "user",
            JSON.stringify({ data: { access_token: data.data.data } })
          );
          commit("loginSuccess", data.data.data);
          dispatch("fetchuserDetails");
          commit("loadongStatus", false);
          commit("setPassportAuth", data.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // user details
  fetchuserDetails({ dispatch, commit },payload) {
    return new Promise((resolve, reject) => {
      authService.userDetails().then((data) => {
          resolve(data);
          localStorage.setItem("userDetails", JSON.stringify(data.data));
          commit("userDetails", data.data);
          payload?'':dispatch("entity/fetchEntities", data.data.user_id, { root: true });
        })
        .catch((err) => {
          reject(err)
          this._vm.$toast.error(err.response.data.message);
        });
    });
  },
  setCurrentEntity({ commit }, entity) {
    commit("currentEntity", entity);
  },
  clearStore({ dispatch }) {
    dispatch("grid/clearAllStoreState", null, { root: true });
  },
  saveKioskPackage({ commit }, payload) {
    commit("setKioskPackage", payload);
  },
  saveUserPassword({ commit }, payload) {
    commit("setUserPassword", payload);
  },
  // reset
  resetLoading({ commit }) {
    commit("loadongStatus", false);
    commit("entity/setSubdomain", null, { root: true });
  },
};

export const mutations = {
  resetAuthenticationState(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  },
  loadongStatus(state, loading) {
    state.loadingStatus = loading;
  },
  loginRequest(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },
  loginSuccess(state, user) {
    state.status = { loggeduser: true };
    state.user = user;
  },
  loginFailure(state) {
    state.status = {};
    state.user = null;
  },
  logout(state) {
    state.status = {};
    state.userEntities = {};
    state.userDetails = {};
    state.currentEntity = {};
    state.user = null;
  },
  // user details
  userDetails(state, user) {
    state.userDetails = user;
  },
  // user entities
  userEntities(state, entities) {
    state.userEntities = entities;
  },
  // current entity
  currentEntity(state, entity) {
    state.currentEntity = entity;
  },
  setKioskPackage(state, payload) {
    state.kioskPackage = payload;
  },
  setKioskData(state, payload) {
    state.kioskData = payload;
  },
  setEntityBySubdomain(state, payload) {
    state.availableEntity = payload;
  },
  setPassportAuth(state, payload) {
    state.status = { loggeduser: true };
    state.passport = payload;
  },
  setUserPassword(state, payload) {
    state.userPassword = payload;
  },
};

export const getters = {
  loadingStatus(state) {
    return state.loadingStatus;
  },
  userDetails(state) {
    return state.userDetails;
  },
  userEntities(state) {
    return state.userEntities;
  },
  currentEntity(state) {
    return state.currentEntity;
  },
  getKioskPackage(state) {
    return state.kioskPackage;
  },
  getKioskData(state) {
    return state.kioskData;
  },
  getEntityByDomain(state) {
    return state.availableEntity;
  },
  getPassportAuth(state) {
    return state.passport;
  },
  getUserPassword(state) {
    return state.userPassword;
  },
};
