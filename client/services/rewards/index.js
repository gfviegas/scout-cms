import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  get (id) {
    if (id) {
      return app.$http.get(API_URL + `rewards/${id}`)
    } else {
      return app.$http.get(API_URL + 'rewards')
    }
  },
  query (params) {
    return app.$http.get(API_URL + 'rewards', {params: params})
  },
  update (id, data) {
    return app.$http.patch(API_URL + `rewards/${id}`, data)
  },
  delete (id) {
    return app.$http.delete(API_URL + `rewards/${id}`)
  }
}
