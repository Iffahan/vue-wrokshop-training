<template>
  <v-app>
    <!-- or <div> if you prefer a plain container -->
    <v-container fluid class="auth-container" fill-height>
      <v-row justify="center" align="center" class="fill-height">
        <!-- Left Section: Logo and Text -->
        <v-col
          cols="12"
          sm="12"
          md="6"
          class="d-flex flex-column justify-center align-center"
        >
          <v-img
            src="../assets/shop.svg"
            alt="Shop Logo"
            max-width="200"
            contain
          />
          <h2 class="mt-4">Welcome to Shoptify</h2>
          <p>Your one-stop shop for everything!</p>
        </v-col>

        <!-- Right Section: Login/Signup Form -->
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-4" elevation="2">
            <v-card-title class="green white--text justify-center mb-4">
              <h3>{{ isLogin ? "Login" : "Sign up" }}</h3>
            </v-card-title>

            <v-form
              ref="authForm"
              v-model="valid"
              @submit.prevent="handleSubmit"
            >
              <transition name="slide-fade" mode="out-in">
                <div :key="isLogin ? 'login' : 'register'">
                  <!-- Login Form -->
                  <div v-if="isLogin">
                    <v-text-field
                      v-model="username"
                      label="Username"
                      outlined
                      dense
                      color="green"
                      class="mb-2"
                      required
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      outlined
                      dense
                      color="green"
                      type="password"
                      class="mb-2"
                      required
                    />
                    <v-btn
                      type="submit"
                      block
                      color="green"
                      :loading="loading"
                      :disabled="!valid"
                    >
                      Login
                    </v-btn>
                  </div>

                  <!-- Register Form -->
                  <div v-if="!isLogin">
                    <v-text-field
                      v-model="username"
                      label="Username"
                      outlined
                      dense
                      color="green"
                      class="mb-2"
                      required
                    />
                    <v-text-field
                      v-model="email"
                      label="Email"
                      outlined
                      dense
                      color="green"
                      class="mb-2"
                      required
                    />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      outlined
                      dense
                      color="green"
                      type="password"
                      class="mb-2"
                      required
                    />
                    <v-text-field
                      v-model="confirmPassword"
                      label="Confirm Password"
                      outlined
                      dense
                      color="green"
                      type="password"
                      class="mb-2"
                      required
                    />
                    <v-btn
                      type="submit"
                      block
                      color="green"
                      :loading="loading"
                      :disabled="!valid"
                    >
                      Register
                    </v-btn>
                  </div>
                </div>
              </transition>
            </v-form>

            <v-row justify="center" align="center" class="mt-4">
              <span>
                <span v-if="isLogin">
                  New to Shoptify?
                  <span
                    @click.stop="toggleForm"
                    style="color: green; cursor: pointer"
                  >
                    <strong>Sign up</strong></span
                  >
                </span>
                <span v-else>
                  Already have an account?
                  <span
                    @click.stop="toggleForm"
                    style="color: green; cursor: pointer"
                    ><strong>Login</strong></span
                  >
                </span>
              </span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="successDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Success!</v-card-title>
        <v-card-text>{{ successMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="handleSuccessDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isLogin: true,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      loading: false,
      successDialog: false,
      successMessage: "",
    };
  },
  methods: {
    ...mapActions(["login", "logout", "setUsername", "setImage", "setAdmin"]), // Map Vuex actions

    toggleForm() {
      this.isLogin = !this.isLogin;
    },

    async handleSubmit() {
      if (this.isLogin) {
        await this.handleLogin();
      } else {
        await this.handleRegister();
      }
    },

    async handleLogin() {
      try {
        this.loading = true;
        setTimeout(async () => {
          const response = await this.axios.post("/authen/login", {
            username: this.username,
            password: this.password,
          });
          this.loading = false;
          if (response.data.success) {
            // Update Vuex state to reflect that the user is authenticated
            this.login();
            this.setUsername(response.data.data.username);
            this.setImage(response.data.data.image);
            this.setAdmin(response.data.data.role);
            this.successMessage = "Login successful!";
            this.successDialog = true;
            setTimeout(() => {
              this.$router.push("/"); // Redirect after login
            }, 1000);
          }
        }, 1000);
      } catch (error) {
        this.loading = false;
        console.error(error);
        alert("Login failed. Please check your credentials.");
      }
    },

    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        this.loading = true;
        setTimeout(async () => {
          const response = await this.axios.post("/users", {
            username: this.username,
            email: this.email,
            password: this.password,
          });
          this.loading = false;
          if (response.data.success) {
            this.successMessage =
              "Registration successful! You can now log in.";
            this.successDialog = true;
            setTimeout(() => {
              this.isLogin = true;
            }, 1000);
          }
        }, 1000);
      } catch (error) {
        this.loading = false;
        console.error(error);
        alert("Registration failed. Please try again.");
      }
    },

    handleSuccessDialog() {
      this.successDialog = false;
    },
  },
};
</script>

<style scoped>
.auth-container {
  background: linear-gradient(to bottom, #f3f4f6, green);
  height: 100vh;
  color: white;
}

.v-card {
  background-color: white;
  border-radius: 10px;
}

.v-btn {
  background-color: green;
  color: white;
}

.v-card-title {
  background-color: green;
}

.v-btn {
  background-color: green;
  color: white;
  border-radius: 5px;
}

/* Transition effect for form swap */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}

/* Custom styling for left section */
.v-col.d-flex {
  padding: 20px;
  color: white;
}

.v-img {
  max-width: 200px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
}
</style>
