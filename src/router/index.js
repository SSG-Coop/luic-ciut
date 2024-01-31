// © Copyright 2023, LUIC-CIUT's Contributors
// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

// lazy loading method --- not using this for excel addin -- load them all at once!
// const routes = [
//   {
//     path: '/',
//     component: () => import('@/layouts/default/Default.vue'),
//     children: [
//       {
//         path: '',
//         name: 'Home',
//         // route level code-splitting
//         // this generates a separate chunk (about.[hash].js) for this route
//         // which is lazy-loaded when the route is visited.
//         component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
//       },
//     ],
//   },
// ]

// layouts
import MainLayout from "@/views/MainLayout.vue";

// MainLayout views
import WelcomePage from "@/views/WelcomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import HelpPage from "@/views/Help.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import ScenarioForm from "@/views/ScenarioForm.vue";
import ScenarioDetails from "@/views/ScenarioDetails.vue";

const mainPages = {
    path: "/",
    component: MainLayout,
    // component: () => import(/* webpackChunkName: "mainlayout" */ '@/views/MainLayout.vue'),
    children: [
        {
          // add path and alias to make v-menu classes highlight the menu item properly
          path: "dashboard",
          alias: "/",
          name: "dashboard",
          component: DashboardPage,
          // component: () => import(/* webpackChunkName: "dashboard" */ '@/views/DashboardPage.vue'),
          meta: {
            title: "Land Use Impact Calculator",
          }
        },
        {
          path: "welcome",
          name: "welcome",
          component: WelcomePage,
          // component: () => import(/* webpackChunkName: "welcome" */ '@/views/WelcomePage.vue'),
          meta: {
            title: "Welcome",
          }
        },
        {
          path: "help",
          name: "help",
          component: HelpPage,
          // component: () => import(/* webpackChunkName: "help" */ '@/views/AboutPage.vue'),
          meta: {
            title: "Help",
          }
        },
        {
          path: "about",
          name: "about",
          component: AboutPage,
          // component: () => import(/* webpackChunkName: "about" */ '@/views/AboutPage.vue'),
          meta: {
            title: "About",
          }
        },
        {
          path: "scenario/edit",
          name: "scenario_edit",
          component: ScenarioForm,
          // component: () => import(/* webpackChunkName: "scenarioform" */ '@/views/ScenarioForm.vue'),
          meta: {
            title: "Scenario",
          }
        },
        {
          path: "scenario/view",
          name: "scenario_view",
          component: ScenarioDetails,
          // component: () => import(/* webpackChunkName: "scenariodetails" */ '@/views/ScenarioDetails.vue'),
          meta: {
            title: "Scenario",
          }
        },
    ],
}

const routes = [
  mainPages,
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
