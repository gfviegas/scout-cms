import lazyLoading from './lazyLoading'

export default {
  name: 'Usuários',
  meta: {
    icon: 'fa-users',
    expanded: true
  },

  children: [
    {
      name: 'Users',
      path: '/users',
      meta: {
        label: 'Administrar'
      },
      component: lazyLoading('users/Users')
    }
  ]
}
