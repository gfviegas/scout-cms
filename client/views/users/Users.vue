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
                input.input(type="text" placeholder="Joãozinho da Silva" v-model="newUser.name")
              label.label Descrição
              p.control
                input.input(type="text" placeholder="Criador de Conteúdo" v-model="newUser.description")
              label.label Email
              p.control
                input.input(type="text" placeholder="seuemail@email.com" v-model="newUser.email")
              label.label Senha
              p.control
                input.input(type="password" placeholder="Digite a senha do usuário" v-model="newUser.password")
              p.control.submit-button
                button.button.is-medium.is-primary(type="submit") Cadastrar
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
        userService.createUser(this.newUser)
        .then((response) => {
          openNotification({
            message: 'Usuário criado com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.users.push(response.body)
          this.newUser = {
            name: '',
            description: '',
            email: '',
            password: ''
          }
        }, (response) => {
          openNotification({
            message: 'Erro ao criar o usuário!',
            type: 'danger',
            duration: 3000
          })
        })
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
<style lang="sass">
  .table-responsive
    display: block
    width: 100%
    min-height: .01%
    overflow-x: auto
  .submit-button
    padding-top: 2rem
    text-align: center
</style>
