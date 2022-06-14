import Api from "./passportAPI";

export default {
  checkPassportStatus(params) {
    return Api().post("/check-activation-status", params);
  },
  reactivePassportAccount(params) {
    return Api().post("/reactivate-passport-account", params);
  },
  generatePassportToken(id) {
    return Api().post(`/generate-token-by-id`,id);
  },
};
