<script setup>
import { onMounted } from "vue";
const props = defineProps({
  closeOnly: {
    type: Boolean,
    default: false,
  },
});
const emit = e => {
  window.api.send(e);
};

// window.api.receive("ping", () => {
//   console.log("received ping");
// });
</script>

<template>
  <div class="absolute h-13 flex justify-start items-center">
    <div class="flex ml-[14px] hover:(bg-black)">
      <div class="actionBtn bg-red-500" @click="emit('close')"></div>
      <div v-if="!closeOnly" class="actionBtn bg-yellow-300" @click="emit('minimize')"></div>
      <div v-if="!closeOnly" class="actionBtn bg-yellow-500" @click="emit('full')"></div>
    </div>
  </div>
</template>

<style>
.actionBtn {
  @apply h-[13px] w-[13px]  rounded-[10000px] border border-gray-600/30 mx-[3px] cursor-pointer;
}
</style>
