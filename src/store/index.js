import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie'; // Importing js-cookie to handle cookies
import axios from 'axios'; // Import axios for HTTP requests
import createPersistedState from 'vuex-persistedstate'; // Import vuex-persistedstate

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: !!Cookies.get('token'), // true if token exists, false otherwise
    username_state: '',
    image_user: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
  },
  getters: {
    isAuthenticated: (state) => state.isAuth, // Return the auth status
    getUsername: (state) => state.username_state, // Return the username
    getImage: (state) => state.image_user, // Return the image
  },
  mutations: {
    SET_AUTH(state, isAuth) {
      state.isAuth = isAuth; // Only update the auth state
    },
    SET_USERNAME(state, username) {
      state.username_state = username; // Set the username
    },
    SET_IMAGE(state, image) {
      state.image_user = image;
    }
  },
  actions: {
    login({ commit }) {
      commit('SET_AUTH', true); // Mark user as authenticated
    },
    async logout({ commit }) {
      try {
        // Make a POST request to clear session/cookies on the server
        await axios.post('/authen/logout', {}, { withCredentials: true });

        // Clear cookies on the client
        Cookies.remove('token');

        // Update state
        commit('SET_AUTH', false); // Mark user as logged out
        commit('SET_USERNAME', ''); // Clear the username
      } catch (error) {
        console.error('Failed to log out:', error);
      }
    },
    setUsername({ commit }, username) {
      commit('SET_USERNAME', username); // Set the username
    },
    setImage({ commit }, image) {
      commit('SET_IMAGE', image);
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => Cookies.get(key), // Get item from cookies
        setItem: (key, value) => Cookies.set(key, value, { expires: 7 }), // Set item in cookies (expires in 7 days)
        removeItem: (key) => Cookies.remove(key), // Remove item from cookies
      },
    }),
  ],
});
