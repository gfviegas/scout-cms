<template lang="pug">
  aside.menu.app-sidebar.animated(:class="{ slideInLeft: show, slideOutLeft: !show }")
    p.menu-label Páginas
    ul.menu-list(v-if="menu")
      li
        router-link(:to="{name: 'Home'}" v-bind:exact="true")
          span.icon.is-small
            i.fa.fa-home
          | Home
      li(v-for="route in menu")
        router-link(:to="{name: getLinkName(route)}" v-bind:exact="true" v-show="hasPermission(route)")
          span.icon.is-small
            i.fa(v-bind:class="route.meta.icon")
          | {{route.meta.label || route.name}}
    p.menu-label Usuário
      ul.menu-list
        li
          a(@click="logout()") Desconectar
</template>

<script>
  import Expanding from 'vue-bulma-expanding'
  import { mapGetters, mapActions } from 'vuex'
  import auth from '../../auth'

  export default {
    components: {
      Expanding
    },
    props: {
      show: Boolean
    },
    data () {
      return {
        isReady: false
      }
    },
    mounted () {
      let route = this.$route
      if (route.name) {
        this.isReady = true
        this.shouldExpandMatchItem(route)
      }
    },
    computed: mapGetters({
      menu: 'menuitems'
    }),
    methods: {
      getLinkName (route) {
        if (route.meta.link) {
          return route.meta.link.name
        }
        return route.name
      },
      hasPermission (route) {
        let handledRoute = route
        if (route.meta.link) {
          handledRoute = route.meta.link
        }
        if (!handledRoute.meta || !handledRoute.meta.requiredRoles) {
          return true
        }

        return auth.checkPermission(handledRoute.meta.requiredRoles)
      },
      ...mapActions([
        'expandMenu'
      ]),
      isExpanded (item) {
        return item.meta.expanded
      },
      toggle (index, item) {
        this.expandMenu({
          index: index,
          expanded: !item.meta.expanded
        })
      },
      shouldExpandMatchItem (route) {
        let matched = route.matched
        let lastMatched = matched[matched.length - 1]
        let parent = lastMatched.parent || lastMatched
        const isParent = parent === lastMatched

        if (isParent) {
          const p = this.findParentFromMenu(route)
          if (p) {
            parent = p
          }
        }

        if ('expanded' in parent.meta && !isParent) {
          this.expandMenu({
            item: parent,
            expanded: true
          })
        }
      },
      generatePath (item, subItem) {
        return `${item.component ? item.path + '/' : ''}${subItem.path}`
      },
      findParentFromMenu (route) {
        const menu = this.menu
        for (let i = 0, l = menu.length; i < l; i++) {
          const item = menu[i]
          const k = item.showChildren && item.children && item.children.showInMenu
          if (k) {
            for (let j = 0; j < k; j++) {
              if (item.children[j].name === route.name) {
                return item
              }
            }
          }
        }
      },
      logout () {
        auth.logout().then(() => {
          window.location.reload()
        })
      }
    },
    watch: {
      $route (route) {
        this.isReady = true
        this.shouldExpandMatchItem(route)
      }
    }
  }
</script>

<style lang="sass">
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';

.app-sidebar
  position: fixed
  top: 50px
  left: 0
  bottom: 0
  padding: 20px 0 50px
  width: 180px
  min-width: 45px
  max-height: 100vh
  height: calc(100% - 50px)
  z-index: 1024 - 1
  background: #FFF
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1)
  overflow-y: auto
  overflow-x: hidden

  @include mobile()
    transform: translate3d(-180px, 0, 0)

  .icon
    padding-right: 2rem
    vertical-align: baseline
    &.is-angle
      position: absolute
      right: 10px
      transition: transform .377s ease

  .menu-label
    padding-left: 5px

  .menu-list
    li a
      &[aria-expanded="true"]
        .is-angle
          transform: rotate(180deg)

    li a + ul
      margin: 0 10px 0 15px
</style>
