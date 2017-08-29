import lazyLoading from './lazyLoading'

export default {
  name: 'Usuários',
  path: '/users',
  meta: {
    requiredRoles: ['admin'],
    icon: 'fa-users'
  },
  component: lazyLoading('users/Users')
}
