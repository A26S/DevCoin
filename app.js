const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())
const clientSide = express.static(`${__dirname}/client`)
app.use(clientSide)

app.use(routes)

module.exports = app