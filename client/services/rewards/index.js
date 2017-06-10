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
  },
  statusFormated (request) {
    if (!request || !request.status) return false
    switch (request.status) {
      case 'waiting':
        return 'Aguardando'
      case 'analyzing':
        return 'Analisando'
      case 'issued':
        return 'Emitido'
      case 'rejected':
        return 'Indeferido'
      case 'approved':
        return 'Deferido'
    }
  },
  typeFormated (request) {
    if (!request || !request.type) return false
    switch (request.type) {
      case 'badge':
        return 'Distintivo Especial'
      case 'reward':
        return 'Condecoração'
      case 'sower':
        return 'Distintivo de Semeador'
      case 'level':
        return 'Solicitação de Nível'
      case 'book':
        return 'Envio de Caderno/Projeto'
    }
  },
  getStatusMessage (request) {
    if (!request || !request.status) return false
    switch (request.status) {
      case 'waiting':
        return 'A solicitação foi recebida e está aguardando análise.'
      case 'analyzing':
        return 'A Região Escoteira está analisando a sua solicitação.'
      case 'issued':
        return 'A solicitação foi aprovada e a sua recompensa já foi emitida.'
      case 'rejected':
        return 'A solicitação foi negada.'
      case 'approved':
        return 'A solicitação foi aprovada e aguarda emissão.'
    }
  }
}
