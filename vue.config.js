module.exports = {
    publicPath: './',
    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        navigateFallback: 'index.html',
        skipWaiting: true
      }
    }
  }