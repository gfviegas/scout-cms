import {app} from '../../app'

const API_URL = process.env.API_URL

export default {
  getUsers () {
    return app.$http.get(API_URL + 'users')
  },
  createUser (data) {
    return app.$http.post(API_URL + 'users', data)
  },
  deleteUser (id) {
    return app.$http.delete(API_URL + `users/${id}`)
  },
  updateUser (id, data) {
    return app.$http.patch(API_URL + `users/${id}`, data)
  },
  checkEmailExists (email) {
    return app.$http.post(API_URL + 'users/email', {email: email})
  },
  getRoles () {
    return [
      {name: 'Administrador', value: 'admin'},
      {name: 'Condecorações e Recompensas', value: 'rewards'},
      {name: 'Distintivos Especiais', value: 'badges'},
      {name: 'Distintivo de Semeador', value: 'sower'},
      {name: 'Solicitação de Nível', value: 'level'},
      {name: 'Solicitação de Caderno/Projeto', value: 'book'},
      {name: 'Criador de Conteúdo', value: 'content'}
    ]
  }
}
