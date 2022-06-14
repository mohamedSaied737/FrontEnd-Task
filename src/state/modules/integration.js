/* eslint-disable no-unused-vars */
import integrationService from "@/services/integration";
import store from "@/state/store";

import router from "../../router/index";

export const state = {
  directoryList: [],
  gridIntegrationData: [],
  createIntegration: {},
  intgData: {},
  responseErrors: [],
  errMsg: "",
  loading: false,
  directoryConfigData: {},
  createdIntgId: null,
  syncLoading: false,
  syncTextMessage: "",
  syncStatus: "processing",
  syncTextFullMessage: '',
  migrateTextMessage: "",
  migrateStatus: "idle",
  migrateTextFullMessage: '',
  syncedUsers: [],
  syncedUsersCount: null,
  validUsers: [],
  validUsersCount: null,
  usersWithErrs: [],
  usersWithErrsCount: null,
  usersWithDuplicates: [],
  usersWithDuplicatesCount: null,
  modalState: false,
  isEditMode: false,
  isFromView: false,
  isReAuth: false,
  syncId: '',
  syncLogs: []
};

export const actions = {
  fetchDirectoryList({ commit, dispatch }) {
    // dispatch("resetIntgData");
    commit("setResponseErrors", []);
    return new Promise((resolve, reject) => {
      integrationService
        .getAllDirectories()
        .then((data) => {
          resolve(data);
          commit("setDirectoryList", data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fetchGridIntegrationData({ commit, dispatch }) {
    // dispatch("resetIntgData");
    return new Promise((resolve, reject) => {
      integrationService
        .getGridInetgrationsData()
        .then((data) => {
          resolve(data);
          commit("setGridData", data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getIntegration({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getIntegration(payload.id)
        .then((data) => {
          console.log('ddd', data);
          resolve(data);
          commit("setIntegId", payload.id);
          commit("setIntgData", data);
          if (payload.fromAllTable) {
            dispatch("createIntegration", {
              obj: {
                tenant_id: data.configs[0].value,
                client_id: data.configs[1].value,
                client_secret: data.configs[2].value
              },
              directory_type: data.dir_code,
              fromStore: true,
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async awaitIntegrationWithMapping({ dispatch }, payload) {
    await dispatch("getIntegrationWithMapping", payload);
  },

  async getIntegrationWithMapping({ commit, dispatch }, payload) {
    await dispatch("resetIntgData");
    return new Promise((resolve, reject) => {
      integrationService
        .getIntegrationWithMapping(payload.id)
        .then((data) => {
          console.log('ddd', data);
          resolve(data);
          commit("setIntegId", payload.id);
          commit("setIntgDataMapping", data);
          commit("setIntgStatus", data.status);
          // dispatch("fetchTempUsersWithDuplicates", payload.id);
          // dispatch("fetchTempUsersWithErrors", payload.id);
          // dispatch("fetchValidTempUsers", payload.id);
          dispatch("getIntegrationStat", payload.id);
          if (payload.redirect) router.push("/view-integration/" + payload.id + "/" + data.name);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getIntegrationStat({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getIntegrationStat(payload)
        .then((data) => {
          resolve(data);
          console.log('stat', data);
          // commit("setIntgStatus", data.dir_int_status);

          commit("setUsersWithErrsCount", data.errors);
          commit("setSyncedUsersCount", data.imported);
          commit("setUsersWithDuplicatesCount", data.duplicates);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getIntegrationStatus({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getIntegrationStatus(payload)
        .then((data) => {
          resolve(data);
          commit("setIntgStatus", data.dir_int_status);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  changeIntegrationStatus({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .changeIntegrationStatus(payload.integId, payload.status)
        .then((data) => {
          resolve(data);
          commit("setIntgStatus", payload.status);
          commit("setLoading", false);
          // dispatch("resetIntgData", payload);
          // dispatch("fetchTempUsersWithErrors", payload);
          // dispatch("fetchValidTempUsers", payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  setReAuth({ commit }, payload) {
    commit("setReAuth", payload);
    commit("setLoading", false);
  },

  async resetIntgData({ commit }) {
    console.log('resetIntgData');
    await commit("setUsersWithErrs", null);
    await commit("setUsersWithErrsCount", null);
    await commit("setUsersWithDuplicates", null);
    await commit("setUsersWithDuplicatesCount", null);
    await commit("setValidUsers", null);
    await commit("setValidUsersCount", null);
  },

  createIntegration({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      commit("setResponseErrors", []);
      integrationService
        .createIntegration(payload)
        .then((data) => {
          resolve(data);
          if (!payload.fromStore) {
            commit("setIntegId", null);
            commit("setIntgData", {});
            commit("setIsEdit", false);
            this._vm.$toast.success("Authentication Success");
          }
          commit("setLoading", false);
          commit("setcreatedIntegration", data);
          router.push("/integration-settings");
        })
        .catch((err) => {
          commit("setLoading", false);
          reject(err);
          commit("setResponseErrors", err.data.error);
        });
    });
  },

  reAuthIntegration({ commit, dispatch }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      commit("setResponseErrors", []);
      integrationService
        .reAuthIntegration(payload)
        .then((data) => {
          // commit("setIntegId", null);
          // commit("setIntgData", {});
          commit("setLoading", false);
          resolve(data);
          console.log('reauth', data);
          dispatch("getIntegrationStatus", payload.integId);
          this._vm.$toast.success("Re-authenticated Successfully.");
          this.$bvModal.hide("addIntegration");
          // setTimeout(() => {
          commit("setModalState", true);
          // }, 2000);
          // commit("setcreatedIntegration", data);
          // router.push("/integration-settings");
        })
        .catch((err) => {
          commit("setLoading", false);
          reject(err);
          // commit("setResponseErrors", err.data.error);
        });
    });
  },

  createConfigData({ commit }, payload) {
    commit("setConfigData", payload);
  },

  manageIntegrationSettings({ commit, dispatch }, payload) {
    commit("setLoading", true);
    commit("setErrMsg", "");
    return new Promise((resolve, reject) => {
      integrationService
        .manageIntegrationSettings(payload)
        .then((data) => {

          resolve(data);
          // this._vm.$toast.success("integration settings Created");

          commit("setIntegId", data.int_id);
          router.push("/sync-status");
          dispatch("startFirstSync", data.int_id);
          dispatch("getIntegration", { id: data.int_id });
          commit("setSyncStatusText", "Integration Settings Saved");
          commit("setSyncStatusmsg", "Preparing Data");
          commit("setSyncStatusStage", "processing");
        })
        .catch((err) => {
          commit("setLoading", false);
          reject(err);
          const errMsg = err.data.errors.map(x => Object.values(x).join("\r\n")).join('\r\n');
          console.log('err', err);
          // this._vm.$toast.error(errMsg);
          commit("setErrMsg", errMsg);
        });
    });
  },

  editIntegrationSettings({ commit, dispatch }, payload) {
    commit("setLoading", true);
    commit("setErrMsg", "");
    console.log('editintgsett', payload);
    return new Promise((resolve, reject) => {
      integrationService
        .editIntegrationSettings(payload.data)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setIntegId", data.int_id);
          dispatch("getIntegration", { id: data.int_id });
          if (payload.data.is_mapping_change) {
            if (!payload.isEdit) {
              // import again
              console.log('import again');
              router.push("/sync-status");
              dispatch("startFirstSync", data.int_id);
              commit("setSyncStatusText", "Integration Settings Saved");
              commit("setSyncStatusmsg", "Preparing Data");
              commit("setSyncStatusStage", "processing");
            }
          } else {
            if (!payload.isEdit) {
              // redirect to errors, duplicates, valid users
              dispatch("redirectType", data.int_id);
            }
          }
        })
        .catch((err) => {
          commit("setLoading", false);
          reject(err);
          const errMsg = err.data.errors.map(x => Object.values(x).join("\r\n")).join('\r\n');
          console.log('err', err, errMsg);
          // this._vm.$toast.error(errMsg);
          commit("setErrMsg", errMsg);
        });
    });
  },

  updateIntegrationSettingsAndSync({ commit, dispatch }, payload) {
    commit("setLoading", true);
    commit("setErrMsg", "");
    return new Promise((resolve, reject) => {
      integrationService
        .updateIntegrationSettingsAndSync(payload.data)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setIntegId", data.int_id);
          dispatch("getIntegration", { id: data.int_id });
          dispatch("fetchUsersJobStatus", { saveAndSync: true, id: payload.data.id, name: payload.data.name });
          // router.push("/view-integration/" + payload.data.id + "/" + payload.data.name);
          // router.push("/sync-status");
          // commit("setSyncStatusText", "Integration Settings Saved");
          // commit("setSyncStatusmsg", "Preparing Data");
          // commit("setSyncStatusStage", "processing");
          // }
          // } else {
          // if (!payload.isEdit) {
          // redirect to view page
          // dispatch("getIntegrationWithMapping", { id: , redirect: true });
          // }
          // }


        })
        .catch((err) => {
          commit("setLoading", false);
          reject(err);
          const errMsg = err.data.errors.map(x => Object.values(x).join("\r\n")).join('\r\n');
          console.log('err', err);
          // this._vm.$toast.error(errMsg);
          commit("setErrMsg", errMsg);
        });
    });
  },

  startFirstSync({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getFirstSync(payload)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          dispatch("fetchUsersJobStatus", { id: payload });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  startAutoSync({ commit, dispatch }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .getAutoSync(payload.id)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          console.log('auto', payload);
          setTimeout(() => {
            router.push("/sync-status");
            dispatch("fetchUsersJobStatus", {
              id: payload.id,
              saveAndSync: true, name: payload.name
            });
          }, 2000);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fetchUsersJobStatus({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getSyncUSerStatus(payload.id)
        .then((data) => {
          resolve(data);
          console.log('fetchUsersJobStatus', data);
          const id = data.sync_status.id;
          commit("setSyncId", id);
          if (payload.continue && id != 3) {
            console.log('continue first sync');
            router.push("/sync-status");
            dispatch("startFirstSync", payload.id);
          }
          //first sync statuss 
          // '0'=>'Idle',
          if (id == 0) {
            setTimeout(() => {
              dispatch("fetchUsersJobStatus", payload);
            }, 5000);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", data.message);
            commit("setSyncStatusStage", "processing");
          } else if (id == 1) {
            //   '1'=>'Importing',
            setTimeout(() => {
              dispatch("fetchUsersJobStatus", payload);
            }, 5000);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", data.message);
            commit("setSyncStatusStage", "processing");
          } else if (id == 2) {
            // '2'=>'Validating',
            setTimeout(() => {
              dispatch("fetchUsersJobStatus", payload);
            }, 5000);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", data.message);
            commit("setSyncStatusStage", "processing");
          } else if (id == 3) {
            // '3'=>'Done',
            commit("setLoadingSync", false);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", data.message);
            commit("setSyncStatusStage", "done");
            // dispatch("fetchValidTempUsers", payload);

            console.log('doneee', payload);
            // redirect API
            if (!payload.saveAndSync) dispatch("redirectType", payload.id);
            else {
              console.log('redirecttoview');
              router.push("/view-integration/" + payload.id + "/" + payload.name);
            }

          } else if (id == 4) {
            // '4'=>'Importing Faild',
            commit("setLoadingSync", false);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", 'Retry');
            commit("setSyncStatusStage", "failed");
          } else if (id == 9) {
            // '7'=>'Authentication Failed'
            dispatch("getIntegration", { id: payload.id });
            commit("setLoadingSync", false);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", 'Back');
            commit("setSyncStatusStage", "auth-failed");
            // router.push("/view-integration/" + payload.id + "/" + payload.name);
          } else {
            // '7'=>'Failed'
            commit("setLoadingSync", false);
            commit("setSyncStatusText", data.sync_status.text);
            commit("setSyncStatusmsg", 'Retry');
            commit("setSyncStatusStage", "failed");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fetchSyncedUsers({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .getAllSyncedUsers(payload)
        .then((data) => {
          resolve(data);
          // commit("setSyncStatusStage", 'done');
          commit("setSyncedUsers", data);
          commit("setSyncedUsersCount", data.length);
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fetchValidTempUsers({ commit }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .getValidTempUsers(payload)
        .then((data) => {
          resolve(data);
          console.log('valid users', data);
          // commit("setSyncStatusStage", 'done');
          commit("setValidUsers", data.users);
          commit("setValidUsersCount", data.total_users);
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  redirectType({ commit, dispatch }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService.getRedirectType(payload).then((data) => {
        resolve(data);
        console.log('redirect', data);
        router.push("/integration-" + data);
        // if (data == "error") dispatch("fetchTempUsersWithErrors", payload);
        // else if (data == "duplicate") dispatch("fetchTempUsersWithDuplicates", payload);
        // else if (data == "valid") dispatch("fetchValidTempUsers", payload);
        commit("setFromView", false);
        commit("setLoading", false);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },

  redirectToIntegrationSettings({ commit }) {
    commit("setUsersWithErrs", null);
    commit("setUsersWithErrsCount", null);
    commit("setUsersWithDuplicates", null);
    commit("setUsersWithDuplicatesCount", null);
    // setTimeout(() => {
    router.push("/integration-settings");
    // }, 200);
  },

  async editIntegration({ commit, dispatch }, payload) {
    commit("setIntegId", payload);
    commit("setIsEdit", true);
    await dispatch("getIntegration", { id: payload, fromAllTable: true });
    await dispatch("fetchTempUsersWithDuplicates", payload);
    await dispatch("fetchTempUsersWithErrors", payload);
    // dispatch("redirectToIntegrationSettings");
  },

  fetchTempUsersWithErrors({ commit }, payload) {
    commit("setUsersWithErrs", null);
    commit("setUsersWithErrsCount", null);
    commit("setLoading", true);
    // commit("setModalState", true);
    return new Promise((resolve, reject) => {
      integrationService.getTempUsersWithErrors(payload).then((data) => {
        resolve(data);
        console.log('fetchTempUsersWithErrors', data);
        // if (data && data.users && data.users.length > 0) router.push("/imported-with-errors");
        // commit("setSyncStatusStage", 'done');
        commit("setLoading", false);
        commit("setUsersWithErrsCount", data.total_users);
        commit("setUsersWithErrs", data.users);

        // setTimeout(() => {
        //   console.log('set new count');
        //   commit("setUsersWithErrsCount", 10);
        // }, 5000);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fixTempUsersWithErrors({ commit, dispatch }, payload) {
    dispatch("resetIntgData");
    commit("setLoading", true);
    commit("setModalState", false);
    return new Promise((resolve, reject) => {
      console.log('fixTempUsersWithErrors', payload);
      integrationService.fixTempUsersWithErrors(payload).then((data) => {
        resolve(data);
        dispatch("fetchTempUsersWithErrors", payload.user.dir_int_id);
        if (store.getters["integration/getFromView"]) {
          dispatch("updateSyncedUsers", payload.user.dir_int_id);
        }
        // setTimeout(() => {
        // console.log('setloding');
        this._vm.$toast.success("User Updated");
        commit("setLoading", false);
        commit("setModalState", true);
        console.log('setModalState');
        // commit("setFormErrors", []);
        // }, 5000);

      })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fetchTempUsersWithDuplicates({ commit }, payload) {
    commit("setUsersWithDuplicates", null);
    commit("setUsersWithDuplicatesCount", null);
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService.getTempUsersWithDuplicates(payload).then((data) => {
        resolve(data);
        console.log('WithDuplicates', data);
        commit("setUsersWithDuplicatesCount", data.length);
        commit("setUsersWithDuplicates", data);
        commit("setLoading", false);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },

  fixTempUsersWithDuplicates({ commit, dispatch }, payload) {
    commit("setModalState", false);
    if (!payload.selected_user_id) {
      this._vm.$toast.error('Please select a user');
      return;
    }
    // commit("setLoading", true);
    return new Promise((resolve, reject) => {
      console.log('payload', payload);
      integrationService.fixTempUsersWithDuplicates(payload).then((data) => {
        resolve(data);
        dispatch("fetchTempUsersWithDuplicates", payload.dir_int_id);
        if (store.getters["integration/getFromView"]) {
          dispatch("updateSyncedUsers", payload.dir_int_id);
        }

        // setTimeout(() => {
        // console.log('setloding');
        this._vm.$toast.success("Duplicate Fixed.");
        // commit("setLoading", false);
        commit("setModalState", true);
        // commit("setFormDuplicates", []);
        // }, 5000);

      })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteIntegration({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .deleteIntegration(payload)
        .then((data) => {
          resolve(data);
          // commit("setIntegId", null);
          dispatch("fetchGridIntegrationData");
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  StartSyncUsers({ commit, dispatch }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .getFirstMigration(payload.id)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          router.push("/sync-status");
          dispatch("fetchSyncUsersJobStatus", payload.id);
          commit("setMigrateStatusStage", "processing");
          commit("setSyncStatusStage", "finished");
          console.log('isfailed', payload.isFailed);
          // if (payload.isFailed) dispatch("redirectType", payload.id);
          // else dispatch("getIntegrationWithMapping", payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateSyncedUsers({ commit, dispatch }, payload) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      integrationService
        .getFirstMigration(payload)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  retrySync({ commit, dispatch }, payload) {
    // commit("setLoading", true);
    console.log('syncidvv', payload);
    if (payload.syncId == 4 || payload.syncId == 5 || payload.syncId == 8) {
      return new Promise((resolve, reject) => {
        integrationService
          .getFirstSync(payload.id)
          .then((data) => {
            resolve(data);
            commit("setLoading", false);
            dispatch("fetchUsersJobStatus", { id: payload });
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else if (payload.syncId == 7) {
      return new Promise((resolve, reject) => {
        integrationService
          .getFirstMigration(payload.id)
          .then((data) => {
            resolve(data);
            commit("setLoading", false);
            // router.push("/sync-status");
            dispatch("fetchSyncUsersJobStatus", payload.id);
            commit("setMigrateStatusStage", "processing");
            commit("setSyncStatusStage", "finished");
            console.log('isfailed', payload.isFailed);
            // if (payload.isFailed) dispatch("redirectType", payload.id);
            // else dispatch("getIntegrationWithMapping", payload);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  },

  fetchSyncUsersJobStatus({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getSyncUSerStatus(payload)
        .then((data) => {
          resolve(data);
          const id = data.sync_status.id;
          commit("setSyncId", id);
          console.log('hello', id, id == 3);

          //first sync statuss 
          // '0'=>'Idol',
          if (id == 0) {
            console.log('hidddi');
            setTimeout(() => {
              dispatch("fetchSyncUsersJobStatus", payload);
            }, 1000);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "processing");
          } else if (id == 1) {
            //   '1'=>'Importing',
            setTimeout(() => {
              dispatch("fetchSyncUsersJobStatus", payload);
            }, 1000);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "processing");
          } else if (id == 2) {
            // '2'=>'Validating',
            setTimeout(() => {
              dispatch("fetchSyncUsersJobStatus", payload);
            }, 1000);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "processing");
          } else if (id == 3) {
            console.log('3 state', store.getters["integration/getIntgData"]);
            // '3'=>'Done',
            commit("setLoadingSync", false);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "done");
            router.push("/view-integration/" + payload + "/" + store.getters["integration/getIntgData"].name);
          } else if (id == 4) {
            // '4'=>'Importing Faild',
            commit("setLoadingSync", false);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "failed");
          } else if (id == 5) {
            // '5'=>'Failed'
            commit("setLoadingSync", false);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "failed");
          }
          else if (id == 6) {
            // '6'=>'Syncing',
            setTimeout(() => {
              dispatch("fetchSyncUsersJobStatus", payload);
            }, 3000);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "processing");
          } else {
            // '7'=>'Failed'
            commit("setLoadingSync", false);
            commit("setMigrateStatusText", data.sync_status.text);
            commit("setMigrateStatusmsg", data.message);
            commit("setMigrateStatusStage", "failed");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getSyncLogsList({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      integrationService
        .getSyncLogsList(payload)
        .then((data) => {
          resolve(data);
          commit("setSyncLogs", data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  setFromView({ commit }, payload) {
    commit("setLoading", false);
    console.log('setfromview', payload);
    commit("setFromView", payload);
  },
};

export const mutations = {
  setErrMsg(state, payload) {
    state.errMsg = payload;
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setDirectoryList(state, payload) {
    state.directoryList = payload;
  },
  setGridData(state, payload) {
    state.gridIntegrationData = payload;
  },
  setcreatedIntegration(state, payload) {
    state.createIntegration = payload;
  },
  setIntgData(state, payload) {
    state.intgData = payload;
  },
  setIntgDataMapping(state, payload) {
    state.intgDataMapping = payload;
  },
  setIntgStatus(state, payload) {
    state.intgStatus = payload;
  },
  setResponseErrors(state, payload) {
    state.responseErrors = payload;
  },
  setConfigData(state, payload) {
    state.directoryConfigData = payload;
  },
  setIntegId(state, payload) {
    state.createdIntgId = payload;
  },
  setLoadingSync(state, payload) {
    state.syncLoading = payload;
  },
  setSyncStatusText(state, payload) {
    state.syncTextMessage = payload;
  },
  setSyncStatusmsg(state, payload) {
    state.syncTextFullMessage = payload;
  },
  setSyncStatusStage(state, payload) {
    state.syncStatus = payload;
  },
  setSyncedUsers(state, payload) {
    state.syncedUsers = payload;
  },
  setValidUsers(state, payload) {
    state.validUsers = payload;
  },
  setSyncedUsersCount(state, payload) {
    state.syncedUsersCount = payload;
  },
  setValidUsersCount(state, payload) {
    state.validUsersCount = payload;
  },
  setUsersWithErrs(state, payload) {
    state.usersWithErrs = payload;
  },
  setUsersWithErrsCount(state, payload) {
    state.usersWithErrsCount = payload;
  },
  setUsersWithDuplicates(state, payload) {
    state.usersWithDuplicates = payload;
  },
  setUsersWithDuplicatesCount(state, payload) {
    state.usersWithDuplicatesCount = payload;
  },
  setMigrateStatusText(state, payload) {
    state.migrateTextMessage = payload;
  },
  setMigrateStatusmsg(state, payload) {
    state.migrateTextFullMessage = payload;
  },
  setMigrateStatusStage(state, payload) {
    state.migrateStatus = payload;
  },

  setModalState(state, payload) {
    state.modalState = payload;
  },

  setReAuth(state, payload) {
    state.isReAuth = payload;
  },

  setSyncLogs(state, payload) {
    state.syncLogs = payload;
  },

  setFromView(state, payload) {
    state.isFromView = payload;
  },

  setSyncId(state, payload) {
    state.syncId = payload;
  },

  setIsEdit(state, payload) {
    state.isEditMode = payload;
  },
};

export const getters = {
  getErrMsg(state) {
    return state.errMsg;
  },
  getLoading(state) {
    return state.loading;
  },
  getDirectoryList(state) {
    return state.directoryList;
  },
  getGridIntegrationData(state) {
    return state.gridIntegrationData;
  },
  getCreatedIntegration(state) {
    return state.createIntegration;
  },
  getIntgData(state) {
    return state.intgData;
  },
  getIntgDataMapping(state) {
    return state.intgDataMapping;
  },
  getIntgStatus(state) {
    return state.intgStatus;
  },
  getResponseErrors(state) {
    return state.responseErrors;
  },
  getConfigData(state) {
    return state.directoryConfigData;
  },
  getIntegId(state) {
    return state.createdIntgId;
  },
  getLoadingSync(state) {
    return state.syncLoading;
  },
  getSyncStatusText(state) {
    return state.syncTextMessage;
  },
  getSyncStatusmsg(state) {
    return state.syncTextFullMessage
  },
  getSyncStatusStage(state) {
    return state.syncStatus;
  },
  getSyncedUsers(state) {
    return state.syncedUsers;
  },
  getSyncedUsersCount(state) {
    return state.syncedUsersCount;
  },
  getValidUsers(state) {
    return state.validUsers;
  },
  getValidUsersCount(state) {
    return state.validUsersCount;
  },
  getUsersWithErrs(state) {
    return state.usersWithErrs;
  },
  getUsersWithErrsCount(state) {
    return state.usersWithErrsCount;
  },
  getUsersWithDuplicates(state) {
    return state.usersWithDuplicates;
  },
  getUsersWithDuplicatesCount(state) {
    return state.usersWithDuplicatesCount;
  },
  getMigrateStatusText(state) {
    return state.migrateTextMessage;
  },
  getMigrateStatusmsg(state) {
    return state.migrateTextFullMessage;
  },
  getMigrateStatusStage(state) {
    return state.migrateStatus;
  },

  getModalState(state) {
    return state.modalState;
  },

  getReAuth(state) {
    return state.isReAuth;
  },

  getSyncLogs(state) {
    return state.syncLogs;
  },

  getFromView(state) {
    return state.isFromView;
  },

  getSyncId(state) {
    return state.syncId;
  },

  getIsEdit(state) {
    return state.isEditMode;
  },
};
