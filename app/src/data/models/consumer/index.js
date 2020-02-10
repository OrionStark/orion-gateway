function __createModel(mongoose) {
    const schema = require('./schema')(mongoose)
    schema.statics.getAll = function() {
        return new Promise((resolve, reject) => {
            this.find({})
            .then(docs => { resolve(docs) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.insertNewUser = function(userData) {
        return new Promise((resolve, reject) => {
            userData.save()
            .then(result => { resolve(result) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.findByBasicToken = function(basicToken) {
        return new Promise((resolve, reject) => {
            this.findOne({basic_auth: basicToken})
            .then(result => { resolve(result) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.deleteUserByBasicToken = function(basicToken) {
        return new Promise((resolve, reject) => {
            this.deleteOne({basic_auth: basicToken})
            .then(result => { resolve(result) })
            .catch(err => { reject(err) })
        })
    }
    schema.statics.updateUserData = function(userData, basicToken) {
        return new Promise((resolve, reject) => {
            this.updateOne({basic_auth: basicToken}, userData)
            .then(result => { resolve(result) })
            .catch(err => { reject(err) })
        })
    }

    return schema
}

module.exports = (mongoose) => {
    const schema = __createModel(mongoose)
    return mongoose.model('user_model', schema)
}