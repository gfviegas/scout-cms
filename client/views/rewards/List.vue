<template lang="pug">
  div.box
    h3.title
      | Solicitações de Recompensas
    form.search-container(v-on:submit.prevent="applySearch()")
      p.control.has-addons
        input.input(type="search" placeholder="Pesquisar" v-model="filter")
        button.button.is-primary(type="submit")
          span.icon
            i.fa.fa-search
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
              router-link(:to="{name: 'Atualizar Solicitação de Recompensa', params: {id: request._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(request, index)")
                i.fa.fa-trash
    div.pagination-container
      pagination(modifiers="is-centered" v-bind:currentPage="currentPage" v-bind:lastPage="totalPages" v-bind:routeName="routeName")
</template>

<script>
  import Vue from 'vue'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import rewardsService from '../../services/rewards'
  import Pagination from '../../components/pagination/Pagination'

  const ITEMS_PER_PAGE = 15
  const PAGE_TYPE = 'reward'

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
      ConfirmModal,
      Pagination
    },
    data () {
      return {
        filter: '',
        currentPage: 1,
        limit: 4,
        totalPages: 1,
        routeName: this.$route.name,
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
        }
      },
      applySearch () {
        this.page = 1
        rewardsService.query({page: this.page, limit: ITEMS_PER_PAGE, filter: this.filter, type: PAGE_TYPE}).then((response) => {
          this.requests = response.body.requests
          this.currentPage = response.body.meta.currentPage
          this.limit = response.body.meta.limit
          this.totalPages = response.body.meta.totalPages
        })
      }
    },
    created () {
      const vm = this
      const page = this.$route.query.page || 1
      const filter = this.$route.query.filter || ''

      rewardsService.query({page: page, limit: ITEMS_PER_PAGE, filter: filter, type: PAGE_TYPE}).then((response) => {
        vm.requests = response.body.requests
        vm.currentPage = response.body.meta.currentPage
        vm.limit = response.body.meta.limit
        vm.totalPages = response.body.meta.totalPages
        vm.filter = filter
      })
    },
    watch: {
      '$route' (to, from) {
        const page = to.query.page
        rewardsService.query({page: page, limit: ITEMS_PER_PAGE, filter: this.filter, type: PAGE_TYPE}).then((response) => {
          this.requests = response.body.requests
          this.currentPage = response.body.meta.currentPage
          this.limit = response.body.meta.limit
          this.totalPages = response.body.meta.totalPages
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .search-container
    padding: 1rem 0
    display: flex
    justify-content: center
    .control
      width: 50%
      input
        width: 100%
  .pagination-container
    padding: 2rem
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .add-button
    padding-top: 2rem
    text-align: center
</style>
