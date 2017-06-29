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
import userService from './services/user'
import VeeValidate, { Validator } from 'vee-validate'
import ValidatePT from 'vee-validate/dist/locale/pt_BR'

const moment = require('moment')
require('moment/locale/pt-br')

Vue.use(require('vue-moment'), {
  moment
})

auth.checkAuth()

Vue.use(Resource)
Vue.use(NProgress)

Validator.addLocale(ValidatePT)
Validator.installDateTimeValidators(moment)
Vue.use(VeeValidate, {
  locale: 'pt_BR'
})

Validator.extend('unique_email', {
  getMessage: (field) => `Este email já está vinculado a um usuário`,
  validate: (value) => new Promise(resolve => {
    console.log(this.errors)
    userService.checkEmailExists(value)
    .then(response => {
      resolve({valid: !(response.body.exists)})
    })
  })
})

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

router.beforeEach((to, from, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }

  if (to.meta && to.meta.requiredRoles) {
    if (!auth.checkPermission(to.meta.requiredRoles)) {
      console.log('Você não tem a permissão necessária pra ver essa página')
      return next(false)
    }
  }

  return next()
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
