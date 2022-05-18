const webpack = require('webpack'),
  fs = require('fs'),
  path = require('path'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/bigchaindb-backend/server.ts',
  target: 'node',
  output: {
    filename: 'server.js',
    // libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../../dist/bigchaindb-backend')
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { 
        test: /\.tsx?$/, 
        loader: 'ts-loader', 
        exclude: /node_modules/ 
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['../../dist/bigchaindb-backend']),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Enable analyzer to analyze bundle size!
    new BundleAnalyzerPlugin(),
  ],
};