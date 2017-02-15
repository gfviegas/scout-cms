<template lang="pug">
  div
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title Usuários Cadastrados
          div.table-responsive
            confirm-modal(:visible="showConfirmDeleteModal" @close="closeConfirmDeleteModal" v-bind:data="confirmDeleteData" v-on:confirm="deleteUser")
            update-user-modal(:visible="showUpdateUserModal" @close="closeUpdateUserModal" v-bind:data="updateUserData" v-on:confirm="userUpdated")
            table.table.is-narrow
              thead
                tr
                  th ID
                  th Nome
                  th Descrição
                  th Email
                  th
                  th
              tbody
                tr(v-for="(user, index) in users")
                  td {{user._id}}
                  td {{user.name}}
                  td {{user.description}}
                  td {{user.email}}
                  td.is-icon
                    a(@click="openUpdateUserModal(user, index)")
                      i.fa.fa-pencil
                  td.is-icon
                    a(@click="openConfirmDeleteModal(user, index)")
                      i.fa.fa-trash
    div.tile.is-ancestor
      div.tile.is-parent
        article.tile.is-child.box
          h4.title
            | Cadastrar Usuário
            span.icon.is-pulled-right(@click="toggleCreateBox()")
              i.fa(v-bind:class="{'fa-angle-down': !showCreateBox, 'fa-angle-up': showCreateBox}")
          transition(name="fade")
            form(v-on:submit.prevent="createUser()" v-show="showCreateBox")
              label.label Nome
              p.control
                input.input(type="text" placeholder="Joãozinho da Silva" v-model="newUser.name" v-validate="'required|min:4|max:20'" v-bind:class="{'is-danger': errors.has('nome') }" name="nome")
                span.help.is-danger(v-show="errors.has('nome')") {{ errors.first('nome') }}
              label.label Descrição
              p.control
                input.input(type="text" placeholder="Criador de Conteúdo" v-model="newUser.description")
              label.label Email
              p.control
                input.input(type="text" placeholder="seuemail@email.com" v-model="newUser.email" v-on:keyup="clearEmailCustomErrors()" v-validate="'required|email'" v-bind:class="{'is-danger': errors.has('email') || customErrors.email.length }" name="email")
                span.help.is-danger(v-show="errors.has('email')") {{ errors.first('email') }}
                span.help.is-danger(v-show="customErrors.email.length") {{ customErrors.email[0] }}
              label.label Senha
              p.control
                input.input(type="password" placeholder="Digite a senha do usuário" v-model="newUser.password" v-validate="'required|min:6|max:20'" v-bind:class="{'is-danger': errors.has('senha') }" name="senha")
                span.help.is-danger(v-show="errors.has('senha')") {{ errors.first('senha') }}
              p.control.submit-button
                button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Cadastrar
</template>
<script>
  import Vue from 'vue'
  import userService from '../../services/user'
  import Notification from 'vue-bulma-notification'
  import ConfirmModal from '../../components/modals/Confirm'
  import UpdateUserModal from './modals/Update'

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
    components: {
      ConfirmModal,
      UpdateUserModal
    },
    data () {
      return {
        users: null,
        showCreateBox: false,

        showConfirmDeleteModal: false,
        confirmDeleteData: {},
        showUpdateUserModal: false,
        updateUserData: {},

        customErrors: {
          email: []
        },

        newUser: {
          name: '',
          description: '',
          email: '',
          password: ''
        }
      }
    },
    methods: {
      openUpdateUserModal (user, index) {
        this.updateUserData = {
          user,
          index
        }
        this.showUpdateUserModal = true
      },
      closeUpdateUserModal () {
        this.showUpdateUserModal = false
      },
      userUpdated (reference) {
        openNotification({
          message: 'Dados do usuário atualizado com sucesso!',
          type: 'success',
          duration: 3000
        })
        this.users[reference.index] = reference.user
      },
      openConfirmDeleteModal (user, index) {
        this.confirmDeleteData = {
          reference: {
            id: user._id,
            index: index
          },
          title: 'Confirmar Operação',
          content: `Você tem certeza que deseja excluir o usuário ${user.name} ? Essa operação não pode ser cancelada.`
        }
        this.showConfirmDeleteModal = true
      },
      closeConfirmDeleteModal () {
        this.showConfirmDeleteModal = false
      },
      deleteUser (reference) {
        userService.deleteUser(reference.id)
        .then((response) => {
          openNotification({
            message: 'Usuário excluído com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.users.splice(reference.index, 1)
        }, (response) => {
          openNotification({
            message: 'Erro ao excluir o usuário!',
            type: 'danger',
            duration: 3000
          })
        })
      },
      toggleCreateBox () {
        this.showCreateBox = !this.showCreateBox
      },
      createUser () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          userService.createUser(this.newUser)
          .then((response) => {
            openNotification({
              message: 'Usuário criado com sucesso!',
              type: 'success',
              duration: 3000
            })
            this.users.push(response.body)

            this.clearForm().then(() => {
              this.errors.clear()
            })
          }, response => {
            let message = 'Erro ao criar o usuário!'

            if (response.status === 409) {
              message = 'Este email já está sendo utilizado!'
              this.customErrors.email.push(message)
            }

            openNotification({
              message: message,
              type: 'danger',
              duration: 3000
            })
          })
        })
      },
      clearForm () {
        return new Promise((resolve, reject) => {
          this.newUser = {
            name: '',
            description: '',
            email: '',
            password: ''
          }
          resolve()
        })
      },
      clearEmailCustomErrors () {
        if (this.customErrors && this.customErrors.email.length) {
          this.customErrors.email = []
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      userService.getUsers().then((response) => {
        next(vm => {
          vm.users = response.body
        })
      }, (response) => {
        next(false)
      })
    }
  }
</script>
<style lang="sass" scoped>
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .submit-button
    padding-top: 2rem
    text-align: center
</style>
