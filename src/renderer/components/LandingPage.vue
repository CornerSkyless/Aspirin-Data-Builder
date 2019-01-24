<template>
    <div id="wrapper">
        <TopBar/>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import TopBar from './TopBar'

    export default {
      name: 'landing-page',
      components: {TopBar, SystemInformation},
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


</style>
