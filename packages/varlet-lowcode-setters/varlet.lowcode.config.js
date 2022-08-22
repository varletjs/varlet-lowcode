module.exports = {
  name: 'varlet-lowcode-setters',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
