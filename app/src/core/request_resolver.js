const { userModel } = require('../data/models/index')
const fs = require('fs')
const yaml = require('yaml')

function __validateConsumerBasicAuth(userKey, userModel) {
    return new Promise((resolve, reject) => {
        userModel.findByBasicToken(userKey)
        .then(result => {
            if ( result ) {
                resolve()
            } else {
                reject('Your key isn\'t valid')
            }
        })
        .catch(_ => {
            reject('Couldn\'t process the request at the moment')
        })
    })
}

function __grabRequest(req) {
    const ipAddress = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress
    const apiSignatureKey = req.headers['basic_auth'] || ''
    return {
        ip_address: ipAddress,
        basic_auth: apiSignatureKey,
        host: req.headers['host'],
        user_agent: req.headers['user-agent'] || '',
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        query: req.query,
        params: req.params,
        app_id: req.headers['app_id'],
        body: req.body,
        authorization: req.headers['Authorization'] || ''
    }
}


function __getServiceInformation(service_name) {
    return new Promise((resolve, reject) => {
        const file = fs.readFileSync('./app/gateway_conf.yml', 'utf8')
        const conf = yaml.parse(file)
        if ( conf.services.hasOwnProperty(service_name) ) {
            resolve(conf.services[service_name])
        } else {
            const err = {
                type: 'NOT_FOUND',
                module_source: 'request_resolver',
                message: 'Invalid service access. Please check your request again/'
            }
            reject(err)
        }
    })
}

function __resolveRequest(req, logModel, callback) {
    let request = __grabRequest(req)
    // Check if basic auth key is not specified
    if ( request.basic_auth === '' ) {
        const err = {
            type: 'UNAUTHORIZED',
            module_source: 'request_resolver',
            message: 'You\'re not allowed to access this network'
        }
        callback(null, null, err)
    }

    __validateConsumerBasicAuth(request.basic_auth, userModel)
    .then(() => {
        // Get service information from the configuration file
        __getServiceInformation(request.app_id || '')
        .then(service => {
            let flag = false

            const availableEndPoints = service.endpoints[request.method.toLowerCase()] || []
            const splittedRequestPath = request.path.replace(/^\/|\/$/g, '').split('/')
            for ( let i = 0; i < availableEndPoints.length; i++ ) {
                let splittedEndPointPath = availableEndPoints[i].replace(/^\/|\/$/g, '').split('/')
                if ( splittedRequestPath.length === splittedEndPointPath.length ) {
                    let fractalCheckFlag = true
                    for ( let j = 0; j < splittedEndPointPath.length; j++ ) {
                        if ( splittedEndPointPath[j] !== splittedRequestPath[j] && splittedEndPointPath[j] !== '*' ) {
                            fractalCheckFlag = false
                            break
                        }
                    }
                    if ( fractalCheckFlag ) {
                        flag = true
                        break
                    }
                }
            }
            if ( flag ) { // If method found
                logModel.addLog(new logModel({
                    path: request.path,
                    service: request.app_id,
                    ip_address: request.ip_address
                }))
                callback(request, service, null)
            } else {
                const err = {
                    type: 'NOT_FOUND',
                    module_source: 'request_resolver',
                    message: 'Request method is not found.'
                }
                callback(null, null, err)
            }
        })
        .catch(err => {
            callback(null, null, err)
        })
    })
    .catch( _ => {
        const err = {
            type: 'UNAUTHORIZED',
            module_source: 'request_resolver',
            message: 'Your signature is not valid.'
        }
        callback(null, null, err)
    })
}

module.exports = (logModel) => {
    return {
        resolveRequest: (req, callback) => {
            return __resolveRequest(req, logModel, callback)
        }
    }
}