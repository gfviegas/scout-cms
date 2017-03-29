<template lang="pug">
  div.box
    h3.title
      | Solicitações de Recompensas
    div.table-responsive
      table.table.is-narrow
        thead
          tr
            th ID
            th Tipo
            th Recompensa
            th Status
            th Atualizado
            th Criado
            th
        tbody
          tr(v-for="(request, index) in requests")
            td {{request._id}}
            td {{typeFormated(request)}}
            td {{request.reward}}
            td {{statusFormated(request)}}
            td {{request.updated_at | moment("L LT")}}
            td {{request.created_at | moment("L LT")}}
            td.is-icon
              router-link(:to="{name: 'Atualizar Solicitação', params: {id: request._id}}")
                i.fa.fa-pencil
</template>

<script>
  // import Vue from 'vue'
  import rewardsService from '../../services/rewards'

  export default {
    data () {
      return {
        requests: [],
        date: new Date()
      }
    },
    methods: {
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
        if (!request || !request.status) return false
        switch (request.type) {
          case 'badge':
            return 'Distintivo Especial'
          case 'reward':
            return 'Condecoração'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      rewardsService.get().then((response) => {
        next(vm => {
          vm.requests = response.body
        })
      }, (response) => {
        next(false)
      })
    }
  }
</script>

<style lang="sass" scoped>
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .add-button
    padding-top: 2rem
    text-align: center
</style>
