module.exports = {
  name: 'varlet-lowcode-resizer',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
