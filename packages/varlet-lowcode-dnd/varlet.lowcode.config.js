module.exports = {
  name: 'varlet-lowcode-dnd',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          require('fs').copyFileSync(
            'lib/varlet-lowcode-dnd.umd.js',
            '../varlet-lowcode-renderer/public/varlet-lowcode-dnd.umd.js'
          )
        }
      },
    },
  ],
}
