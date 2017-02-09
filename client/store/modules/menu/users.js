import lazyLoading from './lazyLoading'

export default {
  name: 'Usuários',
  path: '/users',
  meta: {
    icon: 'fa-users'
  },
  component: lazyLoading('users/Users')
}
