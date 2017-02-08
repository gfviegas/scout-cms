<template lang="pug">
  //- div.container
  //-   div.columns
  //-     div.column.is-7-desktop
  //-       div.box
  //-         form
  //-           label.label Email
  //-           p.control
  //-             input.input(type="text" placeholder="seuemail@email.com")
  //-           label.label Senha
  //-           p.control
  //-             input.input(type="password" placeholder="Digite sua senha")
  //-           p.control.submit-button
  //-             button.button.is-medium.is-primary Login
  section.hero.is-medium
    div.hero-body
      div.container
        div.columns
          div.column.is-7-desktop
            div.box
              form(v-on:submit.prevent="login()")
                label.label Email
                p.control
                  input.input(type="text" placeholder="seuemail@email.com" v-model="credentials.email")
                label.label Senha
                p.control
                  input.input(type="password" placeholder="Digite sua senha" v-model="credentials.password")
                p.control.submit-button
                  button.button.is-medium.is-primary(type="submit") Login
</template>

<script>
  import Vue from 'vue'
  import auth from '../auth'
  import Notification from 'vue-bulma-notification'
  import router from '../router'

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
        credentials: {
          email: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      login () {
        const credentials = {
          email: this.credentials.email,
          password: this.credentials.password
        }

        auth.login(this, credentials)
        .then((response) => {
          auth.setToken(response.body.token)
          .then(() => {
            router.push({name: 'Home'})
            openNotification({
              message: 'Autenticado com sucesso!',
              type: 'success',
              duration: 3000
            })
          })
        }, (response) => {
          openNotification({
            message: 'Credenciais Inválidas!',
            type: 'danger',
            duration: 3000
          })
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .hero
    background: transparent
  .columns
    justify-content: center
    .submit-button
      padding-top: 2rem
      text-align: center
</style>
