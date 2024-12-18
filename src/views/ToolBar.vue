<template>
  <div>
    <v-app-bar app color="green" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Shop Logo"
          class="shrink mr-2"
          contain
          src="../assets/shop.svg"
          transition="scale-transition"
          width="40"
        />
        <h1 class="shrink mt-1 hidden-sm-and-down" contain width="100">
          Shoptify
        </h1>
      </div>

      <!-- Search Bar -->
      <v-text-field
        class="mx-4"
        label="Search"
        hide-details
        single-line
        outlined
        dense
        append-icon="mdi-magnify"
        style="max-width: 400px"
        :style="{ width: searchBarWidth }"
      />

      <v-spacer></v-spacer>

      <!-- Navigation Buttons (for larger screens) -->
      <v-btn v-show="!isMobile" text to="/">Home</v-btn>
      <v-btn v-show="!isMobile" text to="/grade">Grade</v-btn>
      <v-btn v-show="!isMobile" text to="/about">About</v-btn>

      <!-- Cart Icon with Badge -->
      <v-btn v-show="!isMobile & isAuthenticated" icon @click="editCart">
        <v-badge
          v-if="cartItemCount > 0"
          overlap
          color="pink"
          :content="cartItemCount"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
        <v-icon v-else>mdi-cart-outline</v-icon>
      </v-btn>

      <!-- Authenticated User Dropdown -->
      <template v-if="isAuthenticated">
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" v-show="!isMobile">
              <v-avatar size="32" class="mr-1 custom-avatar">
                <v-img :src="userImage" alt="User Avatar" />
              </v-avatar>
              {{ username }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="editProfile">
              <v-list-item-title>Edit My Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Profile Image with Dropdown for Mobile -->
        <v-menu v-if="isMobile" bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on" size="32" class="mr-1">
              <!-- Dynamically use the base64 image -->
              <v-img :src="userImage" alt="User Avatar" />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item @click="editProfile">
              <v-list-item-title>Edit My Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- Login Button for Unauthenticated Users -->
      <template v-else>
        <v-btn v-show="!isMobile" text to="/login">Login</v-btn>
      </template>

      <!-- Three Dot Button (for smaller screens) -->
      <v-menu v-if="isMobile" bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/">Home</v-list-item>
          <v-list-item v-if="isAuthenticated" @click="editCart">
            Cart
          </v-list-item>
          <v-list-item to="/grade">Grade</v-list-item>
          <v-list-item to="/about">About</v-list-item>
          <v-list-item v-if="!isAuthenticated" to="/login">Login</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      isMobile: false,
      searchBarWidth: "300px", // Default width
      cartItemCount: 0, // Number of items in the cart
    };
  },
  computed: {
    // Map Vuex getters
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      username: "getUsername",
      userImage: "getImage",
    }),
  },
  methods: {
    async fetchCartCount() {
      try {
        const response = await axios.get("/carts/me");
        const cartData = response.data.data;
        console.log("Cart Data:", cartData);

        // Count distinct products in the cart
        this.cartItemCount = cartData.items.length;
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        this.cartItemCount = 0;
      }
    },
    ...mapActions(["logout"]), // Map logout action from Vuex
    checkMobile() {
      // Check if screen size is small or mobile
      this.isMobile = window.innerWidth <= 600;
      this.searchBarWidth = this.isMobile ? "100%" : "300px"; // Full width on mobile
    },
    editProfile() {
      // Check if already on the profile page to avoid redundant navigation
      if (this.$route.path !== "/profile") {
        this.$router.push("/profile");
      }
    },

    editCart() {
      // Check if already on the profile page to avoid redundant navigation
      if (this.$route.path !== "/cart") {
        this.$router.push("/cart");
      }
    },
  },
  created() {
    this.checkMobile(); // Run on load to check initial screen size
    this.fetchCartCount(); // Fetch cart count on component creation
    window.addEventListener("resize", this.checkMobile); // Listen for window resize events
  },
  destroyed() {
    window.removeEventListener("resize", this.checkMobile); // Cleanup event listener
  },
};
</script>

<style scoped>
.custom-avatar {
  border: 2px solid white; /* White border */
}
</style>
