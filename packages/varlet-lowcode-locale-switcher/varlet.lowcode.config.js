module.exports = {
  name: 'varlet-lowcode-locale-switcher',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
