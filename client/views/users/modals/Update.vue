<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title Atualizar Dados
      form(v-on:submit.prevent="updateUser()" v-if="data && data.user")
        label.label Nome
        p.control
          input.input(type="text" placeholder="Joãozinho da Silva" v-model="data.user.name")
        label.label Descrição
        p.control
          input.input(type="text" placeholder="Criador de Conteúdo" v-model="data.user.description")
        label.label Email
        p.control
          input.input(type="text" placeholder="seuemail@email.com" v-model="data.user.email")
        div.control.is-grouped
          p.control
            button.button.is-success(type="submit") Salvar
          p.control
            button.button.is-danger(@click="close()") Cancelar
</template>

<script>
import { Modal } from 'vue-bulma-modal'
import userService from '../../../services/user'

export default {
  components: {
    Modal
  },

  props: {
    visible: Boolean,
    data: Object
  },

  methods: {
    close () {
      this.$emit('close', false)
    },
    updateUser () {
      const formattedData = {
        name: this.data.user.name,
        email: this.data.user.email,
        description: this.data.user.description
      }
      userService.updateUser(this.data.user._id, formattedData)
      .then((response) => {
        const reference = {
          index: this.data.index,
          user: response.body
        }
        this.$emit('close', true)
        this.$emit('confirm', reference)
      })
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
</style>
