module.exports = {
  name: 'varlet-lowcode-dnd',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
