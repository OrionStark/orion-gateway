const {validateAPIKey, grabRequest} = require('../helpers/index') // Helpers
const fs = require('fs')
const yaml = require('yaml')


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
                message: 'Service method is not found.'
            }
            reject(err)
        }
    })
}

function __resolveRequest(req, logModel, callback) {
    let request = grabRequest(req)
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
        if ( service.enable_auth && !validateAPIKey(request.api_key) ) {
            const err = {
                type: 'UNAUTHORIZED',
                module_source: 'request_resolver',
                message: 'You\'re not allowed to do this action.'
            }
            callback(null, null, err) 
        } else {
            if ( flag ) {
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
        }
    })
    .catch(err => {
        console.log(err)
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