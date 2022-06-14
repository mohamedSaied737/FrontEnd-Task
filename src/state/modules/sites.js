import sitesService from "@/services/sites";
import router from "../../router/index";

const getDefaultState = () => {
  return {
    loading: false,
    sitesList: [],
    sitesWithAreas: [],
    actionState: false,
    siteAreas: [],
    areaCompliances: [],
    areaDocuments: [],
    areasFilter: [],
    isSignInOutMode: false,
    hasVisit: false,
    checkInMsg: "",
    stausForAre:null,
    isLoader: false,
  };
};

export const state = getDefaultState();

export const actions = {
  // fetch sites
  fetchSites({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      sitesService
        .getSites()
        .then((data) => {
          resolve(data);
          commit("setSites", data.data);
          commit("setCompliances", []);
          commit("setAreas", []);
          commit("modal/setModalState", false, { root: true });
          dispatch("grid/resetSelectedRows", null, { root: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // fetch sites with areas
  fetchSiteswithAreas({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      sitesService
        .getSitesWithAreas()
        .then((data) => {
          resolve(data);
          commit("setSitesWithAreas", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("setAreas", []);
          dispatch("grid/resetSelectedRows", null, { root: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // create site
  createSite({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      sitesService
        .createSite(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Site Added");
          commit("setLoading", false);
          dispatch("fetchSiteswithAreas");
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          this._vm.$toast.error(Object.values(err.data.errors).join("\r\n"));
          commit("modal/setModalState", false, { root: true });
        });
    });
  },
  // update site
  updateSite({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      sitesService
        .updateSite(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Site Updated");
          commit("setLoading", false);
          dispatch("fetchSiteswithAreas");
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
  // delete site
  deleteSite({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      sitesService
        .deleteSite(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Site Deleted");
          dispatch("fetchSiteswithAreas");
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // create area
  createArea({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      sitesService
        .createArea(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Area Added");
          commit("setLoading", false);
          dispatch("fetchAreasFilter", {
            id: router.history.current.params.id,
          });
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
  // update area
  updateArea({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      sitesService
        .updateArea(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Area Updated");
          commit("setLoading", false);
          dispatch("fetchAreasFilter", {
            id: router.history.current.params.id,
          });
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
  capitalize(s) {
    (s && s[0].toUpperCase() + s.slice(1)) || "";
  },
  // move area
  moveArea({ commit, dispatch }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      sitesService
        .moveArea(params)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Area Moved");
          commit("setLoading", false);
          dispatch("fetchAreasFilter", {
            id: router.history.current.params.id,
          });
          commit("modal/setModalState", true, { root: true });
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          err.data.message && err.data.message.length == 0
            ? this._vm.$toast.error(err.data.message)
            : this._vm.$toast.error(
                err.data.data.charAt(0).toUpperCase() + err.data.data.slice(1)
              );
          commit("modal/setModalState", false, { root: true });
        });
    });
  },
  // delete area
  deleteArea({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      sitesService
        .deleteArea(id)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success("Area Deleted");
          dispatch("fetchAreasFilter", {
            id: router.history.current.params.id,
          });
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // areas by site {{that has kiosks}}
  fetchAreasHaskiosks({ commit }, id) {
    return new Promise((resolve, reject) => {
      sitesService
        .getAreasHaskiosk(id)
        .then((data) => {
          resolve(data);
          commit("setAreas", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchAreasFilter({ commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      sitesService
        .getAreasFilter(id)
        .then((data) => {
          resolve(data);
          commit("setAreasFilter", data.data);
          commit("modal/setModalState", false, { root: true });
          commit("setAreas", []);
          dispatch("grid/resetSelectedRows", null, { root: true });
          // dispatch("checkAreasMode", id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  checkAreasMode({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sitesService
        .checkAreasMode(payload)
        .then((data) => {
          resolve(data);
          commit("setAreasMode", data.data);
        })
        .catch((err) => {
          reject(err);
          // err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // areas by site
  fetchAreasBySite({ commit }, id) {
    return new Promise((resolve, reject) => {
      sitesService
        .getAreasBysites(id)
        .then((data) => {
          resolve(data);
          commit("setAreas", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  // compliance or area
  fetchAreaCompliances({ commit }, params) {
    return new Promise((resolve, reject) => {
      sitesService
        .getSpecficCompliances(params)
        .then((data) => {
          resolve(data);
          commit("setCompliances", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchAreaDocument({ commit }, params) {
    return new Promise((resolve, reject) => {
      sitesService
        .getAreaDocument(params)
        .then((data) => {
          resolve(data);
          commit("setDocuments", data.data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  fetchStatusForArea({ commit }, params) {
    commit("setLoader", true);
    return new Promise((resolve, reject) => {
      sitesService
        .getStatusForArea(params)
        .then((data) => {
          resolve(data);
          commit("setStausForAre", data.data);
          commit("setLoader", false);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  updateActionState({ commit }, payload) {
    commit("actionState", payload);
  },

  checkSignInOutMode({ commit }, payload) {
    commit("setIsSignInOutMode", false);
    return new Promise((resolve, reject) => {
      sitesService
        .checkSignInOutMode(payload)
        .then((data) => {
          resolve(data);
          commit("setIsSignInOutMode", data.data == true);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },

  fetchAreasBySiteWithoutSignOut({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sitesService
        .fetchAreasBySiteWithoutSignOut(payload)
        .then((data) => {
          resolve(data);
          commit("setAreas", data.data);
          // console.log('checkAreasBySite', data);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },

  checkUserHasVisitInArea({ commit }, payload) {
    commit("setHasVisit", false);
    commit("setCheckInMsg", "");
    return new Promise((resolve, reject) => {
      sitesService
        .checkUserHasVisitInArea(payload)
        .then((data) => {
          resolve(data);
          console.log('data', data);
          commit("setHasVisit", data.data.is_has);
          commit("setCheckInMsg", data.data.message);
        })
        .catch((err) => {
          reject(err);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  }
};


export const mutations = {
  resetSitesState (state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setSites(state, payload) {
    state.sitesList = payload;
  },
  setSitesWithAreas(state, payload) {
    state.sitesWithAreas = payload;
  },
  setAreas(state, payload) {
    state.siteAreas = payload;
  },
  setAreasFilter(state, payload) {
    state.areasFilter = payload;
  },
  setAreasMode(state, payload) {
    state.areasMode = payload;
  },
  setCompliances(state, payload) {
    state.areaCompliances = payload;
  },
  setDocuments(state, payload) {
    state.areaDocuments = payload;
  },
  setStausForAre(state, payload) {
    state.stausForAre = payload;
  },
  actionState(state, update) {
    state.actionState = update;
  },
  setIsSignInOutMode(state, payload) {
    state.isSignInOutMode = payload;
  },

  setHasVisit(state, payload) {
    state.hasVisit = payload;
  },
  setCheckInMsg(state, payload) {
    state.checkInMsg = payload;
  },

  setLoader(state, payload) {
    state.isLoader = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getSites(state) {
    return state.sitesList;
  },
  getSitesWithAreas(state) {
    return state.sitesWithAreas;
  },
  getAreas(state) {
    return state.siteAreas;
  },
  getAreasFilter(state) {
    return state.areasFilter;
  },
  getAreasMode(state) {
    return state.areasMode;
  },
  getCompliances(state) {
    return state.areaCompliances;
  },
  getAreaDocuments(state) {
    return state.areaDocuments;
  },
  getStatusForArea(state) {
    return state.stausForAre;
  },
  actionState(state) {
    return state.actionState;
  },
  getIsSignInOutMode(state) {
    return state.isSignInOutMode;
  },
  getHasVisit(state) {
    return state.hasVisit;
  },
  getCheckInMsg(state) {
    return state.checkInMsg;
  },
  getLoader(state) {
    return state.isLoader;
  },
};
