<template>
  <div>
    {{ loading }}
    <Component :is="computedComponent" :firebase="firebase" />
  </div>
</template>

<script>
import loadRemoteModule from "@paciolan/remote-module-loader";

export default {
  name: "DynamicComponent",
  props: {
    component: {
      required: true,
      type: Object,
    },
    type: {
      required: true,
      type: String,
    },
    firebase: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      computedComponent: null,
      loading: true,
    };
  },
  watch: {
    component: {
      immediate: true,
      async handler(newComponent, prevComponent = "") {
        if (newComponent.url === prevComponent.url) return;

        console.log(`${this.component.url}:${this.type}`);
        const Imported = await loadRemoteModule()(`${this.component.url}`);
        this.computedComponent = Imported[this.type];
        this.loading = false;
      },
    },
  },
};
</script>