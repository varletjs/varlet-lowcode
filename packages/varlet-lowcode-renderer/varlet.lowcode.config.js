const { viteExternalsPlugin } = require('vite-plugin-externals')

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
            require('fs').copyFileSync(
              'lib/varlet-lowcode-renderer.umd.js',
              '../varlet-lowcode-designer/public/varlet-lowcode-renderer.umd.js'
            )
          },
        },
      ],
    }
  },
}
