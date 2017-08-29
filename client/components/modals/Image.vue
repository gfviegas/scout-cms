<template lang="pug">
  image-modal(:visible="visible" @close="close" transition="roll")
    div.container-img-modal
      input#image-upload(type="file" @change="changeImage" accept="image/*")
      img(:src="imgUrl")
      div.change-button
        div.control.is-grouped.submit-group(v-if="hasImageInput")
          button.button.is-success(@click="uploadImage()")
            span.icon.is-small
              i.fa.fa-check
          button.button.is-danger(@click="cancelUpload()")
            span.icon.is-small
              i.fa.fa-times
        div(v-else)
          label.button.is-warning(for="image-upload")
            | Editar 
            span.icon.is-small
              i.fa.fa-pencil
</template>

<script>
  import { ImageModal } from 'vue-bulma-modal'
  import newsService from '../../services/news'
  const IMG_URL = process.env.IMG_URL

  export default {
    components: {
      ImageModal
    },
    props: {
      data: Object,
      visible: Boolean
    },
    data () {
      return {
        imageInput: '',
        oldImage: '',
        hasImageInput: false
      }
    },
    methods: {
      cancelUpload () {
        window.document.querySelector('#image-upload').value = ''
        this.data.image = this.oldImage
        this.hasImageInput = false
      },
      changeImage (e) {
        const files = e.srcElement.files || e.dataTransfer.files
        if (files) {
          this.oldImage = this.data.image
          this.hasImageInput = true
          this.data.image = window.URL.createObjectURL(files[0])

          this.imageInput = files[0]
        }
      },
      uploadImage () {
        const formData = new window.FormData()
        formData.append('image', this.imageInput, this.imageInput.name)
        newsService.update(this.data.id, formData)
        .then(response => {
          const reference = {
            index: this.data.index,
            image: response.body.image
          }
          this.clearAndClose('success', reference)
        }, response => {
          this.clearAndClose('error')
        })
      },
      clearAndClose (status, reference) {
        this.data.image = this.oldImage
        this.imageInput = ''
        this.oldImage = ''
        this.hasImageInput = false
        this.$emit('close')
        this.$emit(status)
        if (status === 'success') {
          this.$emit('confirm', reference)
        }
      },
      close () {
        this.$emit('close')
      }
    },
    computed: {
      imgUrl () {
        if (/^blob*/.test(this.data.image)) {
          return this.data.image
        } else {
          return `${IMG_URL}${this.data.image}`
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .container-img-modal
    display: flex
    width: 100%
    flex-direction: row
    justify-content: center
    img
      height: 480px
      width: 480px
    #image-upload
      visibility: hidden
      position: absolute
    .change-button
      position: absolute
      right: 0
      top: 0
</style>
