module.exports = {
  name: 'varlet-lowcode-undo-redo',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
