var path = require('path');

module.exports = {
    entry: [
      './frontend/src/index.js',
      './frontend/src/style.css'
    ],

    output: {
        path: __dirname + '/frontend/public/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
              test: /\.js$/,
              loaders: ['react-hot-loader', 'babel-loader?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
              })],
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: [
                {
                  loader: "style-loader"
                },
                {
                  loader: "css-loader",
                  options: {
                    modules: true
                  }
                }
              ]
            }
        ]
    },

    resolve: {
      modules: [path.resolve(__dirname, "frontend/src"), "node_modules"]
    }
};
