import axios from "axios";
import Api from "./Api";
import store from "../state/store";

export default {
  checkSubdomain(subdomain) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/check_subdomain?subdomain=${subdomain}`,
      [],
      {
        headers: headers,
      }
    );
  },
  createEntity(params) {
    return Api().post("/entity ", params);
  },
  updateEntity(params) {
    return Api().put(`/entity/${params.id}`, params.params);
  },
  getEntities() {
    return Api().get(
      `/users_entities/${store.getters["authfack/userDetails"].user_id}`
    );
  },
  checkEntitySubdomain(subdomain) {
    return Api().get(`/check_subdomain?subdomain=${subdomain}`);
  },
};
