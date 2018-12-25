const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = env => {
  return {
    entry: './app/main.tsx',
    // devtool: 'inline-source-map',
    output: {
      filename: './bundle.js'
    },
    mode: 'development',
    ...(process.env.WEBPACK_SERVE ? {mode: 'development'} : {}),
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
      alias: {}
    },
    externals: [{}],
    plugins: [env === 'deploy' && new UglifyJsPlugin()].filter(a => a),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {noEmit: false}
          }
        },
        {
          test: /\.less$/,
          loader: 'less-loader' // compiles Less to CSS
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.(gif|svg|jpg|png)$/,
          loader: 'file-loader'
        }]
    }
  };
};
