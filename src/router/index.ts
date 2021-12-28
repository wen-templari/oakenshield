import { createRouter, createWebHashHistory } from "vue-router";
import Index from "@/views/Index.vue";
import Login from "@/views/Login/Login.vue";
import Message from "@/views/Message/Message.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index.vue"),
    children: [
      {
        path: ":id",
        name: "Message",
        component: () => import("@/views/Message/Message.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/Login.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // const target = to.matched[to.matched.length - 1];
  if (token) {
    // login
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
