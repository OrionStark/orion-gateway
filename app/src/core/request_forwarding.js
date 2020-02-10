const axios = require('axios').default
const { SECRET_KEY } = require('../../utils/configs/config')
const jwt = require('jsonwebtoken')

function __generateGatewaySignature(serviceSecretKey, callback) {
    jwt.sign({
        gateway: 'ORION_GATEWAY',
        gateway_secret: SECRET_KEY
    }, serviceSecretKey, callback)
}

function forwardRequest(request, service) {
    return new Promise((resolve, reject) => {
        const method = request.method.toLowerCase()
        __generateGatewaySignature(service.secret_key, (err, token) => {
            if ( err ) { reject(err) } // If token sign got error
            if ( method === 'get' ) {
                axios({
                    method: method,
                    baseURL: service.base_url + ':' + service.port,
                    url: request.path,
                    responseType: 'json',
                    headers: {
                        gateway_signature: token ,
                        authorization: request.authorization
                    }
                })
                .then(response => {
                    resolve(response.data) 
                })
                .catch(err => { reject(err) })
            } else {
                axios({
                    method: method,
                    baseURL: service.base_url + ':' + service.port,
                    url: request.path,
                    responseType: 'json',
                    data: request.body,
                    params: request.params,
                    headers: { 
                        gateway_signature: token,
                        authorization: request.authorization
                    }
                })
                .then(response => { resolve(response) })
                .catch(err => { reject(err) })
            }
        })
    })
}

module.exports = { forwardRequest }