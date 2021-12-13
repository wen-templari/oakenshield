<!-- <template>123</template> -->
<script setup>
import { ref } from "vue";
import WindowButtonGroup from "@/components/WindowButtonGroup/WindowButtonGroup.vue";
import UserCard from "@/components/UserCard/UserCard.vue";
import Message from "@/components/Message/Message.vue";
import LayoutBase from "@/layout/LayoutBase.vue";
import { db } from "@/utils/db";
// import { } from "@/services/socket.js";
const wsAddr = "ws://localhost:8080/message";
const id = localStorage.getItem("id");
const ws = new WebSocket(wsAddr + "?id=" + id);

ws.onopen = evt => {
  console.log("Connection open ...");
};
//接收到消息时触发
ws.onmessage = evt => {
  console.log("Received Message: " + evt.data);
  messages.value.push(JSON.parse(evt.data));
};
//连接关闭时触发
ws.onclose = evt => {
  console.log("Connection closed.");
};

const contactList = ref([]);
const currentContact = ref({});

const getContactList = async () => {
  let res = await db.contact_list.toArray();
  contactList.value = res;
  console.log(contactList.value);
};
getContactList();

const sendMessage = async msg => {
  let message = {
    to: msg.to,
    from: id,
    content: msg.content,
    time: new Date(),
  };
  console.log(message);
  // await db.friends.where("shoeSize").aboveOrEqual(47).modify({ isBigfoot: 1 });
  // const david43 = await db.friends.get({name: "David", age: 43});

  ws.send(JSON.stringify(message));

  await db.contact_list.where({ id: msg.to }).modify({
    // messageList: [...currentContact.value.messageList, message],
    messageList: currentContact.value.messageList.concat(message),
  });

  await getContactList();

  // // db.friends.add(message).then(res => {
  // //   console.log(res);
  // // });
  // messages.value.push(message);
};
</script>
<template>
  <WindowButtonGroup></WindowButtonGroup>
  <LayoutBase>
    <template #side>
      <div class="w-full h-13 flex-shrink-0 drag flex flex-row-reverse items-center">
        <div class="mr-[14px] px-2">+</div>
      </div>
      <div class="flex flex-col h-full overflow-auto">
        <input
          class="rounded-lg border-transparent mt-1 mx-2 h-8 textInput materialInput  p-3 text-sm"
          type="text"
          placeholder="搜索"
          name=""
          id=""
        />
        <div class="mt-3 px-2 overflow-auto">
          <UserCard
            @click="currentContact = item"
            v-for="item in contactList"
            key="item.id "
            :name="item.name"
            :active="item == currentContact"
          ></UserCard>
        </div>
      </div>
      <!-- <div class="flex-shrink-0 flex flex h-28">

      </div> -->
    </template>
    <template #main>
      <Message
        :name="currentContact.name"
        :id="currentContact.id"
        :messageList="currentContact.messageList"
        @sendMessage="sendMessage"
      ></Message>
    </template>
  </LayoutBase>
</template>
<style>
.drag {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
