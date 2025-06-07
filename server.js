const cors_proxy = require('cors-anywhere');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

const allowedOrigin = 'https://webiptv.updatesbyrahul.site';

cors_proxy.createServer({
  originWhitelist: [allowedOrigin], // Only allow your site
  requireHeader: ['origin', 'x-requested-with'], // Require these headers
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time'
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false,
    changeOrigin: true
  },
  checkRequest: function(origin, url, callback) {
    if (!/^https?:\/\//.test(url)) {
      return callback(new Error('Invalid host: ' + url));
    }

    // Validate the origin or referer manually (double protection)
    if (
      origin !== allowedOrigin &&
      (!this.referer || !this.referer.startsWith(allowedOrigin))
    ) {
      return callback(new Error('Blocked: Unauthorized origin ' + origin));
    }

    callback(null, url);
  }
}).listen(port, host, function () {
  console.log(`✅ CORS Proxy running at ${host}:${port} for ${allowedOrigin}`);
});
