<template>
  <v-container
    fluid
    class="auth-container"
    style="color: white; height: 100vh; background-color: green"
    fill-height
  >
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

          <!-- Add transition effect for left-right swap -->
          <v-form ref="authForm" v-model="valid" @submit.prevent="handleSubmit">
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

          <!-- Switch Button for Register/Login -->
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
</template>

<script>
export default {
  data() {
    return {
      isLogin: true, // Default is Login
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      loading: false,
    };
  },
  methods: {
    // Toggle between Login and Register
    toggleForm() {
      this.isLogin = !this.isLogin;
    },

    handleSubmit() {
      if (this.isLogin) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    },

    handleLogin() {
      this.loading = true;
      // Simulate login logic
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/"); // Redirect to home/dashboard after login
      }, 2000);
    },

    handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      this.loading = true;
      // Simulate registration logic
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/"); // Redirect to login page after successful registration
      }, 2000);
    },
  },
};
</script>

<style scoped>
.auth-container {
  background-color: green;
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
