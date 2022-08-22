module.exports = {
  name: 'varlet-lowcode-code-data-source',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
