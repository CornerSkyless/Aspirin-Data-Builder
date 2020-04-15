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
        <span>Aspirin Data Builder {{$store.state.version}} | {{$store.state.fileLocation || '数据生成器'}}</span>
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
        background: #001529;
        height: 22px;
        -webkit-user-select: none;
        -webkit-app-region: drag;
        color: #b1b7bf;
        text-align: center;
        position: relative;
        font-size: 14px;

        .button-area {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;


            .button-area-btn {
                height: 12px;
                width: 12px;
                border-radius: 6px;
                margin-left: 8px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;

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
                background: #f75c54;
                color: #97087f;
            }

            .button-area-minus-btn {
                background: #febc49;
                color: #985619;
            }
        }
    }

</style>
