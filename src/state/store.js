import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  plugins: [createPersistedState()],
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== "production",
});

export default store;
