import { createRouter, createWebHashHistory } from 'vue-router'
import ShowsList from '../components/ShowsList.vue'
import ShowDetail from '../components/ShowDetail.vue'
import CreateShowPage from '../pages/CreateShowPage.vue'
import BingoCard from '../pages/BingoCard.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: ShowsList
    },
    {
      path: '/show/:id',
      component: BingoCard,
      props: true
    },
    {
      path: '/show/:id/edit',
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