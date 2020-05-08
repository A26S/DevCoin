const express = require('express')
const routes = require('./routes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(express.json())

// not using client side right now
// const clientSide = express.static(`${__dirname}/client`)
// app.use(clientSide)

app.use(routes)

//error handling
app.use(notFound)
app.use(errorHandler)

module.exports = app