import Api from "./Api";
import store from "../state/store";

export default {
  getAll() {
    return Api().get(`/kiosk/${store.getters["authfack/currentEntity"].id}`);
  },
  // kiosk
  moveKisok(params) {
    return Api().put(`/kiosk_move/${params.id}`, params.params);
  },
  moveMultipleKisoks(params) {
    return Api().put(`/kiosks_move`, params.params);
  },
  deleteKiosk(id) {
    return Api().delete(`/deregister-kiosk/${id}`);
  },
  updateKiosk(params) {
    return Api().put(`/kiosk_setting/${params.id}`, params.params);
  },
  updateKiosksSettings(params) {
    return Api().put(`/kiosks_setting`, params.params);
  },
  addKiosk(params) {
    return Api().post(`/kiosk`, params.params);
  },
  kioskDetails(id) {
    return Api().get(`/get_kiosk_with_setting/${id}`);
  }
};
