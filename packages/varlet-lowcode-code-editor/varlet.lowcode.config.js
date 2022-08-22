module.exports = {
  name: 'varlet-lowcode-code-editor',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
