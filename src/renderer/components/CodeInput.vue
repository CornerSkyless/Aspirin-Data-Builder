<template>
    <div id="code-input">
        <codemirror v-model="myCode" :options="editorOptions"  class="CodeMirror"></codemirror>
    </div>
</template>
<style>
    .CodeMirror {
        height: 450px!important;
        min-height: 100%;
        overflow-y: hidden;
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
          let options = {
            tabSize: 4,
            theme: 'material',
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
          options.mode = 'text/x-c++src'
          return options
        }

      },
      components: {}

    }
</script>
