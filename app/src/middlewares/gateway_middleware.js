const { forwardRequest,
    resolveRequest,
    resolveResponse } = require('../core/index')
const router = require('express').Router()

router.all('/api/*', (req, res, next) => {
    resolveResponse(res)
    resolveRequest(req, (result, request, error) => {
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
            forwardRequest(request)
            .then(response => {
                res.json(response)
            })
            .catch(err => {
                res.status(500).json(err)
            })
        }
    })
})

module.exports = router