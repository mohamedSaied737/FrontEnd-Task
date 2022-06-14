export const state = {
  data: null,
  additionalContent: null,
  modalState:false,
};

export const actions = {
  setData({ commit }, data) {
    commit("setData", data);
  },
  changeModalAdContent({ commit }, payload) {
    commit("changeModalAdContent", payload);
  },
  onResetModal({ commit }) {
    commit("resetModal");
  },
};

export const mutations = {
  setData(state, data) {
    state.data = data;
  },
  resetModal(state) {
    state.data = null;
  },
  changeModalAdContent(state, payload) {
    state.additionalContent = payload;
  },
  setModalState(state, payload) {
    state.modalState = payload;
  },
};

export const getters = {
  getModalData(state) {
    return state.additionalContent;
  },
  getModalInfo(state) {
    return state.data;
  },
  getModalState(state) {
    return state.modalState;
  },
};
