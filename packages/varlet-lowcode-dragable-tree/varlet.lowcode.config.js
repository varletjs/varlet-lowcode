module.exports = {
  name: 'varlet-lowcode-dragable-tree',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
