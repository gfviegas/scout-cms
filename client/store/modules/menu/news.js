import lazyLoading from './lazyLoading'

export default {
  name: 'Notícias',
  path: '/news',
  meta: {
    icon: 'fa-newspaper-o'
  },
  component: lazyLoading('news/News')
}
