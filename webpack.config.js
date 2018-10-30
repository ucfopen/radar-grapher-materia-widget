const path = require('path')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const copy = widgetWebpack.getDefaultCopyList()

const customCopy = copy.concat([
	{
		from: path.join(__dirname, 'node_modules', 'angular-chart.js', 'dist', 'angular-chart.min.js'),
		to: path.join(__dirname, 'build', 'vendor')
	},
	{
		from: path.join(__dirname, 'node_modules', 'angular-chart.js', 'dist', 'angular-chart.min.css'),
		to: path.join(__dirname, 'build', 'vendor')
	},
])

let options = {
	copyList: customCopy
}

// load the reusable legacy webpack config from materia-widget-dev
module.exports =  widgetWebpack.getLegacyWidgetBuildConfig(options)
