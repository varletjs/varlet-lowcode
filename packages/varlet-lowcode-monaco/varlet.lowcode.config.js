module.exports = {
  name: 'varlet-lowcode-monaco',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
