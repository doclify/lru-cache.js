const path = require('path')
const { terser } = require('rollup-plugin-terser')

const resolve = _path => path.resolve(__dirname, '../', _path)

export default [
  {
    input: resolve('src/LRU.js'),
    output: [
      {
        file: resolve('dist/lru.cjs.js'),
        format: "cjs",
      },
      {
        file: resolve('dist/lru.esm.js'),
        format: "es",
        compact: true,
        plugins: [terser()],
      },
      {
        file: resolve('dist/lru.js'),
        name: "LRUCache",
        format: "umd",
        compact: true,
        plugins: [terser()],
      },
    ],
  },
]