module.exports = {
  name: 'varlet-lowcode-schema-editor',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
