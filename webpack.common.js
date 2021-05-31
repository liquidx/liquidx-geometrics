
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const geometricEntries = () => {
  let basicEntries = {
    index: ['./src/index.scss'],
    geo: ['./src/geo.js', './src/geo.scss']
  }

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, 'geometrics'), (err, files) =>{
      if (err) {
        reject(err)
        return
      }

      let targets = basicEntries
      for (let f of files) {
        let k = path.basename(f).replace('.js', '')
        targets[k] = ['./geometrics/' + f]
      }
      resolve(targets)
    })
  })
}

module.exports = {
  mode: 'development',  
  entry: geometricEntries,
  // entry: { 
  //   index: ['./src/index.js', './src/index.scss'],
  //   geo: ['./src/geo.js', './src/geo.scss']
  // },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath: '/'
  },

  devServer: {
    contentBase: './public'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Examples',
      filename: 'examples.html',
      template: 'src/examples.html',
      chunks: ['index']
    }),    
    new HtmlWebpackPlugin({
      filename: 'layouts/main.hbs.html',
      template: 'src/layouts/main.hbs.html',
      chunks: []
    }),
    new HtmlWebpackPlugin({
      filename: 'example.hbs.html',
      template: 'src/example.hbs.html',
      chunks: ['geo']
    }),
    new HtmlWebpackPlugin({
      filename: 'geo.hbs.html',
      template: 'src/geo.hbs.html',
      chunks: ['geo']
    }),    
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })  
  ],
  module: {
    rules:[
      {
        test:  /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader'},
          { loader: 'postcss-loader'},
          {
            loader: 'sass-loader',
            options: {implementation: require('sass')}
          }
        ]
      }
    ]
  }
};