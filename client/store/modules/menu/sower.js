import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Distintivo Semeador',
    path: '',
    component: lazyLoading('sower/List'),
    meta: {requiredRoles: ['sower']}
  },
  {
    name: 'Atualizar Solicitação de Distintivo Semeador',
    path: 'update/:id',
    component: lazyLoading('sower/Editor'),
    meta: {requiredRoles: ['sower']}
  }
]

export default {
  path: '/sower',
  meta: {
    label: 'Distintivos Semeador',
    icon: 'fa-pagelines',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('sower/Sower'),
  children: children
}
