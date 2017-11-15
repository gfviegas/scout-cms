<template lang="pug">
  div.box
    h3.title
      | Parâmetros Gerais
    form(v-on:submit.prevent="submitForm" v-if="setup.length")
      .setup-field(v-for="set in setup" v-bind:key="set._id")
        label.label {{set.label}}
        p.control
          input.input(type="text" v-model="set.value" v-validate="'required|max:350'" v-bind:class="{'is-danger': errors.has(set.label) }" v-bind:data-vv-name="set.label")
          span.help.is-danger(v-show="errors.has('video')") {{ errors.first(set.label) }}

      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Atualizar Parâmetros
</template>

<script>
  import Vue from 'vue'
  import setupService from '../../services/setup'
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
      setupService.get().then((response) => {
        next(vm => {
          vm.setup = response.body
        })
      }, (response) => {
        next(false)
      })
    },
    data () {
      return {
        setup: {
        }
      }
    },
    methods: {
      submitForm () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          this.updateSetup()
        })
      },
      updateSetup () {
        setupService.update({data: this.setup})
        .then(response => {
          openNotification({
            message: 'Parâmetros atualizados com sucesso!',
            type: 'success',
            duration: 3000
          })
        }, response => {
          let message = 'Erro ao atualizar os parâmetros!'

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
