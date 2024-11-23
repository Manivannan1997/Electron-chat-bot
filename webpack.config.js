const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Extracted CSS file
        }),
    ],
};


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js', // Add unique names with content hashing
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Add .jsx to the resolvable extensions
        fallback: {
            process: require.resolve("process/browser"),
            path: require.resolve("path-browserify"),
            os: require.resolve("os-browserify/browser"),
            crypto: require.resolve("crypto-browserify"),
            vm: require.resolve("vm-browserify"),
            stream: require.resolve("stream-browserify"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Process both .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            // {
            //     test: /\.css$/i, // Add rule for CSS files
            //     use: ['style-loader', 'css-loader', 'postcss-loader'], // Process CSS with PostCSS
            // },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', // Extracted CSS file
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 8080, // React dev server port
        hot: true, // Enable hot module replacement
        open: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },    
};