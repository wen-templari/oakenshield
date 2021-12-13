<script setup>
// when a message is send
// 1. clear the input field
// 2. emit sendMessage(content) to index
import { ref, onBeforeUnmount } from "vue";
const props = defineProps({
  messageList: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    default: "name",
  },
  id: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["sendMessage"]);
// import { ws } from "@/services/socket.js";
// interface Message {
//   from: string;
//   to: string;
//   content: string;
//   time: string;
// }

// import { db } from "@/utils/db.js";
// const wsAddr = "ws://localhost:8080/message";
// const id = localStorage.getItem("id");
// let ws = new WebSocket(wsAddr + "?id=" + id);

// ws.onopen = function (evt) {
//   console.log("Connection open ...");
// };
// //接收到消息时触发
// ws.onmessage = function (evt) {
//   console.log("Received Message: " + evt.data);
//   messages.value.push(JSON.parse(evt.data));
// };
// //连接关闭时触发
// ws.onclose = function (evt) {
//   console.log("Connection closed.");
// };

let messages = ref([]);
// let self = "tom";

const inputMessage = ref("");
const sendMessage = async () => {
  if (inputMessage.value == "") {
    return;
  }
  emits("sendMessage", {
    to: props.id,
    content: inputMessage.value,
  });
  // let message = {
  //   to: "233",
  //   from: id,
  //   content: inputMessage.value,
  //   time: "",
  // };
  // // db.friends.add(message).then(res => {
  // //   console.log(res);
  // // });
  // ws.send(JSON.stringify(message));
  // messages.value.push(message);
  // inputMessage.value = "";
};
// onBeforeUnmount(() => {
//   console.log("close");
//   ws.close();
// });
</script>
<template>
  <div class="flex flex-col justify-start h-full">
    <div class="h-13 drag bg-[#f0f2f3] flex items-center justify-center">{{ name }}</div>
    <div class="flex-grow flex flex-col p-2">
      <div
        v-for="item in messages"
        class="py-1 px-2 m-1 rounded-lg shadow-sm w-min"
        :class="[item.from == id ? 'self-end bg-blue-200' : 'bg-gray-200']"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="h-15 px-2 flex items-center justify-around">
      <!-- <div>123</div> -->
      <input v-model="inputMessage" class="textInput rounded-full h-7 mr-2 w-full" type="text" />
      <button class="btn btnxs btnPrimary h-7" @click="sendMessage()">send</button>
    </div>
  </div>
</template>
