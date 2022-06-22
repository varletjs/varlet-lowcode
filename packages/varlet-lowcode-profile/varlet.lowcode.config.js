const { ensureDirSync, copySync } = require('fs-extra')

const destPaths = ['../varlet-lowcode-designer/public']

module.exports = {
  name: 'varlet-lowcode-profile',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          destPaths.forEach((destPath) => {
            ensureDirSync(destPath)
            copySync('lib/varlet-lowcode-profile.umd.js', `${destPath}/varlet-lowcode-profile.umd.js`)
          })
        }
      },
    },
  ],
}
