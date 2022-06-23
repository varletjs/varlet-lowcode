const { ensureDirSync, copySync } = require('fs-extra')

const destPaths = ['../varlet-lowcode-designer/public']

module.exports = {
  name: 'varlet-lowcode-core',

  configureVite(command) {
    if (command === 'compile') {
      return {
        plugins: [
          {
            name: 'copy-plugin',
            apply: 'build',
            closeBundle() {
              destPaths.forEach((destPath) => {
                ensureDirSync(destPath)
                copySync('lib/varlet-lowcode-core.umd.js', `${destPath}/varlet-lowcode-core.umd.js`)
              })
            },
          },
        ],
      }
    }
  },
}
