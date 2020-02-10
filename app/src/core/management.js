const { userModel } = require('../data/models/index')
const { SECRET_KEY, SALT_ROUND } = require('../../utils/configs/config')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

function __hashAnything(key) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_ROUND, (err, salt) => {
            if ( err ) { reject(err) }
            bcrypt.hash(key, salt, (err, hash) => {
                if ( err ) { reject(err) }
                resolve(hash)
            })
        })
    })
}

function register(data) {
    return new Promise((resolve, reject) => {
        var passwordTmp = data.password
        __hashAnything(passwordTmp)
        .then(hashedPassword => {
            data.password = hashedPassword
            __hashAnything(hashedPassword)
            .then(hashedBasicAuth => {
                let user = new userModel({
                    username: data.username,
                    password: data.password,
                    basic_auth: hashedBasicAuth
                })
                userModel.insertNewUser(user)
                .then(result => { resolve(result) })
                .catch(err => { reject(err) })
            })
            .catch(err => { reject(err) })
        })
        .catch(err => { reject(err) })
    })
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        userModel.getAll()
        .then(docs => { resolve(docs) })
        .catch(err => { reject(err) })
    })
}

module.exports = { register, getAllUsers }