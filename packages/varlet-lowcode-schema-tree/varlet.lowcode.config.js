module.exports = {
  name: 'varlet-lowcode-schema-tree',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
