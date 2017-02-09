import {app} from '../../app'

export default {
  get () {
    return app.$http.get('api/news')
  },
  create (data) {
    return app.$http.post('api/news', data)
  },
  delete (id) {
    return app.$http.delete(`api/news/${id}`)
  },
  update (id, data) {
    return app.$http.patch(`api/news/${id}`, data)
  }
}
