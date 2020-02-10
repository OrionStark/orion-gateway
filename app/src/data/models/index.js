const mongoose = require('mongoose')
const logModel = require('./logs/index')(mongoose)
const userModel = require('./consumer/index')(mongoose)

module.exports = {
    logModel,
    userModel
}