const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser =require('body-parser')
const {PORT} = require('./utils/configs/config')
const { openDatabaseConnection } = require('./utils/database')
const midlleware = require('./src/middlewares/gateway_middleware')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(midlleware)

// Start Server
app.listen(process.env.PORT || PORT, () => {
    openDatabaseConnection()
    console.log(`Server started on port ${PORT}`)
})