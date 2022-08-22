module.exports = {
  name: 'varlet-lowcode-selector',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
