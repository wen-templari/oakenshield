<script setup>
const props = defineProps({
  name: String,
  userId: Number,
  time: String,
  recentMessage: String,
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="flex items-center justify-between rounded-lg w-full h-16 mb-2 p-2 transition duration-100 ease-out" :class="[active ? 'materialInput' : '']">
    <div class="flex items-center">
      <div class="h-12 w-12 ml-4 bg-gray-600 rounded-full"></div>
      <div class="ml-2 flex flex-col justify-between h-12">
        <div class="font-semibold">{{ name }}</div>
        <div class="text-sm text-gray-600">recent</div>
      </div>
    </div>
    <div class="">time</div>
  </div>
</template>
