<template>
    <div class="input-file-panel">
        <div style="text-align: center;margin-bottom: 10px">
            <a-radio-group v-model="activeInputFileType" style="margin-right: 20px">
                <a-radio-button value="manual">手动编写</a-radio-button>
                <a-radio-button value="code">代码生成</a-radio-button>
            </a-radio-group>
            <a-button-group>
                <a-button @click="renameModal=true">重命名</a-button>
                <a-button type="danger" @click="deleteActiveInputFile" v-if="$store.state.inputFileList.length>1">删除</a-button>
            </a-button-group>
        </div>
        <CodeInput :code.sync="activeInputFileContent"/>
        <a-modal
                title="重命名当前输入文件"
                v-model="renameModal"
                @ok="renameActiveInputFile"
                cancelText="取消"
                okText="重命名"
        >
            <a-input placeholder="请输入文件名" v-model="renameText"/>
        </a-modal>
    </div>
</template>

<script>
    import CodeInput from './CodeInput'

    export default {
      name: 'InputFilePanel',
      components: {CodeInput},
      data () {
        return {
          renameModal: false,
          renameText: ''
        }
      },
      methods: {
        async renameActiveInputFile () {
          if (this.renameText) {
            await this.$store.dispatch('renameActiveInputFile', this.renameText)
            this.renameModal = false
          }
        },
        async deleteActiveInputFile () {
          const vm = this
          this.$confirm({
            title: '你确认要删除这个输入文件吗？',
            content: '如果误删除，你可以从之前保存的项目文件中恢复。',
            async onOk () {
              // return new Promise(async (resolve) => {
              await vm.$store.dispatch('deleteActiveInputFile')
              //   return resolve()
              // })
            }
          })
        }
      },
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
        padding: 10px 20px;
    }

</style>
