import lazyLoading from './lazyLoading'

export default {
  name: 'Recompensas',
  path: '/rewards',
  meta: {
    icon: 'fa-certificate'
  },
  showChildren: false,
  component: lazyLoading('rewards/Rewards'),
  children: [
    {
      name: 'Dashboard Recompensas',
      path: '',
      component: lazyLoading('rewards/List')
    },
    {
      name: 'Atualizar Solicitação',
      path: 'update/:id',
      component: lazyLoading('rewards/Editor')
    }
  ]
}
