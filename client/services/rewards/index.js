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
  update (id, data) {
    return app.$http.patch(API_URL + `rewards/${id}`, data)
  }
}
