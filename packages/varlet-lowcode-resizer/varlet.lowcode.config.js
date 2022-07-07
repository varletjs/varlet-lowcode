module.exports = {
  name: 'varlet-lowcode-resizer',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
