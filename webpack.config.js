const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
    publicPath: '/'
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
        publicPath: '/'
      },
      // Serve library directory directly as static files
      {
        directory: path.join(__dirname, 'library'),
        publicPath: '/library'
      },
      // Serve en directory directly as static files  
      {
        directory: path.join(__dirname, 'en'),
        publicPath: '/en'
      }
    ],
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/en/, to: '/index.html' },
        { from: /./, to: '/index.html' }
      ]
    },
    // Optimize for large number of files
    watchFiles: {
      paths: ['src/**/*', '*.html', '*.css'],
      options: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/heroaran.github.io/**', '**/library/images/**', '**/en/library/images/**']
      }
    }
  },
  plugins: [
    // Single unified page that handles both languages
    new HtmlWebpackPlugin({
      template: './index-unified.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    // Copy only essential static assets (minimal approach)
    new CopyWebpackPlugin({
      patterns: [
        // Root level files only
        {
          from: 'styles.css',
          to: 'styles.css'
        },
        {
          from: 'favicon.ico',
          to: 'favicon.ico'
        },
        {
          from: 'terms_of_service.html',
          to: 'terms_of_service.html'
        },
        {
          from: 'ads.txt',
          to: 'ads.txt'
        },
        {
          from: 'CNAME',
          to: 'CNAME'
        },
        {
          from: 'mapping.json',
          to: 'mapping.json'
        },
        // Copy specific files from en directory only
        {
          from: 'en/styles.css',
          to: 'en/styles.css',
          noErrorOnMissing: true
        },
        {
          from: 'en/footer.html',
          to: 'en/footer.html',
          noErrorOnMissing: true
        }
        // Temporarily exclude library and large directories
      ]
    })
  ],
  performance: {
    hints: false, // Disable performance hints for large assets
    maxAssetSize: 10000000, // 10MB
    maxEntrypointSize: 10000000 // 10MB
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 5000000 // 5MB chunks
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      // Temporarily disable image processing to avoid "too many files" error
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
      //   type: 'asset/resource'
      // },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false // Disable automatic asset processing in HTML
        }
      },
      {
        test: /\.(json)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
