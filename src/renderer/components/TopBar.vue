<template>
    <div class="app-top-bar" style="-webkit-app-region: drag;">
        <div class="button-area">
            <div class="button-area-btn button-area-close-btn" @click="close">
                <a-icon type="close"/>
            </div>
            <div class="button-area-btn button-area-minus-btn" @click="minus">
                <a-icon type="minus"/>
            </div>
        </div>
        <span class="app-top-bar__title">
            <span class="app-top-bar__name">Aspirin Data Builder</span>
            <span class="app-top-bar__sep" aria-hidden="true">·</span>
            <span class="app-top-bar__ver">v{{$store.state.version}}</span>
            <span class="app-top-bar__sep" aria-hidden="true">·</span>
            <span class="app-top-bar__path" :title="$store.state.fileLocation || '数据生成器'">{{$store.state.fileLocation || '数据生成器'}}</span>
        </span>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron')
    export default {
      name: 'TopBar',
      methods: {
        close () {
          ipcRenderer.sendSync('close-window', true)
        },
        minus () {
          ipcRenderer.sendSync('minus-window', true)
        }
      }
    }
</script>

<style scoped lang="scss">
    .app-top-bar {
        width: 100%;
        background: linear-gradient(180deg, #1e293b 0%, #0f172a 55%, #0c1222 100%);
        height: var(--adb-topbar-height, 28px);
        -webkit-user-select: none;
        -webkit-app-region: drag;
        color: rgba(226, 232, 240, 0.82);
        text-align: center;
        position: relative;
        font-size: 12px;
        letter-spacing: 0.02em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.2);

        &__title {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            max-width: calc(100% - 120px);
            padding: 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__name {
            font-weight: 600;
            color: #f8fafc;
        }

        &__ver {
            font-variant-numeric: tabular-nums;
            opacity: 0.85;
        }

        &__sep {
            opacity: 0.35;
            font-weight: 400;
        }

        &__path {
            opacity: 0.75;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .button-area {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;

            -webkit-app-region: no-drag;

            .button-area-btn {
                height: 13px;
                width: 13px;
                border-radius: 50%;
                margin-left: 9px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18);
                transition: transform 0.15s ease, filter 0.15s ease;

                &:active {
                    transform: scale(0.92);
                }

                i {
                    font-size: 8px;
                    display: none;
                }
            }

            &:hover {
                .button-area-btn {
                    i {
                        display: inline-block;
                    }
                }
            }

            .button-area-close-btn {
                background: #ff5f57;
                color: rgba(80, 20, 15, 0.95);
            }

            .button-area-minus-btn {
                background: #febc2e;
                color: rgba(90, 55, 10, 0.95);
            }
        }
    }

</style>
