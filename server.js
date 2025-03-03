// Import required modules
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

function parseEnvList(env) {
  return env ? env.split(',') : [];
}

var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = []; // Allow all origins

// Import CORS Anywhere library
var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);
var cors_proxy = require('./lib/cors-anywhere');

cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: [], // ✅ Remove "origin" & "x-requested-with" requirement
  removeHeaders: [
    'cookie', 'cookie2',
    'x-request-start', 'x-request-id',
    'via', 'connect-time', 'total-route-time',
  ],
  setHeaders: { // ✅ Set required headers to bypass 403
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://astrogo.astro.com.my/",
    "Origin": "https://astrogo.astro.com.my"
  },
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false, // Disable X-Forwarded-For headers
  },
}).listen(port, host, function() {
  console.log('✅ CORS Proxy Running on ' + host + ':' + port);
});
