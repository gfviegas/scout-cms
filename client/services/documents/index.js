import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  get (id) {
    if (id) {
      return app.$http.get(API_URL + `documents/${id}`)
    } else {
      return app.$http.get(API_URL + 'documents')
    }
  },
  query (params) {
    return app.$http.get(API_URL + 'documents', {params: params})
  },
  update (id, data) {
    return app.$http.patch(API_URL + `documents/${id}`, data)
  },
  delete (id) {
    return app.$http.delete(API_URL + `documents/${id}`)
  }
}
