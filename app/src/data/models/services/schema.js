module.exports = (mongoose) => {
    return new mongoose.Schema({
        service_name: {type: String, required: true},
        host: {type: String, required: true},
        port: {type: String, required: true},
        resourcePaths: {
            type: [
                {
                    path: { type: String, required: String },
                    method: { type: String, required: true }
                }
            ],
            default: []
        }
    }, {collection: 'services'})
}