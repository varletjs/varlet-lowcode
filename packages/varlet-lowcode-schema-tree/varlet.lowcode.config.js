module.exports = {
  name: 'varlet-lowcode-schema-tree',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
