import Api from "./Api";
import store from "../state/store";

export default {
  getTimeRports(params) {
    return Api().get(
      `/visit_list/${store.getters["authfack/currentEntity"].id}`,
      {
        params: {
          filterBy:
            Object.keys(store.getters["grid/getFilterValues"]).length > 0
              ? store.getters["grid/getFilterValues"]
              : {},
          orderBy:
            params && params.orderBy
              ? params && params.orderBy
              : { sortField: null },
          limit: params && params.limit ? params && params.limit : 10,
          page: params && params.page ? params && params.page : 1,
        },
      }
    );
  },
  getHistoryRports(params) {
    return Api().get(
      `/report_list_history/${store.getters["authfack/currentEntity"].id}`,
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
  getTrackTrace(params) {
    return Api().get(
      `/track_and_trace/${store.getters["authfack/currentEntity"].id}`,
      {
        params: {
          user_id: params.id,
          date: params.date,
        },
      }
    );
  },
  getUsers() {
    return Api().get(
      `users/entities/${store.getters["authfack/currentEntity"].id}`
    );
  },
};
