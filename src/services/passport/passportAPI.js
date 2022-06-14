import axios from "axios";
import router from "../../router";
import Vue from "vue";

export default () => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.VUE_APP_BASE_URL_PASSPORT}/api`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  Vue.prototype.$http = axiosInstance;
  Vue.config.productionTip = false;
  axiosInstance.defaults.timeout = 1000000;

  axiosInstance.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.data.access_token;
      if (token) {
        config.headers.common["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response);
      }
    },
    (error) => {
      if (error && error.response && error.response.status) {
        switch (error.response.status) {
          case 400:
            //do something
            break;
          case 401:
            router.push("/error");
            break;
          case 403:
            alert("403 Server Error : ", error.response);
            break;
          case 404:
            router.push("/404");
            break;
          case 502:
            alert(error.response);
            alert(
              "502 Server Erorr Please Call Administration : ",
              error.response
            );
            break;
          case 500:
            alert(
              "500 Server Erorr Please Call Administration : ",
              error.response
            );
            break;
          default:
        }
        return Promise.reject(error.response);
      }
    }
  );
  return axiosInstance;
};
