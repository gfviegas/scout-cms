import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Distintivos Especiais',
    path: '',
    component: lazyLoading('badges/List'),
    meta: {requiredRoles: ['badges']}
  },
  {
    name: 'Atualizar Solicitação de Distintivo',
    path: 'update/:id',
    component: lazyLoading('badges/Editor'),
    meta: {requiredRoles: ['badges']}
  }
]

export default {
  path: '/badges',
  meta: {
    label: 'Distintivos Especiais',
    icon: 'fa-trophy',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('badges/Badges'),
  children: children
}
