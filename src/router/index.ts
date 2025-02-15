import { createRouter, createWebHistory } from 'vue-router'
import ShowsList from '../components/ShowsList.vue'
import ShowDetail from '../components/ShowDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ShowsList
    },
    {
      path: '/show/:index',
      component: ShowDetail,
      props: true
    }
  ]
})

export default router