<template lang="pug">
  div.box
    h3.title
      | {{text}} Notícia
    form(v-on:submit.prevent="submitForm()")
      p.control.cache-control
        a.button.is-primary(@click="rescrape()" v-show="news && news._id")
          | Atualizar Cache
          span.icon
            i.fa.fa-refresh
      label.label Título
      p.control
        input.input(type="text" placeholder="Título da Notícia" v-model="news.title" v-validate="'required|min:4|max:100'" v-bind:class="{'is-danger': errors.has('title') }" name="title")
        span.help.is-danger(v-show="errors.has('title')") {{ errors.first('title') }}
      label.label Slug
      p.control
        input.input(type="text" placeholder="Slug que aparecerá na URL" v-model="news.slug" v-validate="'required|min:4|max:100|alpha_dash'" v-on:keyup="clearSlugCustomErrors()" v-bind:class="{'is-danger': errors.has('slug') || customErrors.slug.length }" name="slug")
        span.help.is-danger(v-show="errors.has('slug')") {{ errors.first('slug') }}
        span.help.is-danger(v-show="customErrors.slug.length") {{ customErrors.slug[0] }}
      label.label Conteúdo
      quill-editor(:config="editorConfig" ref="newsEditor" v-model="news.content")
      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") {{text}} Notícia
</template>

<script>
  import Vue from 'vue'
  import newsService from '../../services/news'
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
      quillEditor
    },
    beforeRouteEnter (to, from, next) {
      if (to.name === 'Editar Notícia') {
        newsService.get(to.params.id).then((response) => {
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
        text: null,
        news: {
          title: null,
          slug: null,
          content: null
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
            this.editNews()
          } else {
            this.createNews()
          }
        })
      },
      editNews () {
        newsService.update(this.news._id, this.news)
        .then(response => {
          openNotification({
            message: 'Notícia atualizada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Notícias'})
        }, response => {
          let message = 'Erro ao atualizar a notícia!'

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
      createNews () {
        newsService.create(this.news)
        .then(response => {
          openNotification({
            message: 'Notícia criada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Notícias'})
        }, response => {
          let message = 'Erro ao criar a notícia!'

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
      rescrape () {
        newsService.rescrape(this.news._id)
        .then(response => {
          console.log(response)
          openNotification({
            message: 'Cache da notícia atualizado com sucesso!',
            type: 'success',
            duration: 3000
          })
        }, response => {
          console.log(response)
          openNotification({
            message: 'Erro ao atualizar o cache da notícia!',
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
