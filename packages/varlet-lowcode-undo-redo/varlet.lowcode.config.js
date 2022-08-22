module.exports = {
  name: 'varlet-lowcode-undo-redo',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
