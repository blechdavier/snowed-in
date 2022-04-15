//webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: './src/client/Game.ts',
    },
    cache: {
        type: 'filesystem',
        memoryCacheUnaffected: true,
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                modules: {
                    test: /[\\/]node_modules[\\/]/,

                    // cacheGroupKey here is `commons` as the key of the cacheGroup
                    name(module, chunks, cacheGroupKey) {
                        const allChunksNames = chunks
                            .map((item) => item.name)
                            .join('~');
                        return `${cacheGroupKey}-${allChunksNames}`;
                    },

                    chunks: 'all',
                    reuseExistingChunk: true,
                },
            },
        },
    },
    output: {
        path: path.resolve(__dirname, '../../public'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.json",
                },
            },
        ],
    },
};
