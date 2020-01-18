const {validateAPIKey, grabRequest} = require('../helpers/index') // Helpers

function __resolveRequest(req, logModel, serviceModel, callback) {
    let request = grabRequest(req)
    if ( validateAPIKey(request.api_key) ) {
        serviceModel.getByID(request.app_id)
        .then(result => {
            if ( result ) {
                let flag = false
                for ( let i = 0; i < result.resourcePaths.length; i++ ) {
                    if ( request.path === result.resourcePaths[i].path
                        && request.method == result.resourcePaths[i].method) {
                        flag = true
                        break
                    }
                }
                if ( flag ) {
                    logModel.addLog(new logModel({
                        path: request.path,
                        service: request.app_id,
                        ip_address: request.ip_address
                    }))
                    callback(result, request, null)
                } else {
                    const err = {
                        type: 'UNAUTHORIZED',
                        module_source: 'request_resolver',
                        message: 'Request method is not found.'
                    }
                    callback(null, null, err)
                }
            } else {
                const err = {
                    type: 'NOT_FOUND',
                    module_source: 'request_resolver',
                    message: 'Host not found in the database'
                }
                callback(null, null, err)
            }
        })
        .catch(_ => {
            const err = {
                type: 'SERVER_ERROR',
                module_source: 'request_resolver',
                message: 'Internal server Error. Please back later.'
            }
            callback(null, null, err)
        })
    } else {
        const err = {
            type: 'UNAUTHORIZED',
            module_source: 'request_resolver',
            message: 'You\'re not allowed to do this action.'
        }
        callback(null, null, err)
    }
}

module.exports = (logModel, serviceModel) => {
    return {
        resolveRequest: (req, callback) => {
            return __resolveRequest(req, logModel, serviceModel, callback)
        }
    }

}