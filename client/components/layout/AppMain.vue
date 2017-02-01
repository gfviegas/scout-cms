<template lang="pug">
  section(:class="{ 'app-main': authenticated }")
    div.container.is-fluid.is-marginless.app-content
      levelbar(:show="authenticated")
      transition(mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear)
        router-view.animated
</template>

<script>
  import Levelbar from './Levelbar'
  import auth from '../../auth'

  export default {
    components: {
      Levelbar
    },
    computed: {
      authenticated: () => { return auth.user.authenticated }
    }
  }
</script>

<style lang="sass">
  @import '~bulma/sass/utilities/variables'
  @import '~bulma/sass/utilities/mixins'
  .app-main
    padding-top: 50px
    margin-left: 180px
    transform: translate3d(0, 0, 0)
    @include mobile()
      margin-left: 0
  .app-content
    padding: 20px
</style>
