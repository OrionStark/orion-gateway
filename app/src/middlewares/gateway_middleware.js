const { forwardRequest,
    resolveRequest,
    resolveResponse, register, getAllUsers } = require('../core/index')
const router = require('express').Router()
const constants = require('../../utils/configs/config')

router.all('*', (req, res) => {
    if ( req.path === '/consumer/management/register' && req.method.toUpperCase() === 'POST' ) {
        let data = req.body
        register(data)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => { res.status(500).json(err) })
    } else if ( req.path === '/consumer/management/users' && req.method.toUpperCase() === 'GET' ) {
        let accessToken = req.headers['admin-access']
        if ( constants.SECRET_KEY === accessToken ) {
            getAllUsers()
            .then(docs => {
                res.json({data: docs})
            })
            .catch(err => {
                res.status(500).json(err)
            })
        } else { 
            res.status(401).json({
                message: 'You\'re not allowed to do this action.'
            })
        }
    } else {
        resolveResponse(res)
        resolveRequest(req, (request, service, error) => {
            if ( error ) {
                let status_code
                if ( error.hasOwnProperty('type') ) {
                    if ( error.type === 'UNAUTHORIZED' ) {
                        status_code = 401
                    } else if ( error.type === 'NOT_FOUND' ) {
                        status_code = 404
                    } else {
                        status_code = 500
                    }
                } else {
                    status_code = 500
                }
                res.status(status_code).json(error)
            } else {
                forwardRequest(request, service)
                .then(response => {
                    res.json(response)
                })
                .catch(err => {
                    res.status(500).json(err)
                })
            }
        })
    }
})

module.exports = router