module.exports = {
  name: 'varlet-lowcode-draggable-tree',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
