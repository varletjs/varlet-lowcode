module.exports = {
  name: 'varlet-lowcode-codegen',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
