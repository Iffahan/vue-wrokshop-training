<template>
  <div>
    <h1>Login Page</h1>
    <div v-if="show">{{ msg }}</div>
    <v-btn color="success" @click="callAlert()"> Alert </v-btn>
    <v-btn color="success" @click="callAlertParam(msg)"> Alert 2</v-btn>
    <v-btn color="success" @click="show = !show"> Swicth </v-btn>
    <v-row>
      <v-cow cols="6" v-for="(item, index) in item" :key="index">
        <div>
          <v-card
            width="300"
            style="margin-right: 0.5rem; margin-bottom: 0.5rem"
          >
            <v-img :src="item.imageURL"></v-img>
            <v-card-title primary-title> {{ item.message }} </v-card-title>
          </v-card>
        </div>
      </v-cow>
    </v-row>
    <v-col cols="12">
      <h1>{{ value1 }}</h1>
      <v-text-field
        v-model="value1"
        label="Text"
        placeholder="Enter a name"
        name="name"
      >
      </v-text-field>
      <v-btn color="success" @click="setLocalStorage()"> Set </v-btn>
      <v-btn color="success" @click="removeLocalStorage()"> Remove </v-btn>
    </v-col>
    <testprops :name="name" />
    <!-- <cardimg /> -->
  </div>
</template>

<script>
// import cardimg from "../components/CardImg.vue";
import testprops from "../components/TestProps.vue";
import { EventBus } from "@/EventBus";
export default {
  components: {
    testprops,
    // cardimg,
  },
  data() {
    return {
      name: "Iffahan",
      msg: " Show on true",
      show: false,
      item: [
        { message: "foo", imageURL: "https://picsum.photos/300/300" },
        { message: "bar", imageURL: "https://picsum.photos/300/300" },
        { message: "woo", imageURL: "https://picsum.photos/300/300" },
        { message: "car", imageURL: "https://picsum.photos/300/300" },
        { message: "too", imageURL: "https://picsum.photos/300/300" },
      ],
      value1: "",
    };
  },
  methods: {
    callAlert() {
      alert("Alert!!!");
    },
    callAlertParam(msg) {
      alert(msg);
    },
    setLocalStorage() {
      localStorage.setItem("name", this.value1);
      this.$cookies.set("name", this.value1, "60s");
    },
    removeLocalStorage() {
      localStorage.removeItem("name");
      this.$cookies.remove("name");
    },
  },
  mounted() {
    EventBus.$on("CallAlertMain", this.callAlert);
  },
  beforeDestroy() {
    EventBus.$off("CallAlertMain", this.callAlert);
  },
};
</script>

<style></style>
