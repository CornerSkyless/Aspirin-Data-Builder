<template>
    <div class="app-header-bar">
        <a-button @click="newModal = true">
            <a-icon type="file-add"/>
            新建项目
        </a-button>
        <div>
            <a-button @click="openExistFile">
                <a-icon type="folder-open"/>
                打开已有项目
            </a-button>
            <a-dropdown-button @click="saveProjectFile">
                <a-icon type="save"/>
                保存

                <a-menu slot="overlay" @click="anotherModal=true">
                    <a-menu-item key="1">
                        <a-icon type="save"/>
                        另存为
                    </a-menu-item>
                </a-menu>
            </a-dropdown-button>
            <a-button type="primary" @click="build">
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
        >
            <a-input placeholder="请输入项目名称" v-model="projectName"/>
        </a-modal>
        <a-modal
                title="另存为"
                v-model="anotherModal"
                @ok="anotherSaveProject"
                cancelText="取消"
                okText="确认"
        >
            <a-input placeholder="请输入项目名称" v-model="projectName"/>
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
          projectName: ''
        }
      },
      methods: {
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
        height: 60px;
        border-bottom: #e4e4e4 1px solid;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
    }

</style>
