const
    path = require("path");

module.exports = {
    entry: "./app/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    externals: {
        "jquery": "jQuery",
    },
    resolve: {
        modules: [path.resolve(__dirname, "app"), "node_modules"],
        alias: {
            "/models": path.resolve(__dirname, "app/models"),
            "/views": path.resolve(__dirname, "app/views"),
        },
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    },
    plugins: [],
    watch: true
};
