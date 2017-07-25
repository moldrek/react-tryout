/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path')
const webpack = require('webpack')
const assetsPath = path.resolve(__dirname,'../public/assets')
const webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools')
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const webpackIsomorphicToolsPlugin = new 
    WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig)

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        main: [
            './src/index.js'
        ],
    },
    output: {
        path: assetsPath, 
        filename: '[name].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/assets/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss'
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
        ]
    },
    postcss() {
        return [autoprefixer];
    },
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],
        extensions: ['.json','.js','.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: '"production"'
            },
            __CLIENT__: true,
            __DEVTOOLS__: false
        }),
        new webpack.IgnorePlugin(/\.\/dev/,/\/config$/),
        //optimizations
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            }
        }),
        webpackIsomorphicToolsPlugin,
        new ExtractTextPlugin('[name]-[chunkhash].css', {
            allChunks: true
        })
    ]
}