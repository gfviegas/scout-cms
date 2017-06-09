<template lang="pug">
    nav(v-bind:class="getNavClassName()")
        router-link(:class="getPreClassName()" v-bind:to="{name: routeName, query: {page: formatCurrentPage - 1}}") Anterior
        router-link(:class="getNextClassName()" v-bind:to="{name: routeName, query: {page: formatCurrentPage + 1}}") Próximo
        ul.pagination-list
            li(v-for="item in pagingList")
              router-link(v-if="item !== '...'" v-bind:class="getPagingClassName(item)" v-bind:to="{name: routeName, query: {page: item}}") {{ item }}
              span(v-else).pagination-ellipsis ...
</template>
<script>
  import paging from './paging'
  export default {
    name: 'vue-bulma-pagination',
    props: {
      routeName: {
        type: String,
        default: ''
      },
      urlPrefix: {
        type: String,
        default: '/'
      },
      currentPage: {
        type: Number,
        default: 1
      },
      lastPage: Number,
      displayPage: {
        type: Number,
        default: 4
      },
      modifiers: {
        type: String,
        default: ''
      }
    },
    methods: {
      getNavClassName () {
        const optional = ['', 'is-centered', 'is-right']
        if (optional.indexOf(this.modifiers.trim()) >= 0) {
          return 'pagination ' + this.modifiers
        }
      },
      getPagingClassName (item) {
        return this.currentPage !== item ? 'pagination-link' : 'pagination-link is-current'
      },
      getPreClassName () {
        return this.currentPage !== 1 ? 'pagination-previous' : 'pagination-previous is-disabled'
      },
      getNextClassName () {
        return this.currentPage < this.lastPage ? 'pagination-next' : 'pagination-next is-disabled'
      },
      normalize (path) {
        return path.replace(/\/+/g, '/')
      }
    },
    computed: {
      pagingList () {
        return paging(this.currentPage, this.lastPage, this.displayPage)
      },
      formatCurrentPage () {
        const currentPage = Number(this.currentPage)
        return currentPage > 0 ? currentPage : 1
      }
    }
  }
</script>

<style scoped lang="sass">
  .pagination-list
      list-style : none
      li
        list-style : none
  .is-current
    background: rgba(0, 0, 0, 0.08)
    // color: black
    font-weight: bold
</style>
