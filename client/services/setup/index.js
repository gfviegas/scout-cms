import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  get () {
    return app.$http.get(API_URL + 'setup', {params: {full: true}})
  },
  query (params) {
    return app.$http.get(API_URL + 'setup', {params: params})
  },
  update (data) {
    return app.$http.patch(API_URL + `setup`, data)
  }
}
