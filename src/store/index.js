import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'; // Import axios for HTTP requests
import createPersistedState from 'vuex-persistedstate'; // Import vuex-persistedstate
import router from '../router'; // Import the router

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false, // Default to false
    username_state: '',
    isAdmin: false,
    image_user: '',
  },
  getters: {
    isAuthenticated: (state) => state.isAuth,
    getUsername: (state) => state.username_state,
    getImage: (state) => state.image_user,
    getAdmin: (state) => state.isAdmin,
  },
  mutations: {
    SET_AUTH(state, isAuth) {
      state.isAuth = isAuth;
    },
    SET_USERNAME(state, username) {
      state.username_state = username;
    },
    SET_IMAGE(state, image) {
      state.image_user = image;
    },
    SET_ADMIN(state, isAdmin) {
      state.isAdmin = isAdmin;
    }
  },
  actions: {
    login({ commit }) {
      commit('SET_AUTH', true);
    },
    async logout({ commit }) {
      try {
        await axios.post('/authen/logout', {}, { withCredentials: true });
        // Clear localStorage on logout
        localStorage.removeItem('token');
        localStorage.removeItem('username_state');
        localStorage.removeItem('image_user');

        commit('SET_AUTH', false);
        commit('SET_USERNAME', '');
        commit('SET_IMAGE', '');
        if (router.currentRoute.path !== '/') {
          router.push('/');
        }

      } catch (error) {
        console.error('Failed to log out:', error);
      }
    },
    setUsername({ commit }, username) {
      commit('SET_USERNAME', username);
      localStorage.setItem('username_state', username);  // Sync to localStorage immediately
    },
    setImage({ commit }, image) {
      const defaultImage = "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
      const finalImage = image && image.trim() ? image : defaultImage; // Use the default image if the input is empty or null
      commit('SET_IMAGE', finalImage);
      localStorage.setItem('image_user', finalImage); // Sync to localStorage immediately
    },
    setAdmin({ commit }, isAdmin) {
      if (isAdmin === 'admin') {
        commit('SET_ADMIN', true);
      } else {
        commit('SET_ADMIN', false);
      }
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => {
          return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
        }, // Ensure it properly parses from localStorage
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value)); // Ensure it stores as JSON
        },
        removeItem: (key) => localStorage.removeItem(key), // Remove from localStorage
      },
      paths: ['isAuth', 'username_state', 'image_user', 'isAdmin'], // Persist these specific states
    }),
  ],
});
