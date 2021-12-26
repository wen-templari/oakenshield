<script setup>
// when a message is send
// 1. clear the input field
// 2. emit sendMessage(content) to index
import { ref, watch, toRefs, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import db from "@/utils/db";

const messageBox = ref(null);
// const scrollTop = messageBox.value.scrollTop;
// defineExpose({ scrollTop });
// const setScrollTop= e=>{
//   messageBox.value.
// }
// onMounted(() => {
//   console.log(messageBox.value.scrollHeight);
//   messageBox.value.scrollTop = messageBox.value.scrollHeight;
//   console.log(messageBox.value.scrollTop);
//   // messageBox.value.focus();
// });
// window.scrollTo(0, document.body.scrollHeight);

const self = localStorage.getItem("id");
const id = ref(route.params.id);
const contact = ref({});
const setContact = () => {
  id.value = route.params.id;
  db.getContact(id.value).then(res => {
    contact.value = res;
  });
};
setContact();
watch(route, setContact);

const inputMessage = ref("");
const sendMessage = async () => {
  if (inputMessage.value == "") {
    return;
  }
  let message = {
    from: self,
    to: id.value,
    content: inputMessage.value,
    time: new Date()
  };
  await db.appendMessage(id.value, message);
  window.api.send("sendMessage", message);
  inputMessage.value = "";
  console.log(contact.value);
  contact.value.messageList.push(message);
};

window.api.receive("messageSent", message => {
  if (message.from == id.value) {
    setContact();
  }
});
window.api.receive("updateModel", key => {
  if(key==self){
    setContact();
  }
});
</script>
<template>
  <div class="flex flex-col justify-start h-screen">
    <div class="h-13 flex-shrink-0 drag bg-[#f0f2f3] flex items-center justify-center">{{ contact.name }}</div>
    <div class="flex-grow flex flex-col p-2 overflow-auto" ref="messageBox">
      <div
        v-for="item in contact.messageList"
        class="py-1 px-2 m-1 rounded-lg shadow-sm w-min"
        :class="[item.from == self ? 'self-end bg-blue-200' : 'bg-gray-200']"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="h-12 flex-shrink-0 px-2 pt-2 flex items-start justify-around">
      <!-- <div>123</div> -->
      <input v-model="inputMessage" class="textInput rounded-full h-7 mr-2 w-full" type="text" />
      <button class="btn btnxs btnPrimary h-7" @click="sendMessage()">send</button>
    </div>
  </div>
</template>
