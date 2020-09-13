

module.exports = {
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  head:{
    meta: [
      { charset: 'utf-8' }
    ]
  },

  /*
  ** Add element-ui in our app, see plugins/element-ui.js file
  */
  plugins: [
    '@/plugins/element-ui', '@/plugins/echarts'
  ],

  build: {
    vendor: ['element-ui', 'vue-i18n']
  }
}