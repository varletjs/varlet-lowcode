module.exports = {
  name: 'varlet-lowcode-designer',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
