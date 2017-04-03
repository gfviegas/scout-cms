<template lang="pug">
  div.box
    h3.title
      | Solicitações de Recompensas
    div.table-responsive
      confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteRequest")
      table.table.is-narrow
        thead
          tr
            th ID
            th Tipo
            th Recompensa
            th Agraciado(a)
            th Status
            th Atualizado
            th Criado
            th
            th
        tbody
          tr(v-for="(request, index) in requests")
            td {{request._id}}
            td {{typeFormated(request)}}
            td {{request.reward}}
            td {{request.gifted.name}}
            td {{statusFormated(request)}}
            td {{request.updated_at | moment("L LT")}}
            td {{request.created_at | moment("L LT")}}
            td.is-icon
              router-link(:to="{name: 'Atualizar Solicitação de Distintivo Semeador', params: {id: request._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(request, index)")
                i.fa.fa-trash
</template>

<script>
  import Vue from 'vue'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import rewardsService from '../../services/rewards'

  const NotificationComponent = Vue.extend(Notification)
  const openNotification = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 4500,
    container: '.notifications'
  }) => {
    return new NotificationComponent({
      el: document.createElement('div'),
      propsData
    })
  }

  export default {
    components: {
      ConfirmModal
    },
    data () {
      return {
        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        requests: [],
        date: new Date()
      }
    },
    methods: {
      openConfirmDeleteModal (request, index) {
        this.confirmDeleteData = {
          reference: {
            id: request._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir a solicitação "${request.reward} para ${request.gifted.name}" ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteRequest (reference) {
        rewardsService.delete(reference.id)
        .then((response) => {
          openNotification({
            message: 'Solicitação excluída com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.requests.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir a solicitação!',
            type: 'danger',
            duration: 3000
          })
        })
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
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      rewardsService.query({type: 'sower'}).then((response) => {
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
