<template>
    <div class="input-file-panel">
        <div style="text-align: center;margin-bottom: 10px">

            <span v-if="activeInputFileType==='code'">生成数量：</span>
            <a-input-number v-if="activeInputFileType==='code'" :min="1" :max="50" v-model="activeInputFileCount" style="margin-right: 20px"/>

            <a-radio-group v-model="activeInputFileType" style="margin-right: 20px">
                <a-radio value="manual">手动编写</a-radio>
                <a-radio value="code">代码生成</a-radio>
            </a-radio-group>

            <a-button-group>
                <a-button @click="renameModal=true">重命名</a-button>
                <a-button type="danger" @click="deleteActiveInputFile" v-if="$store.state.inputFileList.length>1">删除</a-button>
            </a-button-group>
        </div>
        <div class="input-file-panel-main">

            <CodeInput class="input-file-panel-right" :code.sync="activeInputFileContent"/>
            <div v-if="activeInputFileType === 'code'" class="input-file-panel-left">
                <strong style="margin-bottom: 5px">运行指令参数 (args)</strong>
                <div  v-for="(arg,i) in activeInputFileArgs">
                    <a-input style="margin-bottom: 5px" placeholder="请输入文件名" :value="activeInputFileArgs[i]" @input="updateActiveInputFileArgsItem(i,$event.target.value)"/>
                </div>
            </div>

        </div>
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
        async updateActiveInputFileArgsItem (index, value) {
          await this.$store.dispatch('updateActiveInputFileArgsItem', {value, index})
        },
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
        activeInputFileArgs: {
          get () {
            return this.$store.getters.activeInputFileArgs
          }
        },
        activeInputFileType: {
          get () {
            return this.$store.getters.activeInputFileType
          },
          async set (value) {
            await this.$store.dispatch('updateActiveInputFileType', value)
          }
        },
        activeInputFileCount: {
          get () {
            return this.$store.getters.activeInputFileCount
          },
          async set (value) {
            await this.$store.dispatch('updateActiveInputFileCount', value)
          }
        }
      }
    }
</script>

<style scoped lang="scss">
    .input-file-panel {
        padding: 10px 20px;

        .input-file-panel-main{
            display: flex;
            .input-file-panel-left{
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                padding-left: 10px;
                overflow-y: scroll;
                height: 450px;
            }
            .input-file-panel-right{
                width: 100%;
                overflow: hidden;
                flex: 1;
            }
        }
    }

</style>
