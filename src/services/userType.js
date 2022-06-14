import Api from "./Api";
import store from "../state/store";
import axios from "axios";

export default {
  getUserTypesWithChildren(params) {
    return Api().get(
      `/user-types/${store.getters["authfack/currentEntity"].id}`,{params}
    );
  },
  getTypesParent() {
    return Api().get(
      `/user_type_parent/${store.getters["authfack/currentEntity"].id}`
    );
  },
  getAllUsersTypes() {
    return  Api().get(
      `/user-types/list/${store.getters["authfack/currentEntity"].id}`
    );
  },
  createUserType(params) {
    return Api().post("/user-type", params);
  },
  updateUserType(params) {
    return Api().put(`/user-type/update/${params.id}`, params.form);
  },
  moveUserType(params) {
    return Api().put(`/user-type/move`, params);
  },
  deleteUserType(params) {
    return Api().delete(`/user-type`, { data: params });
  },
  getUserType(id) {
    return Api().get(`/user-type/${id}`);
  },

  getRegistrationTypes(id) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.get(`${process.env.VUE_APP_BASE_URL}/api/get_pre_registration_user_type/${id}`, {
      headers: headers,
    });
  },
};
