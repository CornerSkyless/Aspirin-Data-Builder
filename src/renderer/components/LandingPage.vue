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
      methods: {
        open (link) {
          this.$electron.shell.openExternal(link)
        }
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
