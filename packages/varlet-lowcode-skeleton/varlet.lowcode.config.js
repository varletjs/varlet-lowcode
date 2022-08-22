const fs = require('fs')

module.exports = {
  name: 'varlet-lowcode-skeleton',

  configureVite(config, command) {
    if (command === 'compile') {
      config.build.lib.formats = ['es']
    }

    if (command === 'build') {
      config.build.outDir.input = {
        ...config.build.outDir.input,
        preview: './playground/preview.html',
      }
    }

    if (['dev', 'build'].includes(command)) {
      config.plugins.push({
        name: 'copy-dep-plugin',
        buildStart() {
          fs.copyFileSync('../varlet-lowcode-exec/index.js', './public/varlet-lowcode-exec.js')
          fs.copyFileSync(
            '../varlet-lowcode-core/lib/varlet-lowcode-core.umd.js',
            './public/varlet-lowcode-core.umd.js'
          )
          fs.copyFileSync(
            '../varlet-lowcode-renderer/lib/varlet-lowcode-renderer.umd.js',
            './public/varlet-lowcode-renderer.umd.js'
          )
          fs.copyFileSync(
            '../varlet-lowcode-profile/lib/varlet-lowcode-profile.umd.js',
            './public/varlet-lowcode-profile.umd.js'
          )
        },
      })
    }
  },
}
