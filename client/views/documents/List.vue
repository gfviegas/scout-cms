<template lang="pug">
  div.box
    h3.title
      | Documentos
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
    p.add-button
      router-link(:to="{name: 'Criar Documento'}")
        button.button.is-medium-.is-primary Criar Documento
</template>

<script>
  import Vue from 'vue'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import documentsService from '../../services/documents'

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
        if (!document || !document.type) return false
        switch (document.type) {
          case 'book':
            return 'Apostila'
          case 'notice':
            return 'Edital'
          case 'ordinance':
            return 'Portaria'
          case 'other':
            return 'Outro'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      documentsService.get().then((response) => {
        next(vm => {
          vm.documents = response.body
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
