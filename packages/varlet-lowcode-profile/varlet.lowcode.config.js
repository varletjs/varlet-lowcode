const { ensureDirSync, copySync } = require('fs-extra')

const destPaths = ['../varlet-lowcode-designer/public', '../varlet-lowcode-skeleton/public']

module.exports = {
  name: 'varlet-lowcode-profile',

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
                copySync('lib/varlet-lowcode-profile.umd.js', `${destPath}/varlet-lowcode-profile.umd.js`)
              })
            },
          },
        ],
      }
    }
  },
}
