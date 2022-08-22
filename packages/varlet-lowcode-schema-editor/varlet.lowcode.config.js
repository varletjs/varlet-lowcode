module.exports = {
  name: 'varlet-lowcode-schema-editor',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
