<!-- <template>123</template> -->
<script setup>
import { ref } from "vue";
import WindowButtonGroup from "@/components/WindowButtonGroup/WindowButtonGroup.vue";
import Message from "@/components/Message/Message.vue";
import LayoutBase from "@/Layout/LayoutBase.vue";
const contactList = ref([
  {
    name: "tom",
    id: "233",
  },
  {
    name: "clas",
    id: "123",
  },
]);
</script>
<template>
  <WindowButtonGroup></WindowButtonGroup>
  <LayoutBase>
    <template #side>
      <div class="w-full h-13 flex-shrink-0 drag flex flex-row-reverse items-center">
        <div class="mr-[14px] px-2">+</div>
      </div>
      <div class="flex flex-col overflow-auto">
        <input class="rounded-lg border-transparent mt-1 mx-2 h-8 textInput materialInput p-3 text-sm" type="text" name="" id="" />
        <div class="mt-3 px-2 overflow-auto">
          <div
            v-for="item in contactList"
            key="item.id"
            class="flex items-center justify-between materialInput rounded-lg w-full h-16 mb-2 p-2"
          >
            <div class="flex items-center">
              <div class="h-12 w-12 ml-4 bg-gray-600 rounded-full"></div>
              <div class="ml-2 flex flex-col justify-between h-12">
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-sm text-gray-600">recent</div>
              </div>
            </div>
            <div class="">time</div>
          </div>
        </div>
      </div>
    </template>
    <template #main>
      <Message></Message>
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
