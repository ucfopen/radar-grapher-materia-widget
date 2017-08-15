const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const baseConfig = require("materia-widget-development-kit/webpack-widget").getLegacyWidgetBuildConfig();

baseConfig.entry = {
	"creator.js": ["./src/creator.coffee"],
	"player.js": ["./src/player.coffee"],
	"creator.css": ["./src/creator.scss", "./src/creator.html"],
	"player.css": ["./src/player.scss", "./src/player.html"],
	"angular-chart.min.css": ["./src/angular-chart.min.css"],
	"angular-chart.min.js": ["./src/angular-chart.min.js"]
};

baseConfig.module.rules.push({
	test: /\.js$/i,
	exclude: /node_modules/,
	loader: ExtractTextPlugin.extract({
		use: ["raw-loader"]
	})
});

baseConfig.module.rules.push({
	test: /\.css$/i,
	loader: ExtractTextPlugin.extract({ use: ["css-loader"] }),
	exclude: /node_modules/
});

module.exports = baseConfig;
