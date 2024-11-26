<template>
  <v-container fluid class="about-me-page">
    <!-- Main Card Wrapper -->
    <v-card class="about-me-card" outlined>
      <v-card-text>
        <v-row justify="center" align="center" class="content">
          <!-- Left: Picture -->
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-img
              src="../assets/coding.webp"
              class="profile-picture"
              alt="Profile Picture"
              contain
            ></v-img>
          </v-col>

          <!-- Right: Information -->
          <v-col cols="12" md="6" class="about-me-text">
            <h1>👋 Hi there, I'm pleased to meet you!</h1>
            <h2>My name is <strong>Iffahan Suksuwan</strong></h2>
            <p>
              🎓 Graduated from <span>Computer Engineering</span>,
              <span>Prince of Songkla University</span>
            </p>
            <p>
              In my free time, I enjoy coding, exploring new technologies, and
              contributing to open-source projects.
            </p>

            <!-- Hobby and Preferences Card -->
            <v-card class="preferences-card mt-5" outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <h3>🎨 Hobbies</h3>
                    <ul>
                      <li>Coding</li>
                      <li>Reading tech blogs</li>
                      <li>Playing video games</li>
                    </ul>
                  </v-col>
                  <v-col cols="12" md="4">
                    <h3>🌟 Favorite Things</h3>
                    <ul>
                      <li>Exploring new technologies</li>
                      <li>Learning new things</li>
                      <li>Spicy food</li>
                    </ul>
                  </v-col>
                  <v-col cols="12" md="4">
                    <h3>🚫 Dislikes</h3>
                    <ul>
                      <li>Procrastination</li>
                      <li>Messy code</li>
                      <li>Unnecessary meetings</li>
                    </ul>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Social Media Links -->
            <div class="social-links mt-5">
              <v-row>
                <h3>📱 Connect with me:</h3>
                <v-btn
                  icon
                  href="https://www.linkedin.com/in/iffahan-suksuwan-b0a055318/"
                  target="_blank"
                >
                  <v-icon color="blue darken-3">mdi-linkedin</v-icon>
                </v-btn>
                <v-btn icon href="iffahan.suksuwan@gmail.com">
                  <v-icon color="red">mdi-email</v-icon>
                </v-btn>
                <v-btn icon href="https://github.com/Iffahan" target="_blank">
                  <v-icon color="black">mdi-github</v-icon>
                </v-btn>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AboutMe",
};
</script>

<style scoped>
.about-me-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom, #f3f4f6, green);
}

/* Main Content Card */
.about-me-card {
  max-width: 1200px;
  width: 100%;
  box-shadow: none;
  border-radius: 10px;
  padding: 20px;
}

/* Profile Picture */
.profile-picture {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: block;
  mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}

/* About Me Text */
.about-me-text {
  padding: 20px;
  line-height: 1.8;
}

h1 {
  color: green;
}

h2 {
  color: black;
  margin-top: -10px;
}

span {
  font-size: 1.1em;
  font-weight: bold;
  color: black;
}

/* Hobby & Preferences */
.preferences-card {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

h3 {
  color: green;
  margin-bottom: 10px;
}

ul {
  list-style-type: square;
  padding-left: 20px;
}

li {
  font-size: 1em;
  margin-bottom: 5px;
}

/* Social Media */
.social-links {
  margin-top: 20px;
}

.social-links h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: green;
}

.social-links v-btn {
  margin: 0 5px;
}
</style>
