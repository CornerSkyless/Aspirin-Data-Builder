<template>
    <div class="app-header-bar">
        <div class="app-header-bar__left">
            <a-button class="app-header-bar__btn" @click="newModal = true">
                <a-icon type="file-add"/>
                新建项目
            </a-button>
        </div>
        <div class="app-header-bar__right">
            <a-button class="app-header-bar__btn" @click="openSetting">
                <a-icon type="setting"/>
                设置
            </a-button>
            <a-button class="app-header-bar__btn" @click="openExistFile">
                <a-icon type="folder-open"/>
                打开已有项目
            </a-button>
            <a-dropdown-button class="app-header-bar__btn app-header-bar__dropdown" @click="saveProjectFile">
                <a-icon type="save"/>
                保存
                <a-menu slot="overlay" @click="anotherModal=true">
                    <a-menu-item key="1">
                        <a-icon type="save"/>
                        另存为
                    </a-menu-item>
                </a-menu>
            </a-dropdown-button>
            <a-button type="primary" class="app-header-bar__btn app-header-bar__btn--primary" @click="build">
                <a-icon type="export"/>
                生成文件
            </a-button>
        </div>
        <a-modal
                title="新建文件"
                v-model="newModal"
                @ok="newFile"
                cancelText="取消"
                okText="确认"
                wrapClassName="adb-modal"
        >
            <a-input placeholder="请输入项目名称" v-model="projectName" size="large"/>
        </a-modal>
        <a-modal
                title="另存为"
                v-model="anotherModal"
                @ok="anotherSaveProject"
                cancelText="取消"
                okText="确认"
                wrapClassName="adb-modal"
        >
            <a-input placeholder="请输入项目名称" v-model="projectName" size="large"/>
        </a-modal>
        <a-modal
                title="设置"
                v-model="settingModal"
                @ok="saveSetting"
                cancelText="取消"
                okText="确认"
                wrapClassName="adb-modal"
        >
            <p class="adb-header-modal__hint">编译指令（必须包含 <code>$cppPath$</code>，表示待编译的源文件路径）</p>
            <a-input class="adb-header-modal__input" placeholder="请输入编译指令" v-model="compileCommand" size="large"/>
            <p class="adb-header-modal__pre-label">预览</p>
            <pre class="adb-header-modal__pre">{{ compileCommand.replace(/\$cppPath\$/g, '/User/xxxxx/code.cpp') }}</pre>
        </a-modal>

    </div>
</template>

<script>
    const {ipcRenderer} = require('electron')
    export default {
      name: 'HeaderBar',
      data () {
        return {
          newModal: false,
          anotherModal: false,
          settingModal: false,
          projectName: '',
          compileCommand: ''
        }
      },
      methods: {
        openSetting () {
          this.compileCommand = this.$store.state.compileCommand
          this.settingModal = true
        },
        async openExistFile () {
          try {
            await this.$store.dispatch('openExistFile')
          } catch (e) {
            if (e.message) await this.$message.error('打开失败：' + e.message)
          }
        },
        async newFile () {
          if (!this.projectName) await this.$message.error('项目名称不能为空')
          this.newModal = false
          await this.$store.dispatch('newProjectFile', this.projectName)
        },
        async saveSetting () {
          if (!this.compileCommand) await this.$message.error('编译指令不能为空')
          this.settingModal = false
          await this.$store.dispatch('updateCompileCommand', this.compileCommand)
        },
        async anotherSaveProject () {
          if (!this.projectName) await this.$message.error('项目名称不能为空')
          this.anotherModal = false
          await this.$store.dispatch('anotherSaveProject', this.projectName)
        },
        async saveProjectFile () {
          try {
            await this.$store.dispatch('saveProjectFile')
            await this.$message.success('保存成功')
          } catch (e) {
            this.$message.error('保存失败：' + e.message).then()
            if (e.message.includes('另存为')) this.anotherModal = true
          }
        },
        async build () {
          if (this.$store.getters.hasEmpty) await this.$message.error(this.$store.getters.hasEmpty)
          else if (!this.$store.state.fileLocation || !(await ipcRenderer.sendSync('check-dictionary', this.$store.getters.fileDic))) {
            this.$message.error('项目文件目录不存在，请先尝试另存为项目').then()
            this.anotherModal = true
          } else {
            const res = await this.$store.dispatch('build')
            if (res) {
              this.$success({
                title: '生成成功',
                content: '文件已保存到目录：\n' + res
              })
            }
          }
        }
      }
    }
</script>

<style scoped lang="scss">
    .app-header-bar {
        height: var(--adb-header-height, 60px);
        flex-shrink: 0;
        border-bottom: 1px solid var(--adb-border, rgba(15, 23, 42, 0.08));
        background: linear-gradient(180deg, #ffffff 0%, #fafbfd 100%);
        box-shadow: var(--adb-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06));
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        gap: 16px;

        &__left,
        &__right {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
        }

        &__right {
            justify-content: flex-end;
        }

        &__btn {
            border-radius: var(--adb-radius-sm, 8px);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;

            &--primary {
                font-weight: 600;
                border: none;
                box-shadow:
                    0 1px 2px rgba(37, 99, 235, 0.25),
                    0 0 0 1px rgba(37, 99, 235, 0.08);

                &:hover {
                    background: var(--adb-accent-hover, #1d4ed8) !important;
                }
            }
        }

        &__dropdown {
            ::v-deep .ant-btn {
                border-radius: var(--adb-radius-sm, 8px) 0 0 var(--adb-radius-sm, 8px);
            }

            ::v-deep .ant-btn.ant-dropdown-trigger {
                border-radius: 0 var(--adb-radius-sm, 8px) var(--adb-radius-sm, 8px) 0;
            }
        }
    }

</style>

<!-- Modal body is rendered outside the scoped root; keep classes prefixed. -->
<style lang="scss">
    .adb-modal .adb-header-modal__hint {
        font-size: 13px;
        color: #475569;
        line-height: 1.55;
        margin-bottom: 12px;

        code {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 4px;
            background: var(--adb-accent-soft, rgba(37, 99, 235, 0.12));
            color: var(--adb-accent, #2563eb);
        }
    }

    .adb-modal .adb-header-modal__input {
        margin-bottom: 16px;
    }

    .adb-modal .adb-header-modal__pre-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--adb-text-muted, #64748b);
        margin-bottom: 6px;
        letter-spacing: 0.04em;
    }

    .adb-modal .adb-header-modal__pre {
        font-size: 12px;
        line-height: 1.5;
        padding: 12px 14px;
        margin: 0;
        border-radius: var(--adb-radius-sm, 8px);
        background: #0f172a;
        color: #a5b4fc;
        border: 1px solid var(--adb-border, rgba(15, 23, 42, 0.08));
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
    }

</style>
