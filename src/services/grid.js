import Api from "./Api";
import store from "../state/store";

export default {
  getTableHeaders(params) {
    return Api().get(
      `/adminPreference/${store.getters["authfack/currentEntity"].id}`,
      {
        params: {
          employee_id: store.getters["authfack/userDetails"].user_id,
          page_url: params.url,
        },
      }
    );
  },
  createTableHeaders(params) {
    return Api().post(`/adminPreference`, {
      employee_id: store.getters["authfack/userDetails"].user_id,
      entity_id: store.getters["authfack/currentEntity"].id,
      page_url: params.url,
      table_head: params.headers,
      url: params.filters,
    });
  },
  updateTableHeaders(params) {
    return Api().put(`/adminPreference/${store.getters["grid/getAdminPreferenceId"]}`, {
      employee_id: store.getters["authfack/userDetails"].user_id,
      entity_id: store.getters["authfack/currentEntity"].id,
      page_url: params.url,
      table_head: params.headers,
      url: params.filters,
    });
  },
  exportBE(params) {
    return Api().post("/export ", params);
  },

  exportJobBE(params) {
    return Api().post("/export_job ", params);
  },

  checkVaccinePCRColumnAppearance() {
    return Api().get(
      `/check_vaccine_document/${store.getters["authfack/currentEntity"].id}`
    );
  },
};
