import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  get (id) {
    if (id) {
      return app.$http.get(API_URL + `news/${id}`)
    } else {
      return app.$http.get(API_URL + 'news')
    }
  },
  create (data) {
    return app.$http.post(API_URL + 'news', data)
  },
  delete (id) {
    return app.$http.delete(API_URL + `news/${id}`)
  },
  update (id, data) {
    return app.$http.patch(API_URL + `news/${id}`, data)
  }
}
