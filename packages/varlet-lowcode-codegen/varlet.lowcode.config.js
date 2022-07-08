module.exports = {
  name: 'varlet-lowcode-codegen',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
