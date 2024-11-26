import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,  // Stores user info (can be set after logging in)
    isAuthenticated: !!Cookies.get('auth_token'), // Checks if the user is authenticated based on the cookie
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,  // Checks if the user is authenticated
    getUser: state => state.user,  // Returns user data (if available)
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      Cookies.remove('auth_token')  // Remove token from cookies on logout
    },
  },
  actions: {
    // On successful login, set the user and authentication status
    login({ commit }, { username, password }) {
      // Make an API call to login the user
      return new Promise((resolve, reject) => {
        this.$axios.post('/auth/login', { username, password })
          .then(response => {
            const user = response.data.user;
            commit('setUser', user);
            resolve(user);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // On successful registration, you can automatically log the user in
    register({ commit }, { username, email, password }) {
      return new Promise((resolve, reject) => {
        this.$axios.post('/auth/register', { username, email, password })
          .then(response => {
            const user = response.data.user;
            commit('setUser', user);
            resolve(user);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // Logout action
    logout({ commit }) {
      // Call the backend logout route if needed (e.g., to clear the cookie from the server)
      this.$axios.post('/auth/logout')
        .then(() => {
          commit('logout');
        })
        .catch(err => {
          console.error(err);
          commit('logout');
        });
    },
  },
  modules: {
  }
})
