const path = require('path')
const srcPath = path.join(process.cwd(), 'src')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const copy = widgetWebpack.getDefaultCopyList()

const entries = {
	'creator': [
		path.join(srcPath, 'creator.html'),
		path.join(srcPath, 'creator.scss'),
		path.join(srcPath, 'creator.js')
	],
	'player': [
		path.join(srcPath, 'player.html'),
		path.join(srcPath, 'player.scss'),
		path.join(srcPath, 'player.js')
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

let options = {
	copyList: customCopy,
	entries: entries,
}

module.exports =  widgetWebpack.getLegacyWidgetBuildConfig(options)
