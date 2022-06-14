import Api from "./Api";
import store from "../state/store";

export default {
  getAll(params) {
    return Api().get(
      `/visit_list/${store.getters["authfack/currentEntity"].id}`,
      {
        params: {
          filterBy: params && params.finalFilterObject ? params.finalFilterObject : {},
          orderBy: params && params.sortObject ? params.sortObject : { sortField: null },
          limit: params && params.limit ? params && params.limit : 10,
          page: params && params.page ? params && params.page : 1,
        },
      }
    );
  },
  getCounts() {
    return Api().get(
      `/dashboard/${store.getters["authfack/currentEntity"].id}`
    );
  },
  getScanDatatypes() {
    return Api().get(`/sacn_data_type`);
  },
  getInputTypes() {
    return Api().get(`/input_method`);
  },
  getAreas() {
    return Api().get(`/areas/${store.getters["authfack/currentEntity"].id}`);
  },
  getKiosks() {
    return Api().get(`/kiosk/${store.getters["authfack/currentEntity"].id}`);
  },
  async getUserTypes() {
    return await Api().get(
      `/user-types/list/${store.getters["authfack/currentEntity"].id}`
    );
  },
  scanAction(visit) {
    return Api().post(`/user_action`, { visit });
  },
  dashboardAction(params) {
    return Api().post(`/checkin_users`, params);
  },
  addVisitNotes(params) {
    return Api().put(`/visits/notes`, params);
  }
};
