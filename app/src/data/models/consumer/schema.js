module.exports = (mongoose) => {
    return new mongoose.Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        token_access: {type: String, default: ''},
        basic_auth: {type: String, default: ''}
    }, {collection: 'user'})
}