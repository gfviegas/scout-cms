import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Notícias',
    path: '',
    component: lazyLoading('news/List'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Editar Notícia',
    path: 'edit/:id',
    component: lazyLoading('news/Editor'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Criar Notícia',
    path: 'create',
    component: lazyLoading('news/Editor'),
    meta: {requiredRoles: ['content']}
  }
]

export default {
  path: '/news',
  meta: {
    label: 'Notícias',
    icon: 'fa-newspaper-o',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('news/News'),
  children: children
}
