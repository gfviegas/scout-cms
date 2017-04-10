<template lang="pug">
  div.box
    h3.title
      | {{text}} Documento
    form(v-on:submit.prevent="submitForm()" novalidate)
      br
      label.label Tipo
      p.control
        select.select(name="type" v-model="document.type" v-validate="'required'" data-vv-as="Tipo do Documento" v-bind:class="{'is-danger': errors.has('type')}")
          option(default value="") Selecione...
          option(value="book") Apostila
          option(value="ordinance") Portaria
          option(value="other") Outro
        small.help.is-info(v-if="!errors.has('type') && document.type") Descrição do tipo: #[strong {{getTypeDescription(document)}}]
        span.help.is-danger(v-else) {{ errors.first('type') }}
      label.label Título
      p.control
        input.input(type="text" name="title" v-model="document.title" v-validate="'required'" data-vv-as="Título do Documento" v-bind:class="{'is-danger': errors.has('title')}")
        span.help.is-danger(v-if="errors.has('title')") {{ errors.first('title') }}
      label.label Descrição
      p.control
        input.input(type="text" name="description" v-model="document.description")
      label.label Link do Arquivo
      p.control
        input.input(type="text" name="file" v-model="document.file" v-validate="'required|url'" data-vv-as="Link do Arquivo" v-bind:class="{'is-danger': errors.has('file')}")
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
        document: {
          type: '',
          title: '',
          description: '',
          file: ''
        },
        validations: {},
        type: 'create',
        text: 'Cadastrar'
      }
    },
    methods: {
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
        documentsService.create(this.document)
        .then(response => {
          openNotification({
            message: 'Documento criado com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Documentos'})
        }, response => {
          let message = 'Erro ao criar o documento!'

          openNotification({
            message: message,
            type: 'danger',
            duration: 3000
          })
        })
      },
      edit () {
        documentsService.replace(this.document._id, this.document)
        .then(response => {
          openNotification({
            message: 'Documento atualizado com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Documentos'})
        }, response => {
          let message = 'Erro ao atualizar o documento!'

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
