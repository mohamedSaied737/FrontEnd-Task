import Api from "./Api";
import store from "../state/store";

export default {
  addJourney(params) {
    return Api().post(`/journey_and_journey_flow`, params);
  },
  getJourneys(params) {
    return Api().get(
      `journey_and_journey_flow/${store.getters["authfack/currentEntity"].id}`,
      {
        params
      }
    );
  },
  journeyDetails(id) {
    return Api().get(`/get_journey_and_journey_flow/${id}`);
  },
  updateJourney(params) {
    return Api().put(`/update_journey_and_journey_flow/${params.id}`,params.params);
  },
  deleteJourney(id) {
    return Api().delete(`/delete_journey_and_journey_flow/${id}`);
  },
  getJourneysFlowandTypes(id) {
    return Api().get(
      `get_journey_flow_and_check_user_type_by_jorney/${id}`
    );
  },
};
