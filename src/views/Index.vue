<script setup>
import WindowButtonGroup from "@/components/WindowButtonGroup/WindowButtonGroup.vue";
import Message from "@/components/Message/Message.vue";
import Login from "@/components/Login/Login.vue";
let i = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<template>
  <WindowButtonGroup></WindowButtonGroup>
  <div class="flex">
    <div class="bg-[#e4e6e7] h-screen overflow-hidden w-[318px] flex flex-col">
      <router-view>
        <!-- <Login></Login> -->
        <div class="w-full h-13 flex-shrink-0 drag flex flex-row-reverse items-center">
          <div class="mr-[14px]">+</div>
        </div>
        <div class="flex flex-col overflow-auto">
          <input class="rounded-lg border-transparent mt-1 mx-2 h-8 textInput materialInput p-3 text-sm" type="text" name="" id="" />
          <div class="mt-3 px-2 overflow-auto">
            <div v-for="item in i" class="flex items-center justify-between materialInput rounded-lg w-full h-16 mb-2 p-2">
              <div class="flex items-center">
                <div class="h-12 w-12 ml-4 bg-gray-600 rounded-full"></div>
                <div class="ml-2 flex flex-col justify-between h-12">
                  <div class="font-semibold">name</div>
                  <div class="text-sm text-gray-600">recent</div>
                </div>
              </div>
              <div class="">time</div>
            </div>
          </div>
        </div>
      </router-view>
    </div>
    <div class="flex-grow">
      <Message></Message>
    </div>
  </div>
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
