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
                wrapClassName="adb-modal adb-modal--build"
        >
            <template slot="footer"></template>
            <div class="adb-build-progress">
                <a-progress type="circle" :percent="$store.state.progress" :width="88" :status="status"/>
            </div>
            <p class="adb-build-status" v-if="!$store.state.buildError">{{$store.state.buildStatus}}</p>
            <p class="adb-build-error">{{$store.state.buildError}}</p>
        </a-modal>
        <a-modal
                v-model="needUpdate"
                title="有新版本啦"
                @ok="downloadNewest"
                wrapClassName="adb-modal adb-modal--update"
        >
            <div class="adb-update-meta">
                当前版本 {{$store.state.version}} · 最新版本 {{latest.version}}
            </div>
            <div class="adb-update-list">
                <div class="adb-update-block" v-for="version of versions" :key="version.version">
                    <div class="adb-update-version">{{version.version}}</div>
                    <ul class="adb-update-items">
                        <li v-for="(update, idx) of version.updates" :key="idx">{{update}}</li>
                    </ul>
                </div>
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
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans 3', 'Source Sans Pro', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #1e293b;
    }

    #wrapper {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--adb-sidebar-deep);
    }

    .app-window {
        display: flex;
        width: 100%;
        flex: 1;
        min-height: 0;

        .app-right {
            background:
                radial-gradient(120% 80% at 100% 0%, rgba(37, 99, 235, 0.06) 0%, transparent 55%),
                linear-gradient(165deg, #f4f6fb 0%, #e9edf5 42%, #eef1f6 100%);
            height: calc(100vh - var(--adb-topbar-height, 28px));
            width: 100%;
            overflow: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
    }

    /* Modal polish (wrapClassName applies to outer wrap; inner uses deep selectors via global class names on children) */
    .adb-modal .ant-modal-header {
        border-bottom: 1px solid var(--adb-border);
        padding: 18px 24px;
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .adb-modal .ant-modal-title {
        font-weight: 600;
        letter-spacing: 0.02em;
    }

    .adb-modal .ant-modal-body {
        padding: 24px;
    }

    .adb-modal .ant-modal-content {
        border-radius: var(--adb-radius, 10px);
        overflow: hidden;
        box-shadow: var(--adb-shadow-md), 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .adb-build-progress {
        display: flex;
        justify-content: center;
        margin-bottom: 18px;
    }

    .adb-build-status {
        text-align: center;
        color: var(--adb-text-muted);
        font-size: 14px;
        line-height: 1.6;
        min-height: 1.5em;
    }

    .adb-build-error {
        text-align: center;
        color: #dc2626;
        font-size: 13px;
        margin-top: 8px;
        min-height: 1.5em;
    }

    .adb-update-meta {
        font-size: 14px;
        color: var(--adb-text-muted);
        margin-bottom: 16px;
        padding: 12px 14px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid var(--adb-border);
    }

    .adb-update-list {
        max-height: 360px;
        overflow-y: auto;
        padding-right: 4px;
    }

    .adb-update-block {
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .adb-update-version {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
        color: #0f172a;
    }

    .adb-update-items {
        list-style: none;
        padding-left: 0;

        li {
            position: relative;
            padding-left: 14px;
            margin-bottom: 6px;
            font-size: 13px;
            color: #475569;
            line-height: 1.5;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0.55em;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: var(--adb-accent);
                opacity: 0.75;
            }
        }
    }

</style>
