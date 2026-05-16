<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'aspirin-data-builder'
  }
</script>

<style>
  :root {
    --adb-topbar-height: 28px;
    --adb-header-height: 60px;
    --adb-sidebar-width: 260px;
    --adb-bg-main: #eef1f6;
    --adb-bg-elevated: #ffffff;
    --adb-border: rgba(15, 23, 42, 0.08);
    --adb-text-muted: #64748b;
    --adb-accent: #2563eb;
    --adb-accent-hover: #1d4ed8;
    --adb-accent-soft: rgba(37, 99, 235, 0.12);
    --adb-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
    --adb-shadow-md: 0 4px 14px rgba(15, 23, 42, 0.08);
    --adb-radius: 10px;
    --adb-radius-sm: 8px;
    --adb-sidebar: #0f172a;
    --adb-sidebar-deep: #020617;
    --adb-sidebar-group: rgba(2, 6, 23, 0.55);
    --adb-ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  }

  #app {
    height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .ant-btn .anticon + span {
    margin-left: 6px;
  }
</style>
