import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PalettesPage from '../views/PalettesPage.vue'
import PaletteDetails from '../views/PaletteDetails.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/palettes',
    name: 'Palettes',
    component: PalettesPage
  },
  {
    path: '/palettes/:id',
    name: 'PaletteDetails',
    component: PaletteDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
