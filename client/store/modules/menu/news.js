import lazyLoading from './lazyLoading'

export default {
  name: 'Notícias',
  path: '/news',
  meta: {
    icon: 'fa-newspaper-o'
  },
  showChildren: false,
  component: lazyLoading('news/News'),
  children: [
    {
      name: 'Dashboard Notícias',
      path: '',
      component: lazyLoading('news/List')
    },
    {
      name: 'Editar Notícia',
      path: 'edit/:id',
      component: lazyLoading('news/Editor')
    },
    {
      name: 'Criar Notícia',
      path: 'create',
      component: lazyLoading('news/Editor')
    }
  ]
}
