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
  create (data) {
    return app.$http.post(API_URL + 'documents', data)
  },
  update (id, data) {
    return app.$http.patch(API_URL + `documents/${id}`, data)
  },
  replace (id, data) {
    return app.$http.put(API_URL + `documents/${id}`, data)
  },
  delete (id) {
    return app.$http.delete(API_URL + `documents/${id}`)
  },
  typeFormated (doc) {
    if (!doc || !doc.type) return false
    switch (doc.type) {
      case 'book':
        return 'Apostila'
      case 'notice':
        return 'Edital'
      case 'resolution':
        return 'Resolução'
      case 'ordinance':
        return 'Portaria'
      case 'balance':
        return 'Balanço Financeiro'
      case 'minute':
        return 'Ata'
      case 'other':
        return 'Outro'
    }
  },
  typeDescription (doc) {
    if (!doc || !doc.type) return false
    switch (doc.type) {
      case 'book':
        return 'Apostila de Cursos, conteúdo educativo e afins.'
      case 'notice':
        return 'Edital de atividades, eventos e etc.'
      case 'resolution':
        return 'Resoluções oficiais emitidas pela RMG.'
      case 'ordinance':
        return 'Portarias oficiais emitidas pela RMG.'
      case 'balance':
        return 'Balanços financeiros oficiais emitidos pela RMG.'
      case 'minute':
        return 'Atas de assembleias e reuniões relevantes da RMG.'
      case 'other':
        return 'Outros tipos de documentos, incomuns, não categorizados.'
    }
  }
}
