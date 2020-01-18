/**
 * This is the data service model for saving the service route.
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
    schema.statics.addService = function(log) {
        return new Promise((resolve, reject) => {
            log.save()
            .then(result => {resolve(result)})
            .catch(err => {reject(err)})
        })
    }
    schema.statics.deleteService = function(id) {
        return new Promise((resolve, reject) => {
            this.deleteOne({_id: id})
            .then(result => { resolve(result) })
            .catch(err => { reject(err) })
        })
    }

    return schema
}

module.exports = (mongoose) => {
    const schema = __createModel(mongoose)
    return mongoose.model('service_model', schema)
}
