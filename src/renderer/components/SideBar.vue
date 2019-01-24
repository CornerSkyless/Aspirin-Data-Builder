<template>
    <div class="app-side-bar">
        <div class="logo">LOGO</div>
        <div class="menu-item" @click="goToRightCode" :class="{'menu-item-active':$store.state.activePanel==='RightCode'}">
            <a-icon type="code" />标程
        </div>
        <div class="menu-item menu-item-group-active"><a-icon type="copy" />输入文件列表</div>
        <div class="menu-item-group">
            <div class="menu-item menu-item"
                 v-for="(inputFile,i) in $store.state.inputFileList"
                 :class="{'menu-item-active':$store.state.activePanel==='InputFile' && $store.state.activeInputFileIndex === i}"
                 @click="goToInputFile(i)">
                <a-icon :type="inputFile.type==='manual' ? 'file' : 'code-sandbox'" />文件 {{i+1}}
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
        }
      }
    }
</script>

<style scoped lang="scss">
    .app-side-bar {
        background: #001529;
        height: calc(100vh - 22px);
        width: 240px;
        border-top: #00080F 1px solid;

        .logo {
            height: 100px;
            padding: 20px;
            color: white;
        }
        .menu-item-group{
            background: #000f16;
            .menu-item{
                padding-left: 40px;
            }
        }
        .menu-item {
            padding: 12px 20px;
            opacity: .65;
            color: white;
            cursor: pointer;
            i{
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
