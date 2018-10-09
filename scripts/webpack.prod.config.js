const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isPublish = true;
const buildPath = isPublish ? '../../../../kz-bi-system' : '../build';
const cleanDir = isPublish ? ['js', 'font', '*.*'] : ['build/*'];
const buildPathParent = isPublish ? '../../../../kz-bi-system/' : '../';

const webpackConfigProd = {
    entry: {
        client: [
            'babel-polyfill',
            path.resolve(__dirname, '../client/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, buildPath),
        filename: 'js/bundle.js',
        chunkFilename: 'js/[name].[chunkHash:4].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("production")
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: true
        }),
        new BundleAnalyzerPlugin({ analyzerPort: 3011 }),
        new CleanWebpackPlugin(cleanDir, {
            root: path.resolve(__dirname, buildPathParent),
            exclude: ['.git'],
            verbose: true,
            dry: false
        })
    ]
}

module.exports = merge(webpackConfigBase, webpackConfigProd)