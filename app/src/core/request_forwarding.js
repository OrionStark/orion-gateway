const axios = require('axios').default

function forwardRequest(request) {
    return new Promise((resolve, reject) => {
        const method = request.method.toLowerCase()
        if ( method === 'get' ) {
            axios({
                method: method,
                baseURL: request.host,
                url: request.path,
                responseType: 'json'
            })
            .then(response => {
                console.log(response)
                resolve(response)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
        } else {
            axios({
                method: method,
                baseURL: request.host,
                url: request.path,
                responseType: 'json',
                data: request.body
            })
            .then(response => {
                console.log(response)
                resolve(response)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
        }
    })
}

module.exports = {
    forwardRequest
}