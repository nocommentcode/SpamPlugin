<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <li v-for="chat in chats">
        <q-item clickable v-ripple>
          <q-item-section
            >{{ chat.senderName }} : {{ chat.content }}</q-item-section
          >
        </q-item>
      </li>
    </q-list>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      chats: { loading: true },
    };
  },
  props: {
    firebase: {
      required: true,
    },
    functions: {
      required: true,
    },
    context: {
      required: false,
    },
  },
  watch: {
    firebase: {
      immediate: true,
      async handler() {
        if (!this.context.meetingid) return;

        await this.$rtdbBind(
          "chats",
          this.firebase.ref(`data/spamMessages/${this.context.meetingid}`)
        );
      },
    },
  },
};
</script>
