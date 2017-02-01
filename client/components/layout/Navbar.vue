<template lang="pug">
  section.hero.is-bold.app-navbar.animated(:class="{ slideInDown: show, slideOutDown: !show }")
    div.hero-head
      nav.nav
        div.nav-left
          a.nav-item.is-hidden-tablet(@click="toggleSidebar(!sidebar.opened)")
            i.fa.fa-bars(aria-hidden="true")

        div.nav-center
          a.nav-item.hero-brand(href="/")
            img(src="~assets/logo.svg")
            div.is-hidden-mobile.is-flex
              span.vue Scout
              strong.admin CMS
        div.nav-right.is-flex
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import { mapGetters, mapActions } from 'vuex'

export default {

  components: {
    Tooltip
  },

  props: {
    show: Boolean
  },

  computed: mapGetters({
    pkginfo: 'pkg',
    sidebar: 'sidebar'
  }),

  methods: mapActions([
    'toggleSidebar'
  ])
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-brand {
  .vue {
    margin-left: 10px;
    color: #36AC70;
  }
  .admin {
    color: #28374B;
  }
}
</style>
