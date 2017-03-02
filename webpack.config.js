module.exports = {
    entry: ['babel-polyfill', './src/hylian.js'],
    output: {
        filename: './dist/hylian.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/i
            }
        ]
    }
};
