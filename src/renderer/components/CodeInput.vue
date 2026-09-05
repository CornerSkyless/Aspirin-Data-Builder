<template>
    <div id="code-input" class="code-input">
        <codemirror v-model="myCode" :options="editorOptions" class="CodeMirror"></codemirror>
    </div>
</template>
<style lang="scss">
    .code-input {
        flex: 1;
        min-height: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: var(--adb-radius, 10px);
        overflow: hidden;
        border: 1px solid var(--adb-border, rgba(15, 23, 42, 0.12));
        box-shadow: var(--adb-shadow-md, 0 4px 14px rgba(15, 23, 42, 0.08));
        background: #263238;
    }

    .code-input .CodeMirror {
        flex: 1;
        min-height: 240px;
        height: 100% !important;
        max-width: 100%;
        font-size: 13px;
        overflow-y: auto;

        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: rgba(148, 163, 184, 0.35);

            &:hover {
                background: rgba(148, 163, 184, 0.55);
            }
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
