import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie'; // Importing js-cookie to handle cookies

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Check if a token exists in cookies, and set isAuth to true or false accordingly
    isAuth: !!Cookies.get('token'), // true if token exists, false otherwise
  },
  getters: {
    isAuthenticated: (state) => state.isAuth, // Return the auth status
  },
  mutations: {
    SET_AUTH(state, isAuth) {
      state.isAuth = isAuth; // Only update the auth state
    },
  },
  actions: {
    login({ commit }) {
      commit('SET_AUTH', true); // Mark user as authenticated
    },
    logout({ commit }) {
      commit('SET_AUTH', false); // Mark user as logged out
    },
  },
  modules: {},
});
