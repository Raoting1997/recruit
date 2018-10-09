const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');
const buildPath = '../build';
const publicPath = '/';

const webpackConfigDev = {
    entry: {
        client: [
            'react-hot-loader/patch',
            'babel-polyfill',
            path.resolve(__dirname, '../client/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, buildPath), // 打包文件的输出路径
        filename: 'js/bundle.js', // 打包文件名
        chunkFilename: 'js/[name].[chunkHash:4].js',
        publicPath: publicPath
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        publicPath: publicPath,
        contentBase: path.resolve(__dirname, buildPath),
        inline: true,
        hot: true,
        historyApiFallback: true,
        host: 'localhost',
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("development")
        })
    ]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)