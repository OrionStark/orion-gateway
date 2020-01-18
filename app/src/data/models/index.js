const logModel = require('./logs/index')
const serviceModel = require('./services/index')

function __getLogModel(mongoose) { return logModel(mongoose) }
function __getServiceModel(mongoose) { return serviceModel(mongoose) }

module.exports = (mongoose) => {
    return {
        logModel: __getLogModel(mongoose),
        serviceModel: __getServiceModel(mongoose)
    }
}