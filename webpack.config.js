const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: '/public/assets',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }]
            }
        ]
    }
};