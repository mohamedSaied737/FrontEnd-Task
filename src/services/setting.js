import Api from "./Api";

export default {
  getChildSettings() {
    return Api().get(`Setting/child`);
  },
};
