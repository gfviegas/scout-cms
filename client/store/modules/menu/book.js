import lazyLoading from './lazyLoading'

const children = [
  {
    name: 'Dashboard Cadernos / Projetos',
    path: '',
    component: lazyLoading('book/List'),
    meta: {requiredRoles: ['book']}
  },
  {
    name: 'Atualizar Solicitação de Caderno / Projeto',
    path: 'update/:id',
    component: lazyLoading('book/Editor'),
    meta: {requiredRoles: ['book']}
  }
]

export default {
  path: '/book',
  meta: {
    label: 'Caderno/Projeto',
    icon: 'fa-book',
    link: children[0]
  },
  showChildren: false,
  component: lazyLoading('book/Book'),
  children: children
}
