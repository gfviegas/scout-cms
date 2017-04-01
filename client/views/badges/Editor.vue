<template lang="pug">
  div.box
    h3.title
      | Atualizar Solicitação
    form(v-on:submit.prevent="submitForm()" v-if="request && request._id")
      br
      h5.subtitle.is-5 Conferir Dados

      label.label Id
      p.control
        span {{request._id}}
      label.label Tipo
      p.control
        span {{typeFormated(request)}}
      label.label Recompensa
      p.control
        span {{request.reward}}
      label.label Justificativa
      p.control
        span {{request.resume}}

      br
      h5.subtitle.is-5 Dados do(a) Solicitador(a)
      label.label Registro
      p.control
        span {{request.author.register}}
      label.label Email
      p.control
        span {{request.author.email}}
      label.label Telefone
      p.control
        span {{request.author.phone}}
      label.label Celular
      p.control
        span {{request.author.cellphone}}
      label.label Função no Escotismo
      p.control
        span {{request.author.role}}
      label.label Grupo Escoteiro
      p.control
        span {{request.author.group.number}} - {{request.author.group.name}}

      br
      h5.subtitle.is-5 Dados do(a) Agraciado(a)
      label.label Registro
      p.control
        span {{request.gifted.register}}
      label.label Nome
      p.control
        span {{request.gifted.name}}
      label.label Grupo Escoteiro
      p.control
        span {{request.gifted.group.number}} - {{request.gifted.group.name}}

      br
      h5.subtitle.is-5 Atualizar Status
      label.label Status
      p.control
        select(name="status" v-model="request.status" v-validate="'required'" data-vv-as="Status da Solicitação" v-bind:class="{'is-danger': errors.has('status')}")
          option(default value="") Selecione...
          option(value="waiting") Aguardando
          option(value="analyzing") Analisando
          option(value="rejected") Rejeitado
          option(value="approved") Aprovado
          option(value="issued") Emitido
        span.help.is-danger(v-if="errors.has('status')") {{ errors.first('status') }}
        small.help.is-info(v-else) O status escolhido significa que: #[strong {{getStatusMessage(request)}}]

      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Atualizar
</template>

<script>
  import Vue from 'vue'
  import rewardsService from '../../services/rewards'
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
      rewardsService.get(to.params.id).then((response) => {
        next(vm => {
          vm.request = response.body
        })
      }, (response) => {
        next(false)
      })
    },
    data () {
      return {
        request: {}
      }
    },
    methods: {
      statusFormated (request) {
        if (!request || !request.status) return false
        switch (request.status) {
          case 'waiting':
            return 'Aguardando'
          case 'analyzing':
            return 'Analisando'
          case 'issued':
            return 'Emitido'
          case 'rejected':
            return 'Indeferido'
          case 'approved':
            return 'Deferido'
        }
      },
      typeFormated (request) {
        if (!request || !request.status) return false
        switch (request.type) {
          case 'badge':
            return 'Distintivo Especial'
          case 'reward':
            return 'Condecoração'
        }
      },
      getStatusMessage (request) {
        if (!request || !request.status) return false
        switch (request.status) {
          case 'waiting':
            return 'A solicitação foi recebida e está aguardando análise.'
          case 'analyzing':
            return 'A Região Escoteira está analisando a sua solicitação.'
          case 'issued':
            return 'A solicitação foi aprovada e a sua recompensa já foi emitida.'
          case 'rejected':
            return 'A solicitação foi negada.'
          case 'approved':
            return 'A solicitação foi aprovada e aguarda emissão.'
        }
      },
      submitForm () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          this.editRequest()
        })
      },
      editRequest () {
        rewardsService.update(this.request._id, {status: this.request.status})
        .then(response => {
          openNotification({
            message: 'Solicitação atualizada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Recompensas'})
        }, response => {
          let message = 'Erro ao atualizar a solicitação!'

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
