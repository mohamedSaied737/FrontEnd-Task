import Api from "./Api";
import store from "../state/store";

export default {
 getExportList() {
    return Api().get(`/export_list/${store.getters["authfack/currentEntity"].id}`);
  },
 exportComplexData() {
    return Api().get(`/export_job`);
  },
};
