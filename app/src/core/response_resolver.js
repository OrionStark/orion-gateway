/**
 * Here, we're going to modify the response header
 */


function __addSecureAndCacheHeaders(res) {
    // OWASP Secure Headers
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('X-Frame-Options', 'DENY')
    res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')

    // Avoid Caching Tokens
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
}

function resolveResponse(res) {
    __addSecureAndCacheHeaders(res)
}

module.exports = {
    resolveResponse
}