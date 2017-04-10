<template lang="pug">
  div.box
    h3.title
      | {{text}} Documento
    form(v-on:submit.prevent="submitForm()" novalidate)
      br
      label.label Tipo
      p.control
        select(name="type" v-model="document.type" v-validate="'required'" data-vv-as="Tipo do Documento" v-bind:class="{'is-danger': errors.has('type')}")
          option(default value="") Selecione...
          option(value="book") Apostila
          option(value="notice") Edital
          option(value="ordinance") Portaria
          option(value="other") Outro
        span.help.is-danger(v-if="errors.has('type')") {{ errors.first('type') }}
        small.help.is-info(v-else) Descrição do tipo: #[strong {{getTypeDescription(document)}}]
      label.label Título
      p.control
        input(type="text" name="title" v-model="document.title" v-validate="'required'" data-vv-as="Título do Documento" v-bind:class="{'is-danger': errors.has('title')}")
        span.help.is-danger(v-if="errors.has('title')") {{ errors.first('title') }}
      label.label Descrição
      p.control
        input(type="text" name="description" v-model="document.description")
      label.label Arquivo
      p.control
        input(type="file" name="file" @change="fileChanged" v-validate="'required'" data-vv-as="Arquivo do Documento" v-bind:class="{'is-danger': errors.has('file')}")
          span.help.is-danger(v-if="errors.has('file')") {{ errors.first('file') }}

      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Salvar
</template>

<script>
  import Vue from 'vue'
  import documentsService from '../../services/documents'
  import Notification from 'vue-bulma-notification'
  // import router from '../../router'

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
    beforeRouteEnter (to, from, next) {
      if (to.name === 'Atualizar Documento') {
        documentsService.get(to.params.id).then((response) => {
          next(vm => {
            vm.type = 'edit'
            vm.text = 'Editar'
            vm.document = response.body
          })
        }, (response) => {
          next(false)
        })
      } else {
        next(vm => {
          vm.type = 'create'
          vm.text = 'Cadastrar'
        })
      }
    },
    data () {
      return {
        document: {},
        validations: {},
        type: 'create'
        text: 'Cadastrar'
      }
    },
    methods: {
      typeFormated (request) {
        if (!request || !request.status) return false
        switch (request.type) {
          case 'book':
            return 'Apostila'
          case 'notice':
            return 'Edital'
          case 'ordinance':
            return 'Portaria'
          case 'other':
            return 'Outro'
        }
      },
      getTypeDescription (document) {
        if (!document || !document.type) return false
        switch (document.type) {
          case 'book':
            return 'Apostila de Cursos, conteúdo educativo e afins.'
          case 'notice':
            return 'Edital de atividades, eventos e etc.'
          case 'ordinance':
            return 'Portarias oficiais emitidas pela RMG.'
          case 'other':
            return 'Outros tipos de documentos, incomuns, não categorizados.'
        }
      },
      fileChanged (e) {
        const files = e.srcElement.files || e.dataTransfer.files
        if (files[0]) {
          this.document.file = files[0]
        }
      },
      submitForm () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          if (this.type === 'edit') {
            this.edit()
          } else {
            this.create()
          }
        })
      },
      create () {
        const formData = new window.FormData()
        formData.append('file', this.document.file, this.document.file.name)
        formData.append('title', this.document.title)
        formData.append('description', this.document.description)
        formData.append('type', this.document.type)
        documentsService.create(formData)
        .then(response => {

        }, response => {

        })
      },
      edit () {
        const formData = new window.FormData()
        formData.append('file', this.document.file, this.document.file.name)
        formData.append('title', this.document.title)
        formData.append('description', this.document.description)
        formData.append('type', this.document.type)
        documentsService.replace(this.document._id, formData)
        .then(response => {
          openNotification({
            message: 'Solicitação atualizada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Recompensas'})
        }, response => {
          let message = 'Erro ao atualizar a solicitação!'

          openNotification({
            message: message,
            type: 'danger',
            duration: 3000
          })
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .submit-button
    padding-top: 2rem
    text-align: center
</style>
