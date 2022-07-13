module.exports = {
  name: 'varlet-lowcode-code-data-source',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
