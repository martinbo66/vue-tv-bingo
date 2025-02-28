import { createRouter, createWebHistory } from 'vue-router'
import ShowsList from '../components/ShowsList.vue'
import ShowDetail from '../components/ShowDetail.vue'
import CreateShowPage from '../pages/CreateShowPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ShowsList
    },
    {
      path: '/show/:id',
      component: ShowDetail,
      props: true
    },
    {
      path: '/create',
      component: CreateShowPage
    }
  ]
})

export default router