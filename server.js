// Import required modules
var cors_proxy = require('./lib/cors-anywhere');

// Set host and port
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

// Parse environment variables for whitelisting
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

// Load environment-based configurations
var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

// Start the CORS proxy server
cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  
  // Fix: Remove header restrictions
  requireHeader: [],  // This fixes the "Missing required request header" error
  
  checkRateLimit: checkRateLimit,
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
    xfwd: false
  },
}).listen(port, host, function() {
  console.log(`CORS Anywhere Running on ${host}:${port}`);
});
