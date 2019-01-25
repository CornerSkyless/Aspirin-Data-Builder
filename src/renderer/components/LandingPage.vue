<template>
    <div id="wrapper">
        <TopBar/>
        <div class="app-window">
            <SideBar/>
            <div class="app-right">
                <HeaderBar/>
                <RightCodePanel v-if="$store.state.activePanel==='RightCode'"/>
                <InputFilePanel v-if="$store.state.activePanel==='InputFile'"/>
            </div>
        </div>
        <a-modal
                v-model="isBuilding"
                title="生成文件"
                :maskClosable="false"
                :footer="null"
        >
            <template slot="footer"></template>
            <div style="text-align: center;margin-bottom: 10px">
                <a-progress type="circle" :percent="$store.state.progress" :width="80" :status="status" />

            </div>
            <p v-if="!$store.state.buildError">{{$store.state.buildStatus}}</p>
            <p>{{$store.state.buildError}}</p>
        </a-modal>
    </div>
</template>

<script>
    import TopBar from './TopBar'
    import SideBar from './SideBar'
    import HeaderBar from './HeaderBar'
    import RightCodePanel from './RightCodePanel'
    import InputFilePanel from './InputFilePanel'

    export default {
      name: 'landing-page',
      components: {InputFilePanel, RightCodePanel, HeaderBar, SideBar, TopBar},
      computed: {
        status () {
          if (this.$store.state.buildError) return 'exception'
          else return null
        },
        isBuilding: {
          get () {
            return this.$store.state.isBuilding
          },
          async set (value) {
            await this.$store.dispatch('updateIsBuilding', value)
          }
        }
      },
      methods: {
        open (link) {
          this.$electron.shell.openExternal(link)
        }
      },
      async created () {
        await this.$store.dispatch('updateIsBuilding', false)
      }
    }
</script>

<style type="text/scss" lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    .app-window {
        display: flex;

        .app-right {
            background: #eef0f3;
            height: calc(100vh - 22px);
            width: 100%;
        }
    }

</style>
