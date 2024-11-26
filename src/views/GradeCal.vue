<template>
  <v-container fluid class="grade-calculator">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline green--text"
            >Grade Calculator</v-card-title
          >
          <v-card-subtitle class="mb-4"
            >Enter your grade to see your result</v-card-subtitle
          >

          <v-text-field
            label="Grade"
            v-model="grade"
            outlined
            dense
            type="number"
            class="mx-4"
            :style="{ 'max-width': '400px' }"
            clearable
            append-icon="mdi-numeric"
            hint="Enter a number between 0 and 100"
            persistent-hint
          />

          <v-btn
            @click="calculateGrade"
            color="green"
            class="mt-4 custom-button"
            block
            :loading="loading"
          >
            Calculate Grade
          </v-btn>

          <v-divider class="my-4"></v-divider>

          <v-alert
            v-if="result"
            :type="resultType"
            class="mt-4"
            dense
            bordered
            transition="slide-x-reverse-transition"
          >
            Your grade is <strong>{{ result }}</strong>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      grade: "",
      result: "",
      loading: false,
      resultType: "success",
    };
  },
  methods: {
    calculateGrade() {
      if (this.grade === "" || isNaN(this.grade)) {
        alert("Please enter a valid grade.");
        return;
      }

      this.loading = true; // Show loading indicator on button

      setTimeout(() => {
        if (this.grade >= 80 && this.grade <= 100) {
          this.result = "A";
          this.resultType = "success";
        } else if (this.grade >= 70 && this.grade <= 79) {
          this.result = "B";
          this.resultType = "info";
        } else if (this.grade >= 60 && this.grade <= 69) {
          this.result = "C";
          this.resultType = "warning";
        } else if (this.grade >= 50 && this.grade <= 59) {
          this.result = "D";
          this.resultType = "warning";
        } else if (this.grade >= 0 && this.grade <= 49) {
          this.result = "F";
          this.resultType = "error";
        } else {
          this.result = "";
          this.resultType = "error";
          alert("Invalid grade");
        }

        this.loading = false; // Hide loading indicator after calculation
      }, 500); // Simulate loading time (1 second)
    },
  },
};
</script>

<style scoped>
.grade-calculator {
  background: linear-gradient(to bottom, #f3f4f6, #e0e0e0);
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
  color: white; /* Ensure the text is white */
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

@media (max-width: 600px) {
  .v-card {
    padding: 16px;
  }

  .v-btn {
    font-size: 1rem;
  }
}
</style>
