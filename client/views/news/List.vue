<template lang="pug">
  div.box
    h3.title
      | Notícias
    form.search-container(v-on:submit.prevent="applySearch()")
      p.control.has-addons
        input.input(type="search" placeholder="Pesquisar" v-model="filter")
        button.button.is-primary(type="submit")
          span.icon
            i.fa.fa-search
    div.table-responsive
      image-modal(:visible="showImageModal" v-bind:data="imageModalData" @close="closeImageModal" v-on:error="imageUpdateNotification(false)" v-on:success="imageUpdateNotification(true)" v-on:confirm="imageUpdated")
      confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteNews")
      table.table.is-narrow
        thead
          tr
            th ID
            th Slug
            th Título
            th Último Editor
            th Atualizado
            th Criado
            th Imagem
            th
            th
        tbody
          tr(v-for="(newContent, index) in news")
            td
              span(v-if="newContent._id") {{newContent._id}}
            td
              span(v-if="newContent.slug") {{newContent.slug}}
            td
              span(v-if="newContent.title") {{newContent.title}}
            td
              span(v-if="newContent.last_updated_by") {{newContent.last_updated_by.name}}
            td
              span(v-if="newContent.updated_at") {{newContent.updated_at | moment("L LT")}}
            td
              span(v-if="newContent.created_at") {{newContent.created_at | moment("L LT")}}
            td.is-icon
              a(@click="displayImageModal(newContent, index)")
                i.fa.fa-image
            td.is-icon
              router-link(:to="{name: 'Editar Notícia', params: {id: newContent._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(newContent, index)")
                i.fa.fa-trash
    div.pagination-container
      pagination(modifiers="is-centered" v-bind:currentPage="currentPage" v-bind:lastPage="totalPages" v-bind:routeName="routeName")
    p.add-button
      router-link(:to="{name: 'Criar Notícia'}")
        button.button.is-medium-.is-primary Adicionar Notícia
</template>

<script>
  import Vue from 'vue'
  import newsService from '../../services/news'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import ImageModal from '../../components/modals/Image'
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
      ImageModal,
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
        news: [],
        date: new Date(),

        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        showImageModal: false,
        imageModalData: {}
      }
    },
    methods: {
      openConfirmDeleteModal (news, index) {
        this.confirmDeleteData = {
          reference: {
            id: news._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir a notícia ${news.title} ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      displayImageModal (news, index) {
        this.imageModalData = {
          index: index,
          id: news._id,
          image: news.image
        }
        this.showImageModal = true
      },
      closeImageModal () {
        this.showImageModal = false
      },
      imageUpdateNotification (success) {
        const message = (success) ? 'Imagem atualizada com sucesso!' : 'Erro ao atualizar a imagem!'
        const type = (success) ? 'success' : 'danger'
        openNotification({
          message: message,
          type: type,
          duration: 3000
        })
      },
      imageUpdated (reference) {
        this.news[reference.index].image = reference.image
      },
      deleteNews (reference) {
        newsService.delete(reference.id)
        .then((response) => {
          openNotification({
            message: 'Notícia excluída com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.news.splice(reference.index, 1)
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
        newsService.query({page: this.page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
          this.news = response.body.news
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

      newsService.query({page: page, limit: ITEMS_PER_PAGE, filter: filter}).then((response) => {
        vm.news = response.body.news
        vm.currentPage = response.body.meta.currentPage
        vm.limit = response.body.meta.limit
        vm.totalPages = response.body.meta.totalPages
        vm.filter = filter
      })
    },
    watch: {
      '$route' (to, from) {
        const page = to.query.page
        newsService.query({page: page, limit: ITEMS_PER_PAGE, filter: this.filter}).then((response) => {
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
