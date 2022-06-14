import Api from "./Api";
import store from "../state/store";

export default {
  getJourneys() {
    return Api().get(`/journeys/${store.getters["authfack/currentEntity"].id}`);
  },
  createJourney(params) {
    return Api().post("/journey", params);
  },
  updateJourney(params) {
    return Api().put(`/journey/${params.id}`,
      params.form
    );
  },
  deleteJourney(id) {
    return Api().delete(`/journey/${id}`);
  },
  getJourneyDetails(id) {
    return Api().get(`/journey/${id}`);
  },
  getUserTypeRelatedToJourney(id) {
    return Api().get(`/get_user_type_related_to_journey/${id}`);
  },
  getJourneyInputs(id) {
    return Api().get(`/check_journey_have_input/${id}`);
  },
  changeJourney(params) {
    const data = { kiosk: { journey_id: params.journey_id, area_id: params.area_id } };
    return Api().put(`/change_journey_for_kiosk/${params.kiosk_id}`, data);
  }
};
