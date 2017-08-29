import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Recompensas',
    path: '',
    component: lazyLoading('rewards/List'),
    meta: {requiredRoles: ['rewards']}
  },
  {
    name: 'Atualizar Solicitação de Recompensa',
    path: 'update/:id',
    component: lazyLoading('rewards/Editor'),
    meta: {requiredRoles: ['rewards']}
  }
]

export default {
  path: '/rewards',
  meta: {
    label: '',
    icon: 'fa-certificate',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('rewards/Rewards'),
  children: children
}
