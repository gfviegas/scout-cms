<template lang="pug">
  div.content.has-text-centered
    p
      img(width="200" src="~assets/logo.svg")
    h1.is-title.is-bold Scout CMS
    p
      strong Um gerenciador de conteúdo e blogging. Open Source.
    p
      | Desenvolvido pela Equipe Regional de Imagem e Comunicação dos Escoteiros do Brasil, Região de Minas Gerais.
    p.
      Feito a partir do
      #[a(href="https://github.com/vue-bulma/vue-admin") Vue-Bulma Admin]
</template>

<script>
export default {

  data () {
    return this.$store.state.pkg
  }

}
</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
