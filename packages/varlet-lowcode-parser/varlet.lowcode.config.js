module.exports = {
  name: 'varlet-lowcode-parser',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
