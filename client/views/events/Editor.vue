<template lang="pug">
  div.box
    h3.title
      | {{text}} Evento
    form(v-on:submit.prevent="submitForm()")
      p.control.cache-control
        a.button.is-primary(@click="rescrape()" v-show="event && event._id")
          | Atualizar Cache
          span.icon
            i.fa.fa-refresh
      label.label Título*
      p.control
        input.input(type="text" placeholder="Título da Evento" v-model="event.title" v-validate="'required|min:4|max:100'" v-bind:class="{'is-danger': errors.has('title') }" name="title" data-vv-as="Título")
        span.help.is-danger(v-show="errors.has('title')") {{ errors.first('title') }}
      label.label Slug*
      p.control
        input.input(type="text" placeholder="Slug que aparecerá na URL" v-model="event.slug" v-validate="'required|min:4|max:100|alpha_dash'" v-on:keyup="clearSlugCustomErrors()" v-bind:class="{'is-danger': errors.has('slug') || customErrors.slug.length }" name="slug" data-vv-as="Slug")
        span.help.is-danger(v-show="errors.has('slug')") {{ errors.first('slug') }}
        span.help.is-danger(v-show="customErrors.slug.length") {{ customErrors.slug[0] }}
      label.label Local*
      p.control
        input.input(type="text" placeholder="Ex: Várzea das Flores - Betim" v-model="event.place" v-validate="'required|min:4|max:200'" v-bind:class="{'is-danger': errors.has('place') }" name="place" data-vv-as="Local")
        span.help.is-danger(v-show="errors.has('place')") {{ errors.first('place') }}
      label.label Data de Início*
      p.control
        cleave.input(v-bind:options="{date: true, datePattern: ['d', 'm', 'Y'] }" placeholder="DD/MM/AAAA" v-model="event.start_date" v-validate="'required|date_format:{DD/MM/YYYY}'" v-bind:class="{'is-danger': errors.has('start_date') }" name="start_date" data-vv-as="Data de Início")
        span.help.is-danger(v-show="errors.has('start_date')") {{ errors.first('start_date') }}
      //- label.label Data de Encerramento
      //- p.control
      //-   cleave.input(v-bind:options="{date: true, datePattern: ['d', 'm', 'Y'] }" placeholder="DD/MM/AAAA" v-model="event.end_date" v-validate="'date_format:{DD/MM/YYYY}'" v-bind:class="{'is-danger': errors.has('end_date') }" name="end_date" data-vv-as="Data de Encerramento")
      //-   span.help.is-danger(v-show="errors.has('end_date')") {{ errors.first('end_date') }}
      label.label Seções Participantes
      p.control
        multiselect(
          v-model="event.section",
          :options="options",
          :multiple="true",
          :taggable="true",
          @tag="addTag",
          placeholder="Escolha...",
          selected-label="Selecionado"
          select-label="Aperte enter para selecionar"
          deselect-label="Aperte enter para remover"
          tag-placeholder="Pressione enter pra escolher",
        )
        span.help.is-danger(v-show="errors.has('end_date')") {{ errors.first('end_date') }}
      label.label Conteúdo*
      quill-editor(:config="editorConfig" ref="eventEditor" v-model="event.description")
      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") {{text}} Evento
</template>

<script>
  import Vue from 'vue'
  import Cleave from 'vue-cleave'
  import Multiselect from 'vue-multiselect'
  import eventsService from '../../services/events'
  import { quillEditor } from 'vue-quill-editor'
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

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}],
    [{'align': []}],
    ['link'],
    ['clean']
  ]
  const editorConfig = {
    theme: 'snow',
    bounds: document.body,
    modules: {
      toolbar: toolbarOptions
    },
    formats: ['bold', 'italic', 'underline', 'strike', 'color', 'size', 'header', 'align', 'link']
  }

  export default {
    components: {
      Cleave,
      Multiselect,
      quillEditor
    },
    beforeRouteEnter (to, from, next) {
      if (to.name === 'Editar Evento') {
        eventsService.get(to.params.id).then((response) => {
          next(vm => {
            vm.text = 'Editar'
            vm.news = response.body
          })
        }, (response) => {
          next(false)
        })
      } else {
        next(vm => {
          vm.text = 'Cadastrar'
        })
      }
    },
    data () {
      return {
        options: eventsService.getSections(),
        text: '',
        event: {
          title: '',
          slug: '',
          description: '',
          place: '',
          host: '',
          image: '',
          start_date: '',
          end_date: '',
          section: [],
          files: []
        },
        customErrors: {
          slug: []
        },
        editorConfig
      }
    },
    methods: {
      submitForm () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          if (this.text === 'Editar') {
            this.editEvent()
          } else {
            this.addEvent()
          }
        })
      },
      editEvent () {
        eventsService.update(this.event._id, this.event)
        .then(response => {
          openNotification({
            message: 'Evento atualizada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Eventos'})
        }, response => {
          let message = 'Erro ao atualizar o evento!'

          if (response.status === 409) {
            message = 'Este slug já está sendo utilizado!'
            this.customErrors.slug.push(message)
          }

          openNotification({
            message: message,
            type: 'danger',
            duration: 3000
          })
        })
      },
      addEvent () {
        eventsService.create(this.event)
        .then(response => {
          openNotification({
            message: 'Evento criado com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Eventos'})
        }, response => {
          let message = 'Erro ao criar o evento!'

          if (response.status === 409) {
            message = 'Este slug já está sendo utilizado!'
            this.customErrors.slug.push(message)
          }

          openNotification({
            message: message,
            type: 'danger',
            duration: 3000
          })
        })
      },
      clearSlugCustomErrors () {
        if (this.customErrors && this.customErrors.slug.length) {
          this.customErrors.slug = []
        }
      },
      addTag (newTag) {
        const tag = {
          name: newTag,
          code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        }
        this.taggingOptions.push(tag)
        this.taggingSelected.push(tag)
      },
      rescrape () {
        eventsService.rescrape(this.event._id)
        .then(response => {
          console.log(response)
          openNotification({
            message: 'Cache do evento atualizado com sucesso!',
            type: 'success',
            duration: 3000
          })
        }, response => {
          console.log(response)
          openNotification({
            message: 'Erro ao atualizar o cache do evento!',
            type: 'danger',
            duration: 3000
          })
        })
      }
    }
  }
</script>

<style lang="styl" scoped>
  @import "~quill/assets/snow"
  .submit-button
    padding-top: 2rem
    text-align: center
  .ql-snow .ql-out-bottom
    visibility: visible
  .cache-control
    display: flex
    justify-content: flex-end

</style>
