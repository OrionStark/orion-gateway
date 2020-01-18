const axios = require('axios').default

function forwardRequest(request, service) {
    return new Promise((resolve, reject) => {
        const method = request.method.toLowerCase()
        if ( method === 'get' ) {
            axios({
                method: method,
                baseURL: service.base_url + ':' + service.port,
                url: request.path,
                responseType: 'json'
            })
            .then(response => {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
        } else {
            axios({
                method: method,
                baseURL: service.base_url + ':' + service.port,
                url: request.path,
                responseType: 'json',
                data: request.body,
                params: request.params
            })
            .then(response => {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
        }
    })
}

module.exports = {
    forwardRequest
}