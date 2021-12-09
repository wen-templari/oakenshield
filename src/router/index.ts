import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  // {
  //   path: "/",
  //   name: "Login",
  //   component: () => import("@/views/Login/Login.vue"),
  // },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Index.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
