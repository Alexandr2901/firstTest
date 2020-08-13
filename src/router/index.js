import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {path: '/Sudoku', name: 'Sudoku', component: () => import('../views/Sudoku.vue')},
  {path: '/', name: 'SudHomeoku', component: () => import('../views/Home.vue')}
];
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('../views/Home.vue')
  })
}

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
