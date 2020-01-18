const {SECRET_KEY, CRYPT_ALGORITHM, API_KEY} = require('../../../utils/configs/config')
const crypto = require('crypto-js')

function validateAPIKey(key) {
    let decryptedTextTemporary = ''
    if ( CRYPT_ALGORITHM === 'AES' ) {
        const decrypted = crypto.AES.decrypt(key, SECRET_KEY)
        decryptedTextTemporary = decrypted.toString(crypto.enc.Utf8)
    }
    return decryptedTextTemporary ===  API_KEY
}

module.exports = {
    validateAPIKey
}