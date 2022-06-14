import passportService from "@/services/passport/passport";
import CryptoJS from "crypto-js";

// eslint-disable-next-line no-unused-vars
let CryptoJSAesJson = {
  stringify: function(cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function(jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};

const getDefaultState = () => {
  return {
    passportData: null,
    loading: false,
    modalState: false,
  };
};

export const state = getDefaultState();

export const actions = {
  checkPassportStatus({ commit }, params) {
    return new Promise((resolve, reject) => {
      passportService
        .checkPassportStatus(params)
        .then((data) => {
          resolve(data);
          commit("setPassportData", data.data);
          if (data.data.active) {
            const passport_id =
              JSON.parse(localStorage.getItem("userDetails")) &&
              JSON.parse(localStorage.getItem("userDetails")).passport_id;
            const unique_company = process.env.VUE_APP_PASSPORT_KEY;
            const encrypted_passport_id = btoa(
              CryptoJS.AES.encrypt(
                JSON.stringify(passport_id),
                unique_company,
                {
                  format: CryptoJSAesJson,
                }
              ).toString()
            );

            window.location.href = `${process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT}/login/${encrypted_passport_id}`;
          }
        })
        .catch((err) => {
          reject(err);
          if (window.location.origin == process.env.VUE_APP_DOMAIN) {
            window.location.href = `${process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT}/login`;
          } else {
            window.location.href = `${window.location.origin}/login`;
          }
        });
    });
  },
  reactivePassportAccount({ commit }, params) {
    commit("setLoading", true);
    return new Promise((resolve, reject) => {
      passportService
        .reactivePassportAccount(params)
        .then((data) => {
          resolve(data);
          commit("setLoading", false);
          commit("setModalState", true);
          const passport_id =
            JSON.parse(localStorage.getItem("userDetails")) &&
            JSON.parse(localStorage.getItem("userDetails")).passport_id;
          const unique_company = process.env.VUE_APP_PASSPORT_KEY;
          const encrypted_passport_id = btoa(
            CryptoJS.AES.encrypt(JSON.stringify(passport_id), unique_company, {
              format: CryptoJSAesJson,
            }).toString()
          );
          window.location.href = `${process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT}/login/${encrypted_passport_id}`;
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("setModalState", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  generatePassportToken({ commit }, id) {
    return new Promise((resolve, reject) => {
      passportService
        .generatePassportToken(id)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
          commit("setLoading", false);
          commit("setModalState", false);
          err.status != 401 && this._vm.$toast.error(err.data.message);
        });
    });
  },
  redirectToPassport() {
    const passport_id =
      JSON.parse(localStorage.getItem("userDetails")) &&
      JSON.parse(localStorage.getItem("userDetails")).passport_id;
    const unique_company = process.env.VUE_APP_PASSPORT_KEY;
    const encrypted_passport_id = btoa(
      CryptoJS.AES.encrypt(JSON.stringify(passport_id), unique_company, {
        format: CryptoJSAesJson,
      }).toString()
    );
    window.location.href = `${process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT}/login/${encrypted_passport_id}`;
  },
  resetState({ commit }) {
    commit("setPassportData", null);
  },
  resetModalState({ commit }) {
    commit("setModalState", false);
  },
};

export const mutations = {
  setLoading(state, payload) {
    state.loading = payload;
  },
  setModalState(state, payload) {
    state.modalState = payload;
  },
  setPassportData(state, payload) {
    state.passportData = payload;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
  getModalState(state) {
    return state.modalState;
  },
  getPassportData(state) {
    return state.passportData;
  },
};
