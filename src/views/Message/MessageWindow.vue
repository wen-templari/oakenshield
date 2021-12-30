<template>
  <div id="messageWindow" class="flex-grow flex flex-col p-2 overflow-auto">
    <div v-for="item in messageList">
      <div v-if="item.showTime" class="text-xs font-light text-gray-500 mt-2 text-center">{{ item.showTime }}</div>
      <div class="relative flex my-2" :class="[item.from == self ? 'flex-row-reverse ' : '']">
        <img class="h-9 w-9 bg-black rounded-full mx-1" :src="item.from == self ? avatar : contact.avatar" />
        <div
          v-if="item.type == 'plain'"
          class="py-1 px-2 rounded-lg shadow-sm w-min"
          :class="[item.from == self ? 'bg-blue-200' : 'bg-gray-200']"
        >
          {{ item.content }}
        </div>
        <div v-if="item.type == 'img'" class="p-3 rounded-lg shadow-sm bg-gray-200">
          <img class="w-50" :src="item.content" alt="" />
        </div>
      </div>
    </div>
    <div id="messageWindowBottom"></div>
  </div>
</template>

<script>
export default {
  name: "messageWindow",
  props: {
    messageList: {
      type: Array,
    },
    contact: {
      type: Object,
    },
    self: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  mounted() {
    this.scrollToBottom();
  },
  watch: {
    $route(to, from) {
      this.scrollToBottom();
    },
    messageList: {
      handler(newVal) {
        this.scrollToBottom();
      },
      deep: true,
    },
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        let bottom = document.getElementById("messageWindowBottom");
        bottom.scrollIntoView();
      });
    },
  },
};
</script>
