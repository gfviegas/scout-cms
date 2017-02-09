import {app} from '../../app'

export default {
  getUsers () {
    return app.$http.get('api/users')
  },
  createUser (data) {
    return app.$http.post('api/users', data)
  },
  deleteUser (id) {
    return app.$http.delete(`api/users/${id}`)
  },
  updateUser (id, data) {
    return app.$http.patch(`api/users/${id}`, data)
  }
}
