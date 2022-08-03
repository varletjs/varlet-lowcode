module.exports = {
  name: 'varlet-lowcode-parser',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
