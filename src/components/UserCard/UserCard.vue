<script setup>
import { ref, toRefs, computed } from "vue";

const AvatarHolder = "https://erebor.oss-cn-hangzhou.aliyuncs.com/1640782786961";
const props = defineProps({
  name: String,
  id: String,
  avatar: String,
  lastMessage: {
    type: Object,
    default: {},
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const { lastMessage } = toRefs(props);
const message = computed(() => {
  let ans = lastMessage.value;
  if (ans.type == "img") {
    ans.content = "[图片]";
  }
  if (ans.time != "") {
    let date = new Date(ans.time);
    ans.date = date.getMonth() + "/" + date.getDate();
    ans.time = date.getHours() + ":" + date.getMinutes();
  }
  return ans;
});
</script>
<template>
  <div
    class="flex justify-between rounded-lg w-full h-16 mb-2 p-2 transition duration-100 ease-out"
    :class="[active ? 'materialInput' : '']"
  >
    <div class="flex items-center">
      <img class="h-11 w-11 rounded-full" :src="avatar || AvatarHolder" />
      <div class="ml-2 flex flex-col justify-between h-14">
        <div class="font-semibold">
          <b>
            {{ name }}
          </b>
          <b class="text-xs textDescription"> ({{ id }})</b>
        </div>
        <div class="text-sm text-gray-600">{{ message.content }}</div>
      </div>
    </div>
    <div class="text-xs mt-0.5 textDescription text-right">
      <div class="">{{ message.time }}</div>
      <div class="">{{ message.date }}</div>
    </div>
  </div>
</template>
