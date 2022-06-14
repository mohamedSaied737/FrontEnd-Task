import Api from "./Api";
import store from "../state/store";

export default {
  getAllDirectories() {
    return Api().get(`/integration/directories`);
  },

  createIntegration(params) {
    return Api().post(
      `/integration/directories/auth/integration/entity/${store.getters["authfack/currentEntity"].id}/directory/${params.directory_type}`,
      params.obj
    );
  },

  reAuthIntegration(params) {
    return Api().post(
      `/integration/${params.integId}/reAuth`,
      params.obj
    );
  },

  getGridInetgrationsData() {
    return Api().get(
      `/integration/directories/entity/${store.getters["authfack/currentEntity"].id}`
    );
  },

  getIntegration(id) {
    return Api().get(`/directories/integration/${id}`);
  },

  getIntegrationWithMapping(id) {
    return Api().get(`/integration/directories/${id}/mapping`);
  },

  getIntegrationStatus(id) {
    return Api().get(`/integration/${id}/status`);
  },

  getIntegrationStat(id) {
    return Api().get(`/integration/${id}/statistics`);
  },

  changeIntegrationStatus(id, status) {
    return Api().put(`/integration/${id}/status/${status}`);
  },

  manageIntegrationSettings(params) {
    return Api().post(`/integration/directory`, params);
  },

  editIntegrationSettings(params) {
    return Api().put(`/integration/${params.id}/directory`, params);
  },

  updateIntegrationSettingsAndSync(params) {
    return Api().put(`/integration/${params.id}/directory/sync`, params);
  },

  getFirstSync(id) {
    return Api().get(`/integration/` + id + `/sync/firstSync`); // call again if id 5 || 4 || 8
  },

  getAutoSync(id) {
    return Api().get(`/integration/` + id + `/sync/autoSync`);
  },

  getFirstMigration(id) {
    return Api().get(`/integration/` + id + `/migrateUsers`); // if id 7
  },

  getSyncUSerStatus(id) {
    return Api().get(`/integration/synctempjob/` + id + `/status`);
  },

  getAllSyncedUsers(id) {
    return Api().get(`/integration/` + id + `/users/synced`);
  },

  getValidTempUsers(id) {
    return Api().get(`/integration/` + id + `/tempUsers/valid`);
  },

  getTempUsersWithErrors(id) {
    return Api().get('/integration/' + id + '/tempUsers/error');
  },

  getTempUsersWithDuplicates(id) {
    return Api().get('/integration/' + id + '/tempUsers/duplicate');
  },

  fixTempUsersWithErrors(params) {
    return Api().put('/integration/' + params.id + '/fixError', params.user);
  },

  fixTempUsersWithDuplicates(params) {
    return Api().put('/integration/tempUsers/' + params.id + '/fixDuplicate', params);
  },

  getRedirectType(id) {
    return Api().get('/integration/firstSync/' + id + '/redirect');
  },

  deleteIntegration(id) {
    return Api().delete(`integration/directory/` + id);
  },

  getSyncLogsList(id) {
    return Api().get(`integration/SyncLogs/${id}`);
  }
};
