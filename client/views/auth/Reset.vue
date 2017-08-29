<template lang="pug">
  section.hero.is-medium
    div.hero-body
      div.container
        div.columns
          div.column.is-7-desktop
            div.box(v-if="!sent")
              p.padded-paragraph Esqueceu sua senha? Basta preencher o seu email no campo abaixo que enviaremos um email com instruções para trocar a sua senha!
              br
              form(v-on:submit.prevent="reset()")
                label.label Email
                p.control
                  input.input(type="text" placeholder="seuemail@email.com" v-model="credentials.email" v-validate="'required|email'" v-bind:class="{'is-danger': errors.has('email') }" name="email")
                  span.help.is-danger(v-show="errors.has('email')") {{ errors.first('email') }}
                p.control.submit-button
                  button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Enviar
                p.control.submit-button
                  router-link(:to="{name: 'Auth'}") Voltar / Autenticar
            div.box(v-if="sent")
              p.padded-paragraph O email foi enviado, verifique sua caixa de entrada.
              p.padded-paragraph Siga as instruções do e-mail para continuar o processo de troca de senha.
              p.padded-paragraph O email pode demorar alguns minutos para ser enviado. Caso depois de alguns minutos ainda não tenha recebido, confira a caixa de spam.
              p.padded-paragraph Caso queira reenviar o email, #[a(@click="setSent(false)") clique aqui].
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
        sent: false,
        credentials: {
          email: ''
        },
        error: ''
      }
    },
    methods: {
      setSent (value) {
        this.sent = value
      },
      reset () {
        this.$validator.validateAll().then(success => {
          if (!success) return

          const credentials = {
            email: this.credentials.email
          }

          auth.resetPassword(this, credentials)
          .then((response) => {
            this.sent = true
            openNotification({
              message: 'Email enviado!',
              type: 'success',
              duration: 3000
            })
          }, (response) => {
            const message = (response.status === 404) ? 'Este email não está cadastrado!' : 'Erro ao enviar o email. Tente mais tarde!'
            openNotification({
              message: message,
              type: 'danger',
              duration: 3000
            })
          })
        })
      }
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
