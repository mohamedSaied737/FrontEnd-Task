import Api from "./Api";
import store from "../state/store";

export default {
  editUserType(params) {
    return Api().post(`/user-type_privacy_manager`, params.params);
  },
  deleteNowUserType(params) {
    return Api().post(`/delete_now_privacy_manager`, params.params);
  },
  togglePrivacyManager(params) {
    return Api().put(
      `/entity_privacy_manager/${store.getters["authfack/currentEntity"].id}`,
      params.params
    );
  },
  getLastCronExecution() {
    return Api().get(`/cron_jobs/${store.getters["authfack/currentEntity"].id}`);
  },
  checkUserPassword(password) {
    const convertPass = encodeURIComponent(password);
    return Api().get(`/check_password?password=${convertPass}`);
  },
};
