import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Nível',
    path: '',
    component: lazyLoading('level/List'),
    meta: {requiredRoles: ['level']}
  },
  {
    name: 'Atualizar Solicitação de Nível',
    path: 'update/:id',
    component: lazyLoading('level/Editor'),
    meta: {requiredRoles: ['level']}
  }
]

export default {
  path: '/level',
  meta: {
    label: 'Sol. de Nível',
    icon: 'fa-level-up',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('level/Level'),
  children: children
}
