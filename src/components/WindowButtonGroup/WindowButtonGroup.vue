<script setup>
import { onMounted } from "vue";
const props = defineProps({
  closeOnly: {
    type: Boolean,
    default: false,
  },
});
const emitClose = () => {
  window.api.send("close");
};

window.api.receive("ping", () => {
  console.log("received ping");
});
</script>

<template>
  <div class="absolute h-13 flex justify-start items-center">
    <div class="flex ml-[14px]">
      <div class="actionBtn bg-red-500" @click="emitClose"></div>
      <div v-if="!closeOnly" class="actionBtn bg-yellow-300" @click="emitClose"></div>
      <div v-if="!closeOnly" class="actionBtn bg-yellow-500" @click="emitClose"></div>
    </div>
  </div>
</template>

<style>
.actionBtn {
  @apply h-[13px] w-[13px] rounded-full border border-gray-600/30 mx-[3px] cursor-pointer;
}
</style>
