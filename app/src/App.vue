<template>
  <div id="app">
    <h1>Dashboard</h1>
    <div v-for="(control, index) in uilibs" :key="index">
      <ComputedComponent
        :component="control"
        type="Dashboard"
        :firebase="firebase"
      ></ComputedComponent>
    </div>
    <h1>Overlay</h1>
    <div v-for="(control, index) in uilibs" :key="index">
      <ComputedComponent
        :component="control"
        type="Overlay"
        :firebase="firebase"
      ></ComputedComponent>
    </div>

    <!-- <Dashboard /> -->
    <!-- <Overlay /> -->
  </div>
</template>

<script>
import ComputedComponent from "./ComputedComponent.vue";

// Get a RTDB instance
import firebase from "firebase/app";
import "firebase/database";

export const db = firebase
  .initializeApp({
    databaseURL: "https://zoomsense-plugin-default-rtdb.firebaseio.com/",
  })
  .database();

export default {
  name: "App",
  components: {
    // Dashboard,
    // Overlay,
    ComputedComponent,
  },
  data: () => {
    return {
      firebase: db,
      uilibs: {
        "plugin-example": {
          // url: "https://action-lab-aus.gitlab.io/zoomsense/zoomsense-plugin-directory/MyNewPlugin/main/MyNewPlugin.Dashboard.umd.min.js",
          url: "http://localhost:5000/dist/PluginExample.common.js",
        },
      },
    };
  },
};
</script>