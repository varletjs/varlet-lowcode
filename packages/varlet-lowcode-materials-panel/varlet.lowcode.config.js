module.exports = {
  name: 'varlet-lowcode-materials-panel',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
