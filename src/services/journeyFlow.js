import Api from "./Api";
import store from "../state/store";

export default {
    getJourneyFlows() {
      return Api().get(`/journey_flows/${store.getters["authfack/currentEntity"].id}`);
    },
    createJourneyFlow(params) {
      return Api().post("/journey_flow", params);
    },
    updateJourneyFlow(params) {
      return Api().put(`/journey_flow/${params.id}`, 
      params.form
      );
    },
    deleteJourneyFlow(id) {
      return Api().delete(`/journey_flow/${id}`);
    },
    getJourneyFlow(id) {
      return Api().get(`/journey_flow/${id}`);
    },
  };
  