import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  // {path: '/', name: 'app', component: () => import('../App.vue')},
  {path: '/Sudoku', name: 'Sudoku', component: () => import('../views/Sudoku.vue')},
  // {path: '/Sudoku', name: 'SudokuHome', component: () => import('../views/Home.vue')},
  // {path: '/Sudoku', name: 'SudokuHome', component: () => import('../views/Home.vue')},
  {path: '*', component: () => import('../views/Sudoku.vue')}
];
// if (process.env.MODE !== 'ssr') {
//   routes.push({
//     path: '*',
//     component: () => import('../views/Home.vue')
//   })
// }

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
