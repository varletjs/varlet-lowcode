module.exports = {
  name: 'varlet-lowcode-core',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          require('fs').copyFileSync(
            'lib/varlet-lowcode-core.iife.js',
            '../varlet-lowcode-designer/public/varlet-lowcode-core.iife.js'
          )
        }
      },
    },
  ],
}
