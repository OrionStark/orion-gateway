/**
 * This module would take necessary data from the HTTP Request Data and Request Headers
 * After we collect all the data we need. We passing it for validation from the validation module.
 * Such as http signature validation and ip whitelist validation or etc.
 */
function grabRequest(req) {
    const ipAddress = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress
    const apiSignatureKey = req.headers['api_key'] || ''
    return {
        ip_address: ipAddress,
        api_key: apiSignatureKey,
        host: req.headers['host'],
        user_Agent: req.headers['user-agent'] || '',
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        query: req.query,
        params: req.params,
        app_id: req.headers['app_id'],
        body: req.body
    }
}

module.exports = {
    grabRequest
}