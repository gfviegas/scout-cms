import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Eventos',
    path: '',
    component: lazyLoading('events/List'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Editar Evento',
    path: 'edit/:id',
    component: lazyLoading('events/Editor'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Criar Evento',
    path: 'create',
    component: lazyLoading('events/Editor'),
    meta: {requiredRoles: ['content']}
  }
]

export default {
  path: '/events',
  meta: {
    label: 'Eventos',
    icon: 'fa-calendar',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('events/Events'),
  children: children
}
