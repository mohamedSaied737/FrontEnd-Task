import daemonService from "@/services/daemon";

const getDefaultState = () => {
  return {
    loading: false,
    appVersions: [],
    kioskInfo: [],
    requestLogs: []
  };
};

export const state = getDefaultState();

export const actions = {
  // push restart
  pushRestart({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .pushRestart(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // restart app
  restartApp({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .restartApp(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // update app
  updateApp({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .updateApp(params.macAddress, params.version)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // remote show screen
  remoteShowScreen({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .remoteShowScreen(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // kiosk logging
  kioskLogging({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .kioskLogging(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // force resync with logs
  forceResyncWithLogs({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .forceResyncWithLogs(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // pull database
  pullDatabase({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .pullDatabase(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // push restart
  openDoor({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .openDoor(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  // refresh face library
  refreshFaceLibrary({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .refreshFaceLibrary(macAddress)
        .then((data) => {
          resolve(data);
          this._vm.$toast.success(data.message ?? "Request was delivered successfully.");
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  },
  fetchAppVersions({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .fetchAppVersions()
        .then((data) => {
          resolve(data);
          commit("setAppVersions", data.data);
          commit("setLoading", false);
        })
        .catch(() => {
          commit("setLoading", false);
        });
    });
  },
  fetchRequestLogs({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .fetchRequestLogs()
        .then((data) => {
          resolve(data);
          commit("setRequestLogs", data.data);
          commit("setLoading", false);
        })
        .catch(() => {
          commit("setLoading", false);
        });
    });
  },
  fetchKioskRequestLogs({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .fetchKioskRequestLogs(macAddress)
        .then((data) => {
          resolve(data);
          commit("setRequestLogs", data.data);
          commit("setLoading", false);
        })
        .catch(() => {
          commit("setLoading", false);
        });
    });
  },
  fetchKioskInfo({ commit }, macAddress) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      daemonService
        .getKioskInfo(macAddress)
        .then((data) => {
          resolve(data);
          commit("setKioskInfo", data.data);
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          err.status != 401 && this._vm.$toast.error(err.data.error);
        });
    });
  }
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setAppVersions(state, payload) {
    state.appVersions = payload
  },
  setKioskInfo(state, payload) {
    state.kioskInfo = payload
  },
  setRequestLogs(state, payload) {
    state.requestLogs = payload
  }
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getAppVersions(state) {
    return state.appVersions
  },
  getKioskInfo(state) {
    return state.kioskInfo
  },
  getRequestLogs(state) {
    return state.requestLogs
  }
};
