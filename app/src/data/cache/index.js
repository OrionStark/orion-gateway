const responseCacheAdapter = require('./response/index')

function __getResponseCacheAdapter(redisClient) { return responseCacheAdapter(redisClient) }

module.exports = (redisClient) => {
    return {
        responseCacheAdapter: __getResponseCacheAdapter(redisClient)
    }
}