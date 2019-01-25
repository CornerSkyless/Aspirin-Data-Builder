<template>
    <div class="app-side-bar">
        <div class="logo">LOGO</div>
        <div class="menu-item" @click="goToRightCode"
             :class="{'menu-item-active':$store.state.activePanel==='RightCode'}">
            <a-icon type="code"/>
            标程
        </div>
        <div class="menu-item menu-item-head">
            <span>
                <a-icon type="copy"/>输入文件列表
            </span>
            <a-button ghost size="small" @click="addInputFile">添加</a-button>

        </div>
        <div class="menu-item-group">
            <div class="menu-item menu-item"
                 v-for="(inputFile,i) in $store.state.inputFileList"
                 :class="{'menu-item-active':$store.state.activePanel==='InputFile' && $store.state.activeInputFileIndex === i}"
                 @click="goToInputFile(i)">
                <a-icon :type="inputFile.type==='manual' ? 'file' : 'code-sandbox'"/>
                {{inputFile.name}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'SideBar',
      methods: {
        async goToRightCode () {
          await this.$store.dispatch('updateActivePanel', 'RightCode')
          await this.$store.dispatch('updateActiveInputFileIndex', null)
        },
        async goToInputFile (index) {
          await this.$store.dispatch('updateActiveInputFileIndex', index)
          await this.$store.dispatch('updateActivePanel', 'InputFile')
        },
        async addInputFile () {
          await this.$store.dispatch('addInputFile')
        }
      }
    }
</script>

<style scoped lang="scss">
    .app-side-bar {
        background: #001529;
        height: calc(100vh - 22px);
        width: 300px;
        border-top: #00080F 1px solid;
        overflow: hidden;
        .logo {
            height: 100px;
            padding: 20px;
            color: white;
        }

        .menu-item-head {
            opacity: .65 !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .menu-item-group {
            background: #000f16;
            max-height: calc(100vh - 240px);
            .menu-item {
                padding-left: 40px;
            }
            overflow: auto;
            &::-webkit-scrollbar
            {
                width: 5px;
                height: 10px;
                background-color: #F5F5F5;
            }

            /*定义滚动条轨道 内阴影+圆角*/
            &::-webkit-scrollbar-track
            {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                border-radius: 0;
                background-color: black;
            }

            /*定义滑块 内阴影+圆角*/
            &::-webkit-scrollbar-thumb
            {
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
                background-color: #555;
            }

        }

        .menu-item {
            padding: 12px 20px;
            opacity: .65;
            color: white;
            cursor: pointer;

            i {
                margin-right: 10px;
            }

            &:hover {
                opacity: 1;
                transition: opacity .3s cubic-bezier(.645, .045, .355, 1) .3s;
            }
        }

        .menu-item-active {
            opacity: 1;
            background: #1890ff;
            border-right: 5px solid #1062AE;
        }

        .menu-item-group-active {
            opacity: 1;
        }

    }

</style>
