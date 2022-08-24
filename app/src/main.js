import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import { rtdbPlugin } from "vuefire";
Vue.use(rtdbPlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
