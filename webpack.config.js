const path = require('path')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const copy = widgetWebpack.getDefaultCopyList()
const defaultRules = widgetWebpack.getDefaultRules()

const entries = {
    'creator.js':['./src/creator.js'],
    'creator.css':['./src/creator.html','./src/creator.scss'],
    'player.js':['./src/player.js'],
    'player.css':['./src/player.html','./src/player.scss']
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
])

const customDoNothingToJs = {
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['babel-preset-env']
        }
    },
    exclude: /(node_modules|bower_components)/,
}

const customRules = [
	customDoNothingToJs,
	defaultRules.loadAndPrefixCSS,
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
