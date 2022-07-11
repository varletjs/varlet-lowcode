module.exports = {
  name: 'varlet-lowcode-designer',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
