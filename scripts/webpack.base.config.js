const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../client'),
            'components': path.resolve(__dirname, '../client/components'),
            'api': path.resolve(__dirname, '../client/api'),
            'routers': path.resolve(__dirname, '../client/routers'),
            'images': path.join(__dirname, '../client/images'),
        }
    },
    module: {
        loaders: [
            {
                test: /\.bundle\.js$/,
                use: {
                    loader: 'bundle-loader',
                    options: {
                        lazy: true,
                        name: '[name]'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'react', 'stage-2'],
                    plugins: ["react-hot-loader/babel"]
                }
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } }
                    ]
                }),
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'less-loader', options: { sourceMap: true } }
                    ]
                }),
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'img/[name].[hash:4].[ext]'
                }
            },
            {
                test: /\.(woff|eot|ttf|svg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'font/[name].[hash:4].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            favicon: './public/favicon.ico',
            minify: {
                removeComments: true
            }
        }),
        new ExtractTextPlugin('style.[hash:4].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "client",
            filename: "common.bundle.js",
            minChunks: function (module, count) {
                return module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(resolve('./node_modules')) === 0
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            async: 'async-common',
            minChunks: 3
        })
    ]
}