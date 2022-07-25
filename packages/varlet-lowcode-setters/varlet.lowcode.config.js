module.exports = {
  name: 'varlet-lowcode-setters',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
