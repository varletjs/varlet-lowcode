module.exports = {
  name: 'varlet-lowcode-locale-switcher',

  configureVite(command, config) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }
  },
}
