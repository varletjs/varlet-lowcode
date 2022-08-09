module.exports = {
  name: 'varlet-lowcode-draggable-tree',
  port: 8066,

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
