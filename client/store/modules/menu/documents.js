import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Documentos',
    path: '',
    component: lazyLoading('documents/List'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Criar Documento',
    path: 'create',
    component: lazyLoading('news/Editor'),
    meta: {requiredRoles: ['content']}
  },
  {
    name: 'Atualizar Documento',
    path: 'update/:id',
    component: lazyLoading('documents/Editor'),
    meta: {requiredRoles: ['content']}
  }
]

export default {
  path: '/documents',
  meta: {
    label: 'Documentos',
    icon: 'fa-files-o',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('documents/Documents'),
  children: children
}
