'use strict'

var path = require('path');
var webpack = require('webpack');

// $ PROD_DEV=1 webpack
var PROD = JSON.parse(process.env.PROD_DEV || "1");

module.exports = {
	entry: {
		test: './test/PokedexSpec',
		main: ['./src/js/Pokedex'] // With '[]' because theres some bug with multiples entrys in webpack
	},
	output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].entry.js"
    },
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
			{ test: /\.css$/, loader: "style-loader!css-loader" }
		]
	},
	plugins: PROD ? [
    	new webpack.optimize.UglifyJsPlugin({minimize: true})
  	] : []
};