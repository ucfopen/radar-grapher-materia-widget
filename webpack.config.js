const path = require('path')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const copy = widgetWebpack.getDefaultCopyList()
const defaultRules = widgetWebpack.getDefaultRules()

const entries = {
	'creator.js':['./src/creator.js'],
	'creator.css':['./src/creator.html','./src/creator.scss'],
	'player.js':['./src/player.js'],
	'player.css':['./src/player.html','./src/player.scss'],
	'guides/creator.temp.html':['./src/_guides/creator.md'],
	'guides/player.temp.html':['./src/_guides/player.md']
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
	defaultRules.loadAndPrefixCSS,
	defaultRules.loadAndPrefixSASS,
	defaultRules.loadHTMLAndReplaceMateriaScripts,
	defaultRules.copyImages,
	defaultRules.loadAndCompileMarkdown
]

let options = {
	copyList: customCopy,
	entries: entries,
	moduleRules: customRules
}

// load the reusable legacy webpack config from materia-widget-dev
module.exports =  widgetWebpack.getLegacyWidgetBuildConfig(options)
