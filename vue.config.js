const path = require('path')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件自动引入,使用绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  // devServer: {
  //   open: true,
  //   host: 'localhost',
  //   port: 8080
  // },
  // devServer: {
  //   proxy: {
  //     'https://suggest.taobao.com/api': {
  //       target: 'https://suggest.taobao.com/api', // API服务器地址（更换为你的路径）
  //       changeOrigin: true, // 虚拟的站点需要更管origin
  //       secure: true
  //     }
  //   }
  // },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  configureWebpack: {
    devServer: {
      // disableHostCheck: true
      allowedHosts: ['www.corho.com'] // www.corho.com=>扫码授权后的回调地址
    },
    externals: {
      qc: 'QC'
    }
  }
})
