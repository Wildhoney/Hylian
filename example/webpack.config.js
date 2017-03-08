module.exports = {
    entry: './src/hylian.js',
    output: {
        filename: './example/js/build.js',
        libraryTarget: 'var',
        library: 'hylian'
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
