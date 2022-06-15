module.exports = {
  name: 'varlet-lowcode-codegen',
  define: {
    'process.env': {},
    Buffer: {},
  },
  plugins: [
    {
      name: 'transform-jszip-buffer',

      transform(code, id) {
        if (id.includes('jszip')) {
          code = code.replaceAll('typeof define_Buffer_default', '"undefined"')
        }

        return { code }
      },
    },
  ],
}
