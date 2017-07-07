<template lang="pug">
  div.box
    h3.title
      | Eventos
    form.search-container(v-on:submit.prevent="applySearch()")
      p.control.has-addons
        input.input(type="search" placeholder="Pesquisar" v-model="filter")
        button.button.is-primary(type="submit")
          span.icon
            i.fa.fa-search
    div.table-responsive
      confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteNews")
      table.table.is-narrow
        thead
          tr
            //- th ID
            th Slug
            th Título
            th Organização
            th Seção
            th Último Editor
            th Atualizado
            th Criado
            th
            th
        tbody
          tr(v-for="(event, index) in events")
            td
              span(v-if="event.slug") {{event.slug}}
            td
              span(v-if="event.title") {{event.title}}
            td
              span(v-if="event.hosts") {{event.hosts.join(', ')}}
            td
              span(v-if="event.section") {{event.section.join(', ')}}
            td
              span(v-if="event.last_updated_by") {{event.last_updated_by.name}}
            td
              span(v-if="event.updated_at") {{event.updated_at | moment("L LT")}}
            td
              span(v-if="event.created_at") {{event.created_at | moment("L LT")}}
            td.is-icon
              router-link(:to="{name: 'Editar Evento', params: {id: event._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(event, index)")
                i.fa.fa-trash
    div.pagination-container
      pagination(modifiers="is-centered" v-bind:currentPage="currentPage" v-bind:lastPage="totalPages" v-bind:routeName="routeName")
    p.add-button
      router-link(:to="{name: 'Criar Evento'}")
        button.button.is-medium-.is-primary Adicionar Evento
</template>

<script>
  import Vue from 'vue'
  import eventsService from '../../services/events'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import Pagination from '../../components/pagination/Pagination'

  const ITEMS_PER_PAGE = 15

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
        events: [],
        date: new Date(),

        showConfirmDeleteModal: false,
        confirmDeleteData: {}
      }
    },
    methods: {
      openConfirmDeleteModal (events, index) {
        this.confirmDeleteData = {
          reference: {
            id: events._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir a notícia ${events.title} ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteNews (reference) {
        eventsService.delete(reference.id)
        .then((response) => {
          openNotification({
            message: 'Notícia excluída com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.events.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir a notícia!',
            type: 'danger',
            duration: 3000
          })
        })
      },
      applySearch () {
        this.page = 1
        eventsService.query({page: this.page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
          this.events = response.body.events
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

      eventsService.query({page: page, limit: ITEMS_PER_PAGE, filter: filter}).then((response) => {
        console.log(response.body)
        vm.events = response.body.events
        vm.currentPage = response.body.meta.currentPage
        vm.limit = response.body.meta.limit
        vm.totalPages = response.body.meta.totalPages
        vm.filter = filter
      })
    },
    watch: {
      '$route' (to, from) {
        const page = to.query.page
        eventsService.query({page: page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
          this.news = response.body.news
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
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .add-button
    padding-top: 2rem
    text-align: center
</style>
