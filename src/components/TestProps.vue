<template>
  <div>
    <h1>Test Props, hello {{ name }}</h1>
    <v-btn color="success" @click="callMain()"> Alert Main </v-btn>
  </div>
</template>

<script>
import { EventBus } from "@/EventBus";
export default {
  props: ["name"],
  methods: {
    callMain() {
      EventBus.$emit("CallAlertMain");
    },
  },
};
</script>

<style></style>
