import Vue from 'vue'
import Resource from 'vue-resource'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import auth from './auth'

auth.checkAuth()

Vue.use(Resource)
Vue.use(NProgress)

Vue.prototype.$authenticated = () => {
  return !!(auth.user.authenticated)
}

Vue.http.interceptors.push((request, next) => {
  const token = auth.getToken()
  if (token) {
    request.headers.set('Authorization', 'Bearer ' + token)
  }

  next((response) => {
    if (response.status === 401) {
      router.push({ name: 'Auth' })
    }
  })
})

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
