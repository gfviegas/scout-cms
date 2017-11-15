import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Gerenciar Parâmetros',
    path: '',
    component: lazyLoading('setup/Form'),
    meta: {requiredRoles: ['content']}
  }
]

export default {
  path: '/setup',
  meta: {
    label: 'Parâmetros Gerais',
    icon: 'fa-gear',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('setup/Setup'),
  children: children
}
