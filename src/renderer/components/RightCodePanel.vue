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
          set  (value) {
            this.$store.dispatch('updateRightCode', value)
          }
        }
      }
    }
</script>

<style scoped lang="scss">
    .right-code-panel {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 16px 20px 20px;
    }

</style>
