<template>
  <v-container fluid class="user-edit-page">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline green--text">Edit Profile</v-card-title>
          <v-card-subtitle class="mb-4"
            >Update your details below</v-card-subtitle
          >

          <!-- User Image with Camera Icon -->
          <v-row justify="center">
            <v-col cols="auto">
              <v-avatar
                size="100"
                class="position-relative"
                style="cursor: pointer; margin-bottom: 16px"
              >
                <v-img :src="userImage" alt="User Avatar" />
                <v-icon
                  class="position-absolute top-0 bottom-0 left-0 ma-0"
                  @click="triggerFileInput"
                  color="green"
                >
                  mdi-camera
                </v-icon>
              </v-avatar>
              <input
                type="file"
                ref="imageInput"
                @change="handleImageChange"
                hidden
              />
            </v-col>
          </v-row>

          <!-- Form fields in rows with 2 or 3 columns -->
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Username"
                v-model="username"
                outlined
                dense
                clearable
                readonly
                disabled
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Email"
                v-model="email"
                outlined
                dense
                clearable
                readonly
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="First Name"
                v-model="firstname"
                outlined
                dense
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Last Name"
                v-model="lastname"
                outlined
                dense
                clearable
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Address"
                v-model="address"
                outlined
                dense
                clearable
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Phone"
                v-model="phone"
                outlined
                dense
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-select
                label="Gender"
                v-model="gender"
                :items="genderOptions"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                label="Age"
                v-model="age"
                type="number"
                outlined
                dense
                clearable
              />
            </v-col>
          </v-row>

          <v-btn
            @click="updateUser"
            color="green"
            class="mt-4 custom-button"
            block
            :loading="loading"
          >
            Save Changes
          </v-btn>

          <v-divider class="my-4"></v-divider>

          <v-alert
            v-if="updateSuccess"
            type="success"
            class="mt-4"
            dense
            bordered
            transition="slide-x-reverse-transition"
          >
            User details updated successfully!
          </v-alert>

          <v-alert
            v-if="updateError"
            type="error"
            class="mt-4"
            dense
            bordered
            transition="slide-x-reverse-transition"
          >
            Failed to update user details. Please try again later.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      gender: "",
      age: "",
      userImage: "",
      genderOptions: ["male", "female", "other"],
      loading: false,
      updateSuccess: false,
      updateError: false,
    };
  },
  created() {
    this.fetchUserData();
  },

  computed: {
    // Map Vuex getters
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      username: "getUsername",
      userimage: "getImage",
    }),
  },
  methods: {
    ...mapActions(["login", "logout", "setUsername", "setImage"]), // Map Vuex actions
    async fetchUserData() {
      try {
        const response = await axios.get("/users/me");
        const userData = response.data.data;
        this.email = userData.email;
        this.username = userData.username;
        this.firstname = userData.firstname;
        this.lastname = userData.lastname;
        this.address = userData.address;
        this.phone = userData.phone;
        this.gender = userData.gender;
        this.age = userData.age;
        this.userImage = userData.image || this.userimage; // User image preview
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    },

    async updateUser() {
      this.loading = true;
      this.updateSuccess = false;
      this.updateError = false;

      try {
        const updatedData = {
          username: this.username,
          firstname: this.firstname,
          lastname: this.lastname,
          address: this.address,
          phone: this.phone,
          gender: this.gender,
          age: this.age,
          image: this.userImage,
        };

        const response = await axios.put("/users", updatedData);

        if (response.status === 200) {
          this.updateSuccess = true;
          this.login();
          this.setUsername(response.data.data.username);
          this.setImage(response.data.data.image);
        }
      } catch (error) {
        this.updateError = true;
        console.error("Failed to update user:", error);
      } finally {
        this.loading = false;
      }
    },

    triggerFileInput() {
      this.$refs.imageInput.click();
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.userImage = reader.result; // Base64 string
        };
      }
    },
  },
};
</script>

<style scoped>
.user-edit-page {
  background: linear-gradient(to bottom, #f3f4f6, green);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.custom-button {
  color: white;
  font-weight: bold;
}

.v-btn {
  font-weight: bold;
}

.v-alert {
  font-size: 1.2rem;
}

.v-divider {
  background-color: #e0e0e0;
}

.v-text-field input {
  font-size: 1.2rem;
}

.v-text-field label {
  font-size: 1.2rem;
}

.v-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 3px solid green; /* White border */
}

.v-icon {
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 8px;
}

@media (max-width: 600px) {
  .v-card {
    padding: 16px;
  }

  .v-btn {
    font-size: 1rem;
  }
}
</style>
