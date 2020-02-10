const mongoose = require('mongoose')
const { DB_NAME } = require('./configs/config')
mongoose.set('runValidators', true)

module.exports = {
    openDatabaseConnection: () => {
        console.log('Connecting to database')
        mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(result => {
            console.log('Connected to database')
        })
        .catch(err => {
            console.log(err)
            throw Error(err)
        })
    }
}
