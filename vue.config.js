const { defineConfig } = require('@vue/cli-service')
require('dotenv-flow').config();

module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        // pathRewrite: { '^/api': '' },
      },
    },
    port: 8090
  },
  transpileDependencies: true,
})
