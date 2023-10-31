const path = require('path')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const copy = widgetWebpack.getDefaultCopyList()
const defaultRules = widgetWebpack.getDefaultRules()
const srcPath = path.join(__dirname, 'src')

const entries = {
	'player': [
		path.join(srcPath, 'player.html'),
		path.join(srcPath, 'player.js'),
		path.join(srcPath, 'player.scss')
	],
	'creator': [
		path.join(srcPath, 'creator.html'),
		path.join(srcPath, 'creator.js'),
		path.join(srcPath, 'creator.scss')
	]
}

const customCopy = copy.concat([
	{
		from: path.join(__dirname, 'node_modules', 'angular-chart.js', 'dist', 'angular-chart.min.js'),
		to: path.join(__dirname, 'build', 'vendor')
	},
	{
		from: path.join(__dirname, 'node_modules', 'angular-chart.js', 'dist', 'angular-chart.min.css'),
		to: path.join(__dirname, 'build', 'vendor')
	},
	{
		from: path.join(__dirname, 'src', '_guides', 'assets'),
		to: path.join(__dirname, 'build', 'guides', 'assets'),
		toType: 'dir'
	}
])

const babelLoaderWithPolyfillRule = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env']
		}
	}
}

const customRules = [
	babelLoaderWithPolyfillRule,
	defaultRules.loadAndPrefixSASS,
	defaultRules.loadHTMLAndReplaceMateriaScripts,
	defaultRules.copyImages,
]

let options = {
	copyList: customCopy,
	entries: entries,
	moduleRules: customRules
}

// load the reusable legacy webpack config from materia-widget-dev
module.exports =  widgetWebpack.getLegacyWidgetBuildConfig(options)
