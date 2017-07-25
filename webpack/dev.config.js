const path = require('path')
const webpack = require('webpack')
const assetsPath = path.resolve(__dirname, '../public/assets')
const { webpackHost, webpackPort } = require('../config/env')
const webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools')
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackIsomorphicToolsPlugin = new
    WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig)



module.exports = {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        main: [
            `webpack-hot-middleware/client?path=http://${webpackHost}:${webpackPort}/__webpack_hmr`,
            './src/index.js',
        ],
    },
    output: {
        path: assetsPath,
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkHash].js',
        publicPath: `http://${webpackHost}:${webpackPort}/assets/`,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss',
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file',
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml',
            },
            {
                test: webpackIsomorphicToolsPlugin.regular_expression('images'),
                loader: 'url-loader?limit=10240',
            },
        ],
    },
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],
        extensions: ['.json', '.js', '.jsx'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(/webpack-stats\.json$/),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __DEVTOOLS__: true,
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        webpackIsomorphicToolsPlugin.development(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })
    ],
}