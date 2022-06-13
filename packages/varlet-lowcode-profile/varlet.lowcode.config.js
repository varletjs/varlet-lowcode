module.exports = {
  name: 'varlet-lowcode-profile',
  plugins: [
    {
      name: 'copy-plugin',
      apply: 'build',
      closeBundle() {
        if (process.env.COMMAND === 'compile') {
          require('fs').copyFileSync(
            'lib/varlet-lowcode-profile.iife.js',
            '../varlet-lowcode-designer/public/varlet-lowcode-profile.iife.js'
          )

          require('fs').copyFileSync(
            'lib/varlet-lowcode-profile.iife.js',
            '../varlet-lowcode-renderer/public/varlet-lowcode-profile.iife.js'
          )
        }
      },
    },
  ],
}
