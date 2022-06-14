export const state = {
    type: null,
    message: null,
    isModalMsg: false //Important: when showing an alert in a modal, turn this into true.
};

export const mutations = {
    success(state, message, isModal) { //Add a boolean value at the end of props to specify whether
        state.type = 'success'; //showing an alert in modals or not and prevent other kind of alerts to show based on this property.
        state.message = message;
        state.show = true;
        state.isModalMsg = isModal;
    },
    error(state, message, isModal) {
        state.type = 'danger';
        state.message = message;
        state.show = true;
        state.isModalMsg = isModal;
    },
    clear(state) {
        state.type = null;
        state.message = null;
        state.show = false;
        state.isModalMsg = false;
    }
};

export const actions = {
    success({ commit }, message) {
        commit('success', message);
    },
    error({ commit }, message) {
        commit('error', message);
    },
    clear({ commit }) {
        commit('clear');
    }
};
