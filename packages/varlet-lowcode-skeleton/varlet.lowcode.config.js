module.exports = {
  name: 'varlet-lowcode-skeleton',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
