<template>
    <div id="wrapper">
        <TopBar/>
        <div class="app-window">
            <SideBar/>
            <div class="app-right">
                <HeaderBar/>
            </div>
        </div>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import TopBar from './TopBar'
    import SideBar from './SideBar'
    import HeaderBar from './HeaderBar'

    export default {
      name: 'landing-page',
      components: {HeaderBar, SideBar, TopBar, SystemInformation},
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
