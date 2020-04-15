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
                <a-progress type="circle" :percent="$store.state.progress" :width="80" :status="status"/>

            </div>
            <p v-if="!$store.state.buildError">{{$store.state.buildStatus}}</p>
            <p>{{$store.state.buildError}}</p>
        </a-modal>
        <a-modal
                v-model="needUpdate"
                title="有新版本啦"
                @ok="downloadNewest"
        >
            <h3 style="margin-bottom: 15px">当前版本 {{$store.state.version}} | 最新版本 {{latest.version}}</h3>
            <div v-for="version of versions">
                <h4>{{version.version}}</h4>
                <p v-for="update of version.updates">- {{update}}</p>
            </div>
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
      data () {
        return {
          needUpdate: false,
          latest: {},
          versions: []
        }
      },
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
        downloadNewest () {
          this.$electron.shell.openExternal(this.latest.url)
          this.needUpdate = false
        }
      },
      async created () {
        this.$store.commit('refreshVersion')
        await this.$store.dispatch('updateIsBuilding', false)
        this.$http.get('https://public.noi.top/AspirinDataBuilderVersions.json?' + (new Date()).valueOf()).then(
          (res) => {
            if (res && res.data) {
              this.latest = res.data[0]
              if (this.latest.version > this.$store.state.version) this.needUpdate = true
              this.versions = res.data
            }
          }
        ).catch(e => {
          console.log(e)
        })
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
        width: 100%;
        .app-right {
            background: #eef0f3;
            height: calc(100vh - 22px);
            width: 100%;
            overflow: hidden;
            flex: 1;
            /*flex-grow: 1;*/
        }
    }

</style>
