import * as types from '../../mutation-types'
// import lazyLoading from './lazyLoading'
import users from './users'
import news from './news'
import events from './events'
import rewards from './rewards'
import sower from './sower'
import level from './level'
import book from './book'
import badges from './badges'
import documents from './documents'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    news,
    events,
    documents,
    rewards,
    badges,
    sower,
    level,
    book,
    users
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
