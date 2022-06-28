module.exports = {
  name: 'varlet-lowcode-monaco',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
      config.build.rollupOptions.external.push(
        'monaco-editor/esm/vs/editor/editor.worker?worker',
        'monaco-editor/esm/vs/language/json/json.worker?worker',
        'monaco-editor/esm/vs/language/css/css.worker?worker',
        'monaco-editor/esm/vs/language/html/html.worker?worker',
        'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
      )
    }
  },
}
