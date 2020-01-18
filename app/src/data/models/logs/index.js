/**
 * This is the data log model for monitoring the trafic for each service.
 */
function __createModel(mongoose) {
    const schema = require('./schema')(mongoose)
    schema.statics.getAll = function() {
        return Promise((resolve, reject) => {
            this.find({})
            .then(docs => { resolve(docs) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.getByID = function(id) {
        return Promise((resolve, reject) => {
            this.findOne({_id: id})
            .then(doc => { resolve(doc) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.addLog = function(log) {
        return new Promise((resolve, reject) => {
            log.save()
            .then(result => {resolve(result)})
            .catch(err => {reject(err)})
        })
    }

    return schema
}

module.exports = (mongoose) => {
    const schema = __createModel(mongoose)
    return mongoose.model('log_model', schema)
}
