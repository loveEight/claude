import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import('@/views/index.vue')
const LoginView = () => import('@/views/login.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
