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
      <v-btn v-show="!isMobile" text to="/"> Home </v-btn>
      <v-btn v-show="!isMobile" text to="/grade"> Grade </v-btn>
      <v-btn v-show="!isMobile" text to="/about"> About </v-btn>
      <v-btn v-show="!isMobile" text to="/login"> Login </v-btn>

      <!-- Three Dot Button (for smaller screens) -->
      <v-menu v-if="isMobile" bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/">Home</v-list-item>
          <v-list-item to="/grade">Grade</v-list-item>
          <v-list-item to="/about">About</v-list-item>
          <v-list-item to="/login">Login</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameLocal: "",
      nameCookies: "",
      isMobile: false,
      searchBarWidth: "300px", // Default width
    };
  },
  watch: {
    $route() {
      this.checkMobile();
    },
  },
  methods: {
    checkMobile() {
      // Check if screen size is small or mobile
      this.isMobile = window.innerWidth <= 600;
      this.searchBarWidth = this.isMobile ? "100%" : "300px"; // Full width on mobile
    },
  },
  created() {
    this.nameLocal = localStorage.getItem("name");
    this.nameCookies = this.$cookies.get("name");
    this.checkMobile(); // Run on load to check initial screen size
    window.addEventListener("resize", this.checkMobile); // Listen for window resize events
  },
  destroyed() {
    window.removeEventListener("resize", this.checkMobile); // Cleanup event listener
  },
};
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>
