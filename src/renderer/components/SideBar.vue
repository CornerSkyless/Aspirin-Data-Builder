<template>
    <div class="app-side-bar">
        <div class="logo">
            <img id="logo" src="~@/assets/logo.png" alt="Aspirin Data Builder" class="logo__img">
        </div>
        <div class="menu-item menu-item--nav" @click="goToRightCode"
             :class="{'menu-item--active':$store.state.activePanel==='RightCode'}">
            <a-icon type="code" class="menu-item__icon"/>
            <span class="menu-item__label">标程</span>
        </div>
        <div class="menu-item menu-item--section">
            <span class="menu-item__head">
                <a-icon type="copy" class="menu-item__icon"/>输入文件列表
            </span>
            <a-button type="primary" ghost size="small" class="menu-item__add" @click.stop="addInputFile">添加</a-button>
        </div>
        <div class="menu-item-group">
            <div class="menu-item menu-item--file"
                 v-for="(inputFile,i) in $store.state.inputFileList"
                 :key="i"
                 :class="{'menu-item--active':$store.state.activePanel==='InputFile' && $store.state.activeInputFileIndex === i}"
                 @click="goToInputFile(i)">
                <a-icon :type="inputFile.type==='manual' ? 'file' : 'code-sandbox'" class="menu-item__icon"/>
                <span class="menu-item__label">
                    <span v-if="inputFile.type==='code'" class="menu-item__badge">{{inputFile.count}}×</span>
                    {{inputFile.name}}
                </span>
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
        --adb-sb-pad-x: 14px;
        background: linear-gradient(180deg, var(--adb-sidebar, #0f172a) 0%, var(--adb-sidebar-deep, #020617) 72%);
        height: calc(100vh - var(--adb-topbar-height, 28px));
        width: var(--adb-sidebar-width, 260px);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.35);
        overflow-x: hidden;
        flex-shrink: 0;
        box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.04);

        .logo {
            height: 96px;
            padding: 18px var(--adb-sb-pad-x);
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .logo__img {
            height: 52px;
            width: auto;
            filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
        }

        .menu-item-group {
            background: var(--adb-sidebar-group, rgba(2, 6, 23, 0.55));
            max-height: calc(100vh - var(--adb-topbar-height, 28px) - 236px);
            overflow: auto;
            margin-top: 2px;
            padding: 6px 0 12px;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 6px;
                background: rgba(148, 163, 184, 0.35);

                &:hover {
                    background: rgba(148, 163, 184, 0.5);
                }
            }

            &:empty {
                padding: 8px var(--adb-sb-pad-x);
            }
        }

        .menu-item {
            margin: 0 10px;
            padding: 11px 14px;
            border-radius: var(--adb-radius-sm, 8px);
            color: rgba(226, 232, 240, 0.72);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            line-height: 1.35;
            transition:
                color 0.18s var(--adb-ease-out, ease),
                background 0.18s var(--adb-ease-out, ease),
                opacity 0.18s var(--adb-ease-out, ease);

            &:hover:not(.menu-item--section) {
                color: #f8fafc;
                background: rgba(255, 255, 255, 0.06);
            }
        }

        .menu-item__icon {
            font-size: 15px;
            opacity: 0.9;
        }

        .menu-item__label {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .menu-item__badge {
            display: inline-block;
            margin-right: 6px;
            padding: 0 5px;
            font-size: 11px;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            color: rgba(191, 219, 254, 0.95);
            background: rgba(37, 99, 235, 0.35);
            border-radius: 4px;
            vertical-align: 1px;
        }

        .menu-item--nav {
            margin-top: 10px;
        }

        .menu-item--section {
            margin-top: 16px;
            opacity: 1;
            color: rgba(148, 163, 184, 0.92);
            cursor: default;
            justify-content: space-between;
            gap: 12px;
        }

        .menu-item__head {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.03em;
            text-transform: none;
        }

        .menu-item__add {
            border-color: rgba(96, 165, 250, 0.45) !important;
            color: #93c5fd !important;
            font-size: 12px;
            height: 26px;
            padding: 0 10px;
            border-radius: 6px;

            &:hover {
                border-color: rgba(147, 197, 253, 0.85) !important;
                color: #fff !important;
                background: rgba(37, 99, 235, 0.25) !important;
            }
        }

        .menu-item--file {
            margin: 3px 10px 3px 18px;
            padding-left: 12px;
            border-left: 2px solid transparent;
        }

        .menu-item--active {
            color: #f8fafc !important;
            background: linear-gradient(90deg, var(--adb-accent-soft, rgba(37, 99, 235, 0.2)) 0%, rgba(37, 99, 235, 0.08) 100%) !important;
            box-shadow: inset 3px 0 0 var(--adb-accent, #2563eb);
        }

        .menu-item--active .menu-item__icon {
            color: #93c5fd;
        }
    }

</style>
