import Vue from 'vue'
import Router from 'vue-router'
import menuModule from 'vuex-store/modules/menu'

import auth from '../auth'

Vue.use(Router)

// Menu should have 2 levels.
const generateRoutesFromMenu = (menu = [], routes = []) => {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}

const appRouter = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'Auth',
      path: '/auth',
      component: require('../views/auth/Auth')
    },
    {
      name: 'Reset Password',
      path: '/auth/reset',
      component: require('../views/auth/Reset')
    },
    {
      name: 'Update Password',
      path: '/auth/update/:token',
      component: require('../views/auth/Update')
    },
    {
      name: 'Home',
      path: '/',
      component: require('../views/Home')
    },
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: '/'
    }
  ]
})

const authRoutes = ['Auth', 'Reset Password', 'Update Password']

appRouter.beforeEach((to, from, next) => {
  // If not authenticated and trying to see anything but auth, deny it.
  if ((authRoutes.indexOf(to.name) < 0) && !auth.user.authenticated) {
    next({ path: '/auth' })

  // And if authenticated, don't show the auth page
  } else if ((authRoutes.indexOf(to.name) >= 0) && auth.user.authenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default appRouter
