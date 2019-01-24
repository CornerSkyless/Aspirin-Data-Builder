<template>
    <div class="app-header-bar">
        <a-button>
            <a-icon type="file-add"/>
            新建项目
        </a-button>
        <div>
            <a-button-group style="margin-right: 10px">
                <a-button>
                    <a-icon type="folder-open"/>
                    打开已有项目
                </a-button>
                <a-button>
                    <a-icon type="save"/>
                    保存
                </a-button>
            </a-button-group>
            <a-button type="primary">
                <a-icon type="export"/>
                生成文件
            </a-button>
        </div>

    </div>
</template>

<script>
    export default {
      name: 'HeaderBar',
      methods: {}
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
