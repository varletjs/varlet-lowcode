module.exports = {
  name: 'varlet-lowcode-materials-panel',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
