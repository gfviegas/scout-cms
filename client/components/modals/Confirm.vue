<template lang="pug">
  modal(:visible="visible" @close="close")
    div.box
      h4.title {{data.title}}
      h5.subtitle {{data.content}}
      div.control.is-grouped
        p.control
          button.button.is-success(@click="confirm()") Ok
        p.control
          button.button.is-danger(@click="close()") Cancelar
</template>

<script>
import { Modal } from 'vue-bulma-modal'

export default {
  components: {
    Modal
  },

  props: {
    visible: Boolean,
    data: Object
  },

  methods: {
    close () {
      this.$emit('close', false)
    },
    confirm () {
      this.$emit('close', true)
      this.$emit('confirm', this.data.reference)
    }
  }
}
</script>
<style lang="sass" scoped>
  h4
    border-bottom: 1px solid rgba(0,0,0,0.4)
  h5
    padding-top: 2rem
    padding-bottom: 2rem
</style>
