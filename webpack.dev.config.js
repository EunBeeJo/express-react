var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
      './frontend/src/index.js',
      'webpack-dev-server/client?http://0.0.0.0:4000',
      'webpack/hot/only-dev-server',
      './frontend/src/style.css'
    ],

    output: {
      path: '/',
      filename: 'bundle.js'
    },

    // 개발서버 설정
    devServer: {
      hot: true,
      filename: 'bundle.js',
      publicPath: '/',
      historyApiFallback: true,
      contentBase: './frontend/public',

      proxy: {
        "**": "http://localhost:3000" // express server ad
      },

      stats: {
          // 콘솔 로그 최소화
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        }
    },

    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],

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
