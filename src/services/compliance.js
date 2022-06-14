import Api from "./Api";
import store from "../state/store";

export default {
    getCompliance() {
      return Api().get(`/compliances/${store.getters["authfack/currentEntity"].id}`
      );
    },
    getComplianceDetails(id) {
      return Api().get(`/compliance/${id}`);
    },
    createCompliance(params) {
      return Api().post("/compliance", params);
    },
    updateCompliance(params) {
      return Api().put(`/compliance/${params.id}`, 
      params.form
      );
    },
    deleteCompliance(id) {
      return Api().delete(`/compliance/${id}`, {
        params: {
          entity_id: store.getters["authfack/currentEntity"].id
        }
      });
    },
  };
  