const { ensureDirSync, copySync } = require('fs-extra')

module.exports = {
  name: 'varlet-lowcode-selector',

  configureVite(command) {
    if (command === 'compile') {
      return {
        plugins: [
          {
            name: 'copy-plugin',
            apply: 'build',
            closeBundle() {
              if (process.env.COMMAND === 'compile') {
                ensureDirSync('../varlet-lowcode-renderer/public')
                copySync(
                  'lib/varlet-lowcode-selector.umd.js',
                  '../varlet-lowcode-renderer/public/varlet-lowcode-selector.umd.js'
                )
              }
            },
          },
        ],
      }
    }
  },
}
