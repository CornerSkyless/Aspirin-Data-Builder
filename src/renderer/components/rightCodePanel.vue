<template>
    <div class="right-code-panel">
        <CodeInput :code.sync="rightCode"/>
    </div>
</template>

<script>
    import CodeInput from './CodeInput'

    export default {
      name: 'RightCodePanel',
      components: {CodeInput},
      computed: {
        rightCode: {
          get () {
            return this.$store.state.rightCode
          },
          async set  (value) {
            await this.$store.dispatch('updateRightCode', value)
          }
        }
      }
    }
</script>

<style scoped lang="scss">
    .right-code-panel {
        padding: 20px;
    }

</style>
