var webpack = require('webpack');

module.exports = {
    entry: [
      './frontend/src/index.js',
      'webpack-dev-server/client?http://0.0.0.0:4000',
      'webpack/hot/only-dev-server'
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
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ["react-hot-loader/babel"]
                }
            }
        ]
    }
};
