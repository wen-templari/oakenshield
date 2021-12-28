<script setup>
import { onMounted } from "vue";
const props = defineProps({
  closeOnly: {
    type: Boolean,
    default: false,
  },
});
const emit = e => {
  console.log(e);
  window.api.send(e);
};
</script>
<template>
  <div class="flex">
    <div class="bg-[#e4e6e7] h-screen overflow-hidden w-[300px] flex flex-col">
      <div class="h-13 flex justify-start items-center drag">
        <div class="flex ml-[14px]">
          <div class="actionBtn bg-red-500 no-drag" @click="emit('close')"></div>
          <div v-if="!closeOnly" class="actionBtn bg-yellow-300 no-drag" @click="emit('minimize')"></div>
          <div v-if="!closeOnly" class="actionBtn bg-yellow-500 no-drag" @click="emit('full')"></div>
        </div>
      </div>
      <slot name="side"></slot>
    </div>
    <div class="flex-grow">
      <slot name="main"></slot>
    </div>
  </div>
</template>
<style>
.actionBtn {
  @apply h-[13px] w-[13px]  rounded-[10000px] border border-gray-600/30 mx-[3px] cursor-pointer;
}
.drag {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
