module.exports = (mongoose) => {
    return new mongoose.Schema({
        request_time: {type: Date, default: new Date()},
        path: {type: String, required: true},
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true},
        ip_address: {type: String, required: true}
    }, {collection: 'logs'})
}