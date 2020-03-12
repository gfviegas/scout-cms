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
        cleave.input(v-bind:options="{date: true, datePattern: ['d', 'm', 'Y'] }" placeholder="DD/MM/AAAA" v-model="event.start_date" v-validate="`required|date_format:DD/MM/YYYY|date_between:${today},${lastDay}`" v-bind:class="{'is-danger': errors.has('start_date') }" data-vv-name="start_date" data-vv-as="Data de Início")
        span.help.is-danger(v-show="errors.has('start_date')") {{ errors.first('start_date') }}
      label.label Data de Encerramento
      p.control
        cleave.input(v-bind:options="{date: true, datePattern: ['d', 'm', 'Y'] }" placeholder="DD/MM/AAAA" v-model="event.end_date" v-validate="`date_format:DD/MM/YYYY|date_between:${this.event.start_date},${lastDay}`" v-bind:class="{'is-danger': errors.has('end_date') }"  data-vv-name="end_date" data-vv-as="Data de Encerramento")
        span.help.is-danger(v-show="errors.has('end_date')") {{ errors.first('end_date') }}
      label.label Seções Participantes*
      p.control
        multiselect(
          v-model="event.section",
          :options="sections",
          :multiple="true",
          :taggable="true",
          @tag="addTag",
          placeholder="Escolha...",
          selected-label="Selecionado"
          select-label="Aperte enter para selecionar"
          deselect-label="Aperte enter para remover"
          tag-placeholder="Pressione enter pra escolher",
          v-validate="'required'",
          v-bind:class="{'is-danger': errors.has('section') }",
          data-vv-name="section",
          data-vv-as="Seções Participantes"
        )
        span.help.is-danger(v-show="errors.has('section')") {{ errors.first('section') }}
      label.label Tipo*
      p.control
        multiselect(
          v-model="event.hosts",
          :options="hosts",
          :multiple="true",
          :taggable="true",
          @tag="addTag",
          placeholder="Escolha...",
          selected-label="Selecionado"
          select-label="Aperte enter para selecionar"
          deselect-label="Aperte enter para remover"
          tag-placeholder="Pressione enter pra escolher",
          v-validate="'required'",
          v-bind:class="{'is-danger': errors.has('hosts') }",
          data-vv-name="hosts",
          data-vv-as="Tipo"
        )
        span.help.is-danger(v-show="errors.has('hosts')") {{ errors.first('hosts') }}
      hr
      h5.title.is-5 Arquivos
      div.box(v-for="(file, index) in event.files")
        div.file-box
          span.subtitle.is-6 Arquivo # {{index+1}}
          a.file-delete-link(@click="removeFile(index)")
            span.icon
              i.fa.fa-trash
        label.label Título
        p.control
          input.input(type="text" placeholder="Título do Arquivo" v-model="file.title" v-validate="'required|min:4|max:100'" v-bind:class="{'is-danger': errors.has('title#' + index) }" v-bind:name="'title#' + index" data-vv-as="Título")
          span.help.is-danger(v-show="errors.has('title#' + index)") {{ errors.first('title#' + index) }}
        label.label URL Arquivo
        p.control
          input.input(type="text" placeholder="Link para o Arquivo" v-model="file.path" v-validate="'required|min:4|max:100|url'" v-bind:class="{'is-danger': errors.has('file#' + index) }" v-bind:name="'file#' + index" data-vv-as="URL")
          span.help.is-danger(v-show="errors.has('file#' + index)") {{ errors.first('file#' + index) }}
        br
      p.control.submit-button
        a.button.is-info(@click="addFile()") Adicionar Arquivo
      hr
      h5.title.is-5 Imagem
      div.box.image-box
        p.image-input
          input#image-upload(type="file" @change="changeImage" accept="image/*")
          label.button.is-info(for="image-upload") Alterar Imagem
        div.image-container
          figure.image.is-square
            img(:src="getEventImage()")
      hr
      label.label Descrição*
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
            vm.event = response.body
            vm.event.start_date = Vue.moment(response.body.start_date).format('DD/MM/YYYY')
            if (vm.event.end_date && vm.event.end_date.length) vm.event.end_date = Vue.moment(response.body.end_date).format('DD/MM/YYYY')
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
        today: Vue.moment(Date.now()).format('DD/MM/YYYY'),
        lastDay: Vue.moment(Date.now()).add(4, 'y').format('DD/MM/YYYY'),
        sections: eventsService.getSections(),
        hosts: eventsService.getHosts(),
        text: null,
        imagePath: `${process.env.IMG_URL}/events/no_image.jpg`,
        event: {
          title: null,
          slug: null,
          description: null,
          place: null,
          hosts: [],
          image: null,
          start_date: null,
          end_date: null,
          sections: [],
          files: [{path: null, title: null}]
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
      createFormData () {
        const formData = new window.FormData()
        formData.append('title', this.event.title)
        formData.append('slug', this.event.slug)
        formData.append('description', this.event.description)
        formData.append('place', this.event.place)
        formData.append('start_date', this.event.start_date)
        if (this.event.end_date.length) formData.append('end_date', this.event.end_date)
        formData.append('hosts', JSON.stringify(this.event.hosts))
        formData.append('section', JSON.stringify(this.event.section))
        formData.append('files', JSON.stringify(this.event.files))
        if (this.event.image.name) formData.append('image', this.event.image, this.event.image.name)

        return formData
      },
      editEvent () {
        const formData = this.createFormData()

        eventsService.update(this.event._id, formData)
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
        const formData = this.createFormData()

        eventsService.create(formData)
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
      addFile () {
        this.event.files.push({path: '', title: ''})
      },
      removeFile (index) {
        this.event.files.splice(index, 1)
      },
      getEventImage () {
        if (this.event.image && this.event.image.length) {
          return `${process.env.IMG_URL}${this.event.image}`
        } else {
          return this.imagePath
        }
      },
      changeImage (e) {
        const files = e.srcElement.files || e.dataTransfer.files
        if (files) {
          this.imagePath = window.URL.createObjectURL(files[0])
          this.event.image = files[0]
        }
      },
      rescrape () {
        eventsService.rescrape(this.event._id)
        .then(response => {
          openNotification({
            message: 'Cache do evento atualizado com sucesso!',
            type: 'success',
            duration: 3000
          })
        }, response => {
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
  .file-box
    padding-bottom: 1rem
    .file-delete-link
      float: right
  .image-box
    display: flex
    flex-direction: column
    .image-input
      align-self: center
      padding-bottom: 1.5rem
      #image-upload
        visibility: hidden
        position: absolute
    .image-container
      width: 480px
      display: flex
      align-self: center
      figure, image
        width: 480px
</style>
