const { validateAPIKey } = require('./validation/http_signature_validation')
const { grabRequest } = require('./webhooks/http_headers_grab')

module.exports = {
    validateAPIKey, grabRequest
}