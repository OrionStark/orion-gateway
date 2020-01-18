function __getResponseCache(service_id, path, redisClient) {
    return new Promise((resolve, reject) => {
        redisClient.hgetAsync(service_id, path)
        .then(result => {
            resolve(result)
        }, err => {
            reject(err)
        })
    })
}

function __setCache(service_id, path, data, redisClient) {
    return new Promise((resolve, reject) => {
        redisClient.hsetAsync(service_id, path, data)
        .then(result => {
            resolve(result)
        }, err => {
            reject(err)
        })
    })
}

module.exports = (redisClient) => {
    return {
        getResponseCache: (service_id, path) => {
            return __getResponseCache(service_id, path, redisClient)
        },
        setCache: (service_id, path, data) => {
            return __setCache(service_id, path, data, redisClient)
        }
    }
}