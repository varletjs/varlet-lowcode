const { ensureDirSync, copySync } = require('fs-extra')

module.exports = {
  name: 'varlet-lowcode-dnd',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          ensureDirSync('../varlet-lowcode-renderer/public')
          copySync(
            'lib/varlet-lowcode-dnd.umd.js',
            '../varlet-lowcode-renderer/public/varlet-lowcode-dnd.umd.js'
          )
        }
      },
    },
  ],
}
