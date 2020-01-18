const mongoose = require('mongoose')
const { forwardRequest } = require('./request_forwarding')
const { logModel, serviceModel } = require('../data/models/index')(mongoose)
const { resolveRequest } = require('./request_resolver')(logModel, serviceModel)
const { resolveResponse } = require('./response_resolver')

module.exports = {
    forwardRequest,
    resolveRequest,
    resolveResponse
}