const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis) // Make everything on redis be async

const redisClient = redis.createClient({
    port: 6379
})

module.exports = {
    redisClient
}