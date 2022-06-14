import Api from "./Api";
import store from "../state/store";

export default {
  importUsers(params) {
    return Api().post(`/users/import`, params);
  },
  runImportedUsers(params){
    return Api().post(`/users/run_import`, params);
  },
  fetchImportedTasks(){
    return Api().get(`/users/import_tasks/${store.getters["authfack/currentEntity"].id}`);
  },
  fetchImportDetails(id){
    return Api().get(`/users/list_import_users/${store.getters["authfack/currentEntity"].id}/${id}`);
  }
};
