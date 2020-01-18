function __createCacheAdapter(redisClient) {
    const cacheAdapter = require('./res_cache')(redisClient)
    return cacheAdapter
}

module.exports = (redisClient) => {
    const adapter = __createCacheAdapter(redisClient)
    return adapter
}