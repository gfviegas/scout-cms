import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  get (id) {
    if (id) {
      return app.$http.get(API_URL + `events/${id}`)
    } else {
      return app.$http.get(API_URL + 'events')
    }
  },
  query (params) {
    return app.$http.get(API_URL + 'events', {params: params})
  },
  create (data) {
    return app.$http.post(API_URL + 'events', data)
  },
  delete (id) {
    return app.$http.delete(API_URL + `events/${id}`)
  },
  update (id, data) {
    return app.$http.patch(API_URL + `events/${id}`, data)
  },
  rescrape (id, data) {
    return app.$http.patch(API_URL + `events/${id}/rescrape`, data)
  },
  getSections () {
    return [
      'Ramo Lobinho',
      'Ramo Escoteiro',
      'Ramo Sênior',
      'Ramo Pioneiro',
      'Adultos'
    ]
  }
}
