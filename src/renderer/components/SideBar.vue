<template>
    <div class="app-side-bar">
        <div class="logo">LOGO</div>
        <div class="menu-item"><a-icon type="code" />标程</div>
        <div class="menu-item menu-item-group-active"><a-icon type="copy" />输入文件列表</div>
        <div class="menu-item-group">
            <div class="menu-item menu-item"><a-icon type="file" />文件1</div>
            <div class="menu-item menu-item-active"><a-icon type="code-sandbox" />文件2</div>
            <div class="menu-item menu-item"><a-icon type="code-sandbox" />文件3</div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'SideBar',
      methods: {}
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
            transition: opacity .3s cubic-bezier(.645, .045, .355, 1) .3s;
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
