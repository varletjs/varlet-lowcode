const { viteExternalsPlugin } = require('vite-plugin-externals')
const { ensureDirSync, copySync } = require('fs-extra')

module.exports = {
  name: 'varlet-lowcode-renderer',

  configureVite(command) {
    if (['dev', 'build'].includes(command)) {
      return {
        plugins: [
          viteExternalsPlugin({
            vue: 'Vue',
          }),
        ],
      }
    }

    return {
      plugins: [
        {
          name: 'copy-plugin',
          apply: 'build',
          closeBundle() {
            if (process.env.COMMAND === 'compile') {
              ensureDirSync('../varlet-lowcode-designer/public')
              ensureDirSync('../varlet-lowcode-skeleton/public')
              copySync(
                'lib/varlet-lowcode-renderer.umd.js',
                '../varlet-lowcode-designer/public/varlet-lowcode-renderer.umd.js'
              )
              copySync(
                'lib/varlet-lowcode-renderer.umd.js',
                '../varlet-lowcode-skeleton/public/varlet-lowcode-renderer.umd.js'
              )
            }
          },
        },
      ],
    }
  },
}
