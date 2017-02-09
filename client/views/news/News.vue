<template lang="pug">
  div.box
    h3.title
      | Notícias
    div.table-responsive
      confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteNews")
      table.table.is-narrow
        thead
          tr
            th ID
            th Título
            th Último Editor
            th Atualizado
            th Criado
            th
            th
        tbody
          tr(v-for="(newContent, index) in news")
            td {{newContent._id}}
            td {{newContent.title}}
            td {{newContent.last_updated_by.name}}
            td {{newContent.updated_at}}
            td {{newContent.created_at}}
            td.is-icon
              a
                i.fa.fa-pencil
            td.is-icon
              a(@click="openConfirmDeleteModal(newContent, index)")
                i.fa.fa-trash
</template>

<script>
  import Vue from 'vue'
  import newsService from '../../services/news'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'

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
        news: [],

        showConfirmDeleteModal: false,
        confirmDeleteData: {}
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
      deleteNews () {
        openNotification({
          message: 'Notícia excluída com sucesso!',
          type: 'success',
          duration: 3000
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

<style lang="sass">
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
</style>
