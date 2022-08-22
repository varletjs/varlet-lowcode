module.exports = {
  name: 'varlet-lowcode-core',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['umd']
    }
  },
}
