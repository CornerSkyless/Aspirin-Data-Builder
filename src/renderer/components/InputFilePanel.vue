<template>
    <div class="input-file-panel">
        <div style="text-align: center;margin-bottom: 10px">
            <a-radio-group v-model="activeInputFileType">
                <a-radio-button value="manual">手动编写</a-radio-button>
                <a-radio-button value="code">代码生成</a-radio-button>
            </a-radio-group>
        </div>
        <CodeInput :code.sync="activeInputFileContent"/>
    </div>
</template>

<script>
    import CodeInput from './CodeInput'

    export default {
      name: 'InputFilePanel',
      components: {CodeInput},
      computed: {
        activeInputFileContent: {
          get () {
            return this.$store.getters.activeInputFileContent
          },
          async set (value) {
            await this.$store.dispatch('updateActiveInputFileContent', value)
          }
        },
        activeInputFileType: {
          get () {
            return this.$store.getters.activeInputFileType
          },
          async set (value) {
            await this.$store.dispatch('updateActiveInputFileType', value)
          }
        }
      }
    }
</script>

<style scoped lang="scss">
    .input-file-panel {
        padding:10px 20px;
    }

</style>
