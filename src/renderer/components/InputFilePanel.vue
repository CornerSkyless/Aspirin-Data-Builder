<template>
    <div class="input-file-panel">
        <div class="input-file-toolbar">
            <div class="input-file-toolbar__main">
                <template v-if="activeInputFileType==='code'">
                    <span class="input-file-toolbar__label">生成数量</span>
                    <a-input-number
                            class="input-file-toolbar__count"
                            :min="1"
                            :max="50"
                            v-model="activeInputFileCount"
                    />
                </template>
                <a-radio-group v-model="activeInputFileType" class="input-file-toolbar__modes">
                    <a-radio value="manual">手动编写</a-radio>
                    <a-radio value="code">代码生成</a-radio>
                </a-radio-group>
            </div>
            <div class="input-file-toolbar__actions">
                <a-button @click="renameModal=true">重命名</a-button>
                <a-button type="danger" ghost @click="deleteActiveInputFile" v-if="$store.state.inputFileList.length>1">删除</a-button>
            </div>
        </div>
        <div class="input-file-panel-main">
            <CodeInput class="input-file-panel-right" :code.sync="activeInputFileContent"/>
            <div v-if="activeInputFileType === 'code'" class="input-file-panel-left">
                <strong class="input-file-args__title">运行参数 (args)</strong>
                <div v-for="(arg,i) in activeInputFileArgs" :key="i" class="input-file-args__row">
                    <a-input
                            placeholder="参数或占位文件名"
                            :value="activeInputFileArgs[i]"
                            @input="updateActiveInputFileArgsItem(i,$event.target.value)"
                    />
                </div>
            </div>
        </div>
        <a-modal
                title="重命名当前输入文件"
                v-model="renameModal"
                @ok="renameActiveInputFile"
                cancelText="取消"
                okText="重命名"
                wrapClassName="adb-modal"
        >
            <a-input placeholder="请输入文件名" v-model="renameText" size="large"/>
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
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 16px 20px 20px;
    }

    .input-file-toolbar {
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px 16px;
        margin-bottom: 14px;
        padding: 12px 16px;
        background: var(--adb-bg-elevated, #ffffff);
        border: 1px solid var(--adb-border, rgba(15, 23, 42, 0.08));
        border-radius: var(--adb-radius-sm, 8px);
        box-shadow: var(--adb-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06));

        &__main {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px 18px;
        }

        &__label {
            font-size: 13px;
            font-weight: 600;
            color: #334155;
        }

        &__count {
            margin: 0;
        }

        &__modes {
            padding: 4px 2px;
        }

        &__actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .ant-btn {
                border-radius: var(--adb-radius-sm, 8px);
            }
        }
    }

    .input-file-panel-main {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: stretch;

        .input-file-panel-left {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            width: 232px;
            min-height: 0;
            max-height: 100%;
            overflow-y: auto;
            padding: 14px 14px 16px;
            background: var(--adb-bg-elevated, #ffffff);
            border: 1px solid var(--adb-border, rgba(15, 23, 42, 0.08));
            border-radius: var(--adb-radius-sm, 8px);
            box-shadow: var(--adb-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06));

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 6px;
                background: rgba(100, 116, 139, 0.35);
            }
        }

        .input-file-panel-right {
            flex: 1;
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }
    }

    .input-file-args__title {
        display: block;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: #475569;
        margin-bottom: 10px;
    }

    .input-file-args__row {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }

</style>
