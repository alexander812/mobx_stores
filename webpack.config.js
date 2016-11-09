'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
var path = require('path');


var appConfig = {
    context: path.resolve(__dirname, 'src/js'),

    entry: {
        entry: './entry.js'
    },
    output: {
        path:       path.resolve(__dirname, 'public/js'),
        publicPath: './public/js/',
        filename:   "[name].js"
    },

    watch: NODE_ENV == 'development',

    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/)
    ],
    module: {
        loaders:[
            {
                test: /\.jsx$/,
                loader: "babel",
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test:   /\.js$/,
                loader: "babel",
                query: {
                    presets: ['es2015'],
                    compact:'true'
                }
            },
            {
                test: /\.html$/,
                loader: 'ignore-loader'
            }

        ]
    },
    resolve: {
        root:[
            path.resolve('./src/js/')
        ],
        alias:{},
        modulesDirectories: ['node_modules'],
        extensions:         ['', '.js', '.jsx']
    },

    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates:    ['*-loader', '*'],
        extensions:         ['', '.js', '.jsx']
    }

};

console.log('NODE_ENV', NODE_ENV);
if (NODE_ENV == 'production') {
    appConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // don't show unreachable variables etc
                warnings:     false,
                drop_console: true,
                unsafe:       true
            }
        })
    );
}

/*
var uiConfig = Object.assign({}, appConfig);
*/


module.exports = appConfig;