import Api from "./Api";
import store from "../state/store";

export default {
  // site
  getSitesWithAreas(params) {
    return Api().get(
      `/sites_list/${store.getters["authfack/currentEntity"].id}`,
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
  getSites() {
    return Api().get(`/sites/${store.getters["authfack/currentEntity"].id}`);
  },
  createSite(params) {
    return Api().post(`/site`, params.params);
  },
  getSingleSite(id) {
    return Api().post(`/site/${id}`);
  },
  updateSite(params) {
    return Api().put(`/site/${params.id}`, params.params);
  },
  deleteSite(id) {
    return Api().delete(`/site/${id}`);
  },
  // area
  getAreasHaskiosk(id) {
    return Api().get(`/areas_has_kiosk/${id}`);
  },
  getAreasFilter(params) {
    return Api().get(`/areas/filter/${params.id}`,      
     {
      params: params.filterBy,
    });
  },
  checkAreasMode(params) {
    return Api().get(`/check_areas_mode_by_site/${params.id}`);
  },
  getAreasBysites(id) {
    return Api().get(`/areas_by_site/${id}`);
  },
  createArea(params) {
    return Api().post(`/area`, params.params);
  },
  updateArea(params) {
    return Api().put(`/area/${params.id}`, params.params);
  },
  moveArea(params) {
    return Api().put(`/area_move/${params.id}`, params.params);
  },
  deleteArea(id) {
    return Api().delete(`/area/${id}`
    );
  },
  getSpecficCompliances(params) {
    return Api().get(`/compliance_users`, { params });
  },
  getAreaDocument(params) {
    return Api().get(`/document_users`, { params });
  },
  checkSignInOutMode(params) {
    return Api().get(`/check_areas_mode_by_area/${params}`);
  },
  getStatusForArea(params) {
    return Api().get(`/check_should_SignedOut_in_area`, { params });
  },

  checkUserHasVisitInArea(params) {
    return Api().get(`/check_user_has_visit_in_area/${params.user_id}/${params.area_id}`);
  },

  fetchAreasBySiteWithoutSignOut(params) {
    return Api().get(`/areas_by_site_with_out_signed_mode/${params.site_id}/${params.area_id}`);
  }
};
