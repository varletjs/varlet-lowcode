module.exports = {
  name: 'varlet-lowcode-renderer',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['umd']
    }
  },
}
