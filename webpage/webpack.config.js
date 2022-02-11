//webpack.config.js
const path = require('path');
//const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: "./webpage/src/Main.ts",
    },
    output: {
        path: path.resolve(__dirname, '../public'),

        filename: "game.js" // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    /*
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
     */
};