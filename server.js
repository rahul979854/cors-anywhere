// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

// Parse environment variables for blacklists/whitelists
function parseEnvList(env) {
  return env ? env.split(',') : [];
}

var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = []; // Allow all origins

// Set up rate-limiting to avoid abuse
var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist, // Allow all requests
  requireHeader: [], // 🔥 REMOVE HEADER REQUIREMENT (Fix 403 & Missing Header Error)
  checkRateLimit: checkRateLimit,
  removeHeaders: [
    'cookie', 'cookie2',
    'x-request-start', 'x-request-id',
    'via', 'connect-time', 'total-route-time',
  ],
  setHeaders: { // 🔥 Add required headers to bypass restrictions
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://astrogo.astro.com.my/",
    "Origin": "https://astrogo.astro.com.my"
  },
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false, // Don't add extra headers
  },
}).listen(port, host, function() {
  console.log('✅ CORS Proxy Running on ' + host + ':' + port);
});
