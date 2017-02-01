<template lang="pug">
  footer.footer(:class="{ 'with-margin': authenticated }")
    div.container
      div.content.has-text-centered
        p.social
          a
            span.icon
              i.fa.fa-github
          a
            span.icon
              i.fa.fa-twitter
        p.
          #[span.icon]
            #[i.fa.fa-code]
          por
          #[a(href="www.gfviegas.com" target="_BLANK") Gustavo Viegas]
</template>

<script>
  import auth from '../../auth'
  export default {
    data () {
      return this.$store.state.pkg
    },
    computed: {
      authenticated: () => { return auth.user.authenticated }
    }
  }
</script>

<style lang="sass">
@import '~bulma/sass/utilities/mixins'

.footer
  &.with-margin
    margin-left: 180px
  @include mobile()
    margin-left: 0
  .social a
    border-bottom: none !important
  .fa.fa-heart
    color: red
</style>
