<template lang="pug">
  section.hero.is-medium
    div.hero-body
      div.container
        div.columns
          div.column.is-7-desktop
            div.box(v-if="!invalid && user._id")
              p.padded-paragraph Olá, {{user.name}}. Para trocar a sua senha, basta preencher a sua nova senha nos campos abaixo e autenticar normalmente com sua nova senha.
              form(v-on:submit.prevent="update()")
                label.label Nova Senha
                p.control
                  input.input(type="password" placeholder="Sua nova senha" v-model="credentials.password" v-validate="'required|min:6|max:20'" v-bind:class="{'is-danger': errors.has('senha') }" name="senha")
                  span.help.is-danger(v-show="errors.has('senha')") {{ errors.first('senha') }}
                label.label Repita a Nova Senha
                p.control
                  input.input(type="password" placeholder="Repita a senha digitada acima" v-model="credentials.passwordConfirm" v-validate="'required|min:6|max:20|confirmed:senha'" v-bind:class="{'is-danger': errors.has('passwordConfirm') }" data-vv-as="Confirmação da Senha" name="passwordConfirm")
                  span.help.is-danger(v-show="errors.has('passwordConfirm')") {{ errors.first('passwordConfirm') }}
                p.control.submit-button
                  button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Enviar
                p.control.submit-button
                  router-link(:to="{name: 'Auth'}") Voltar / Autenticar
            div.box(v-if="invalid || !user._id")
              p.padded-paragraph O token é inválido.
              p.padded-paragraph Para trocar sua senha, solicite novamente o email neste #[router-link(:to="{name: 'Reset Password'}") link].
</template>

<script>
  import Vue from 'vue'
  import auth from '../../auth'
  import Notification from 'vue-bulma-notification'

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
    data () {
      return {
        invalid: false,
        credentials: {},
        user: {}
      }
    },
    methods: {
      update () {
        this.$validator.validateAll().then(success => {
          if (!success) return

          auth.updatePassword(this.$route.params.token, this.credentials.password)
          .then(response => {
            openNotification({
              message: 'Sua senha foi atualizada!',
              type: 'success',
              duration: 5000
            })
            this.$router.push({name: 'Auth'})
          }, response => {
            openNotification({
              message: 'Houve um erro ao atualizar sua senha!',
              type: 'danger',
              duration: 3000
            })
          })
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      const token = to.params.token
      auth.findByToken(token).then((response) => {
        console.log(response)
        next(vm => {
          vm.user = response.body
        })
      }, response => {
        console.error(response)
        next(vm => {
          vm.invalid = true
        })
      })
    }
  }
</script>

<style lang="sass" scoped>
  .padded-paragraph
    padding: 1rem 0
  .hero
    background: transparent
  .columns
    justify-content: center
    .submit-button
      padding-top: 2rem
      text-align: center
</style>
