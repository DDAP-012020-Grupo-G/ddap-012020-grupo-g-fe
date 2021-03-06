import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/shops',
    name: 'Shops',
    component: () => import('../pages/ShopsList.vue')
  },
  {
    path: '/shops/:shopId',
    name: 'Shop Detail',
    component: () => import('../pages/ShopDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/Cart.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/about', '/shops', '/shops/', '/login', '/register']
  const authRequired = publicPages.reduce( (authReq, page) => { 
    return authReq && !to.path.includes(page)
  }, true)
  const tryingToLogin = to.path === '/login';
  const tryingToRegister = to.path === '/register';
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn)
    return next('/login')

  if (tryingToLogin && loggedIn)
    return next('/')

  if (tryingToRegister && loggedIn)
    return next('/')

  next()
})

export default router
