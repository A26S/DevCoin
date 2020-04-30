const express = require('express')
const routes = require('./routes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(express.json())
const clientSide = express.static(`${__dirname}/client`)
app.use(clientSide)

app.use(routes)

app.use(notFound)
app.use(errorHandler)

module.exports = app