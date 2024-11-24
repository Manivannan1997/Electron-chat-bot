const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/index.js', // Entry point for the React app
    output: {
        path: path.resolve(__dirname, 'dist'), // Output folder
        filename: '[name].[contenthash].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            process: require.resolve('process/browser'),
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
            crypto: require.resolve('crypto-browserify'),
            vm: require.resolve('vm-browserify'),
            stream: require.resolve('stream-browserify'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Process JS/JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'], // CSS loaders
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new CleanWebpackPlugin(), // Cleans the `dist` folder before every build
        new HtmlWebpackPlugin({
            template: './public/index.html', // Input HTML file
            filename: 'index.html', // Output HTML file in `dist`
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new Dotenv({
            path: path.resolve(__dirname, './.env.production'), // Specify production-specific env file
            // safe: true,     // Ensure required environment variables are set
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 8080,
        hot: true,
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
