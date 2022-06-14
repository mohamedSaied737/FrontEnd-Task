import Api from "./Api";
import axios from "axios";

export default {
  entityBySubdomain(data) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/entity_by_subdomain`,
      { params: data },
      {
        headers: headers,
      }
    );
  },
  passportAuth(data) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.post(
      `${process.env.VUE_APP_BASE_URL}/api/passport_auth`,
      data,
      {
        headers: headers,
      }
    );
  },
  logout() {
    return Api().get(`/logout`);
  },
  registerUser(data) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.post(`${process.env.VUE_APP_BASE_URL}/api/register`, data, {
      headers: headers,
    });
  },
  login(data) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return axios.post(`${process.env.VUE_APP_BASE_URL}/api/login`, data, {
      headers: headers,
    });
  },
  userDetails() {
    return Api().get(`/user_details`);
  },
};
