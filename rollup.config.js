// reference: https: //github.com/KELEN/ImageFile
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import json from 'rollup-plugin-json'
import butternut from 'rollup-plugin-butternut'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import butternut from 'rollup-plugin-butternut';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'ImageFile',
			file: pkg.browser,
			format: 'umd',
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			babel({
				exclude: 'node_modules/**',
				babelrc: false,
				presets: [
					["env", { "modules": false }]
				],
				plugins: [
					'external-helpers'
				]
			}),
			butternut()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			babel({
				exclude: 'node_modules/**',
				babelrc: false,
				presets: [
					["env", { "modules": false }]
				],
				plugins: [
					'external-helpers'
				]
			}),
			butternut()
		]
	}
];

import yaml from 'rollup-plugin-yaml'

process.traceDeprecation = true
export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: pkg.name,
      globals: {
        'd3': 'd3',
        'd3-selection': 'd3',
        'd3-transition': 'd3'
      }
    },
    watch: {
      exclude: 'node_modules/**'
    },
    external: Object.keys(pkg.dependencies).concat([
      'path',
      'fs',
      'os',
      'd3'
    ]),
    plugins: {
      resolve() , // so Rollup can find 'commonjs'
      // rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测
      commonjs(), // so Rollup can convert commonjs module to an ES module
      json()
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          ["env", {
            "modules": false
          }]
        ],
        plugins: ['external-helpers'],
      }),
      butternut(),
      serve('dist'),
      // uglify()
    },
    onwarn({
      code,
      message
    }) {
      if (code !== 'UNRESOLVED_IMPORT') {
        console.warn(message)
      } else if (code === 'PARSE_ERROR') {
        console.warn('parse错误:', message)
      }
    }
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
  input: 'src/index.js',
  output:[{
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ]
  watch: {
    exclude: 'node_modules/**'
  },
  external: Object.keys(pkg.dependencies).concat([
    'path',
    'fs',
    'os',
    'd3'
  ]),
    plugins: {
      json(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers'],
      }),
      butternut(),
      serve('dist'),
      // uglify()
    },
  onwarn({
    code,
    message
  }) {
    if (code !== 'UNRESOLVED_IMPORT') {
      console.warn(message)
    }
  }
},
];
  