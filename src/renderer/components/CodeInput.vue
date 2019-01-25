<template>
    <div id="code-input">
        <codemirror v-model="myCode" :options="editorOptions"  class="CodeMirror"></codemirror>
    </div>
</template>
<style lang="scss">
    .CodeMirror {
        height: 450px!important;
        min-height: 100%;
        overflow-y: hidden;
        ::-webkit-scrollbar
         {
             width: 10px;
             height: 10px;
             background-color: #F5F5F5;
         }

        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track
         {
             -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
             border-radius: 0;
             background-color: black;
         }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb
         {
             border-radius: 5px;
             -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
             background-color: #555;
         }
    }
</style>
<script>
    export default {
      name: 'CodeInput',
      props: ['code'],
      data () {
        return {
          myCode: this.code || ''
        }
      },
      watch: {
        myCode (value) {
          this.$emit('update:code', value)
        },
        code (value) {
          this.myCode = value
        }
      },
      methods: {},
      computed: {
        editorOptions () {
          return {
            tabSize: 4,
            theme: 'material',
            mode: {name: 'text/x-c++src'},
            placeholder: '输入你的代码',
            lineNumbers: true,
            line: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            styleSelectedText: true,
            matchBrackets: true,
            highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
          }
        }

      },
      components: {}

    }
</script>
