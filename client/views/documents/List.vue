<template lang="pug">
  div.box
    h3.title
      | Documentos
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
            th Título
            th Tipo
            th Arquivo
            th Último Editor
            th Atualizado
            th Criado
            th
            th
        tbody
          tr(v-for="(document, index) in documents")
            td
              span(v-if="document.title") {{document.title}}
            td
              span(v-if="document.type") {{typeFormated(document)}}
            td
              span(v-if="document.file") {{document.file}}
            td
              span(v-if="document.last_updated_by") {{document.last_updated_by.name}}
            td
              span(v-if="document.updated_at") {{document.updated_at | moment("L LT")}}
            td
              span(v-if="document.created_at") {{document.created_at | moment("L LT")}}
            td.is-icon
              router-link(:to="{name: 'Atualizar Documento', params: {id: document._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(document, index)")
                i.fa.fa-trash
    div.pagination-container
      pagination(modifiers="is-centered" v-bind:currentPage="currentPage" v-bind:lastPage="totalPages" v-bind:routeName="routeName")
    p.add-button
      router-link(:to="{name: 'Criar Documento'}")
        button.button.is-medium-.is-primary Criar Documento
</template>

<script>
  import Vue from 'vue'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import documentsService from '../../services/documents'
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
        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        documents: [],
        date: new Date()
      }
    },
    methods: {
      openConfirmDeleteModal (document, index) {
        this.confirmDeleteData = {
          reference: {
            id: document._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir o documento "${document.title}" ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteRequest (reference) {
        documentsService.delete(reference.id)
        .then((response) => {
          openNotification({
            message: 'Documento excluído com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.documents.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir o documento!',
            type: 'danger',
            duration: 3000
          })
        })
      },
      typeFormated (document) {
        return documentsService.typeFormated(document)
      },
      applySearch () {
        this.page = 1
        documentsService.query({page: this.page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
          this.documents = response.body.documents
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

      documentsService.query({page: page, limit: ITEMS_PER_PAGE, filter: filter}).then((response) => {
        vm.documents = response.body.documents
        vm.currentPage = response.body.meta.currentPage
        vm.limit = response.body.meta.limit
        vm.totalPages = response.body.meta.totalPages
        vm.filter = filter
      })
    },
    watch: {
      '$route' (to, from) {
        const page = to.query.page
        documentsService.query({page: page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
          this.documents = response.body.documents
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
