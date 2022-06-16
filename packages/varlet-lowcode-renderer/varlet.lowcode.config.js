module.exports = {
  name: 'varlet-lowcode-renderer',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          require('fs').copyFileSync(
            'lib/varlet-lowcode-renderer.umd.js',
            '../varlet-lowcode-designer/public/varlet-lowcode-renderer.umd.js'
          )
        }
      },
    },
  ],
}
