<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title Atualizar Dados
      form(v-on:submit.prevent="updateUser()" v-if="data && data.user")
        label.label Nome
        p.control
          input.input(type="text" placeholder="Joãozinho da Silva" v-model="data.user.name" v-validate="'required|min:4|max:20'" v-bind:class="{'is-danger': errors.has('nome') }" name="nome")
          span.help.is-danger(v-show="errors.has('nome')") {{ errors.first('nome') }}
        label.label Funções
        p.control
          multiselect(
            v-model="data.user.roles",
            :options="options",
            :multiple="true",
            :taggable="true",
            @tag="addTag",
            placeholder="Escolha uma ou mais funções",
            tag-placeholder="Pressione enter pra escolher"
            label="name",
            track-by="name"
          )
        label.label Descrição
        p.control
          input.input(type="text" placeholder="Criador de Conteúdo" v-model="data.user.description")
        label.label Email
        p.control
          input.input(type="text" placeholder="seuemail@email.com" v-model="data.user.email" v-on:keyup="clearEmailCustomErrors()" v-validate="'required|email'" v-bind:class="{'is-danger': errors.has('email') || customErrors.email.length }" name="email")
          span.help.is-danger(v-show="errors.has('email')") {{ errors.first('email') }}
          span.help.is-danger(v-show="customErrors.email.length") {{ customErrors.email[0] }}
        div.control.is-grouped.submit-group
          p.control
            button.button.is-success(type="submit") Salvar
          p.control
            button.button.is-danger(@click="close()") Cancelar
</template>

<script>
  import { Modal } from 'vue-bulma-modal'
  import userService from '../../../services/user'
  import Multiselect from 'vue-multiselect'

  let _this

  export default {
    components: {
      Modal,
      Multiselect
    },
    mounted () {
      _this = this
    },
    props: {
      visible: Boolean,
      data: Object
    },
    watch: {
      visible: (value) => {
        if (value) {
          _this.data.user.roles = _this.data.user.roles.map((role) => {
            return _this.options.find((option) => option.value === role)
          })
          _this.data.user.roles = _this.data.user.roles.filter((role) => {
            return role !== undefined
          })
        }
      }
    },
    data () {
      return {
        customErrors: {
          email: []
        },
        options: [
          {name: 'Administrador', value: 'admin'},
          {name: 'Condecorações e Recompensas', value: 'rewards'},
          {name: 'Distintivos Especiais', value: 'badges'},
          {name: 'Distintivo de Semeador', value: 'sower'},
          {name: 'Criador de Conteúdo', value: 'content'}
        ]
      }
    },
    methods: {
      addTag (newTag) {
        const tag = {
          name: newTag,
          code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        }
        this.taggingOptions.push(tag)
        this.taggingSelected.push(tag)
      },
      close () {
        this.$emit('close', false)
      },
      updateUser () {
        let formattedData = {
          name: this.data.user.name,
          email: this.data.user.email,
          description: this.data.user.description,
          roles: this.data.user.roles.map((role) => role.value)
        }
        formattedData.roles.push('user')
        userService.updateUser(this.data.user._id, formattedData)
        .then((response) => {
          const reference = {
            index: this.data.index,
            user: response.body
          }
          this.$emit('close', true)
          this.$emit('confirm', reference)
        }, response => {
          if (response.status === 409) {
            let message = 'Este email já está sendo utilizado!'
            this.customErrors.email.push(message)
          }
        })
      },
      clearEmailCustomErrors () {
        if (this.customErrors && this.customErrors.email.length) {
          this.customErrors.email = []
        }
      }
    }
  }
</script>
<style lang="sass" scoped>
  h4
    border-bottom: 1px solid rgba(0,0,0,0.4)
  h5
    padding-top: 2rem
    padding-bottom: 2rem
  .submit-group
    padding-top: 1rem
</style>
