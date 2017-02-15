<template lang="pug">
  div.box
    h3.title
      | Notícias
    div.table-responsive
      image-modal(:visible="showImageModal" v-bind:data="imageModalData" @close="closeImageModal" v-on:error="imageUpdateNotification(false)" v-on:success="imageUpdateNotification(true)" v-on:confirm="imageUpdated")
      confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteNews")
      table.table.is-narrow
        thead
          tr
            //- th ID
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
            //- td {{newContent._id}}
            td {{newContent.slug}}
            td {{newContent.title}}
            td {{newContent.last_updated_by.name}}
            td {{newContent.updated_at | moment("L LT")}}
            td {{newContent.created_at | moment("L LT")}}
            td.is-icon
              a(@click="displayImageModal(newContent, index)")
                i.fa.fa-image
            td.is-icon
              router-link(:to="{name: 'Editar Notícia', params: {id: newContent._id}}")
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(newContent, index)")
                i.fa.fa-trash
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
      ConfirmModal
    },
    data () {
      return {
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
      }
    },
    beforeRouteEnter (to, from, next) {
      newsService.get().then((response) => {
        next(vm => {
          vm.news = response.body
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
