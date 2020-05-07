const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const socketio = require('socket.io')
const client = require('socket.io-client')

const app = require('./app')
const { DB_URL, DB_PASSWORD, PORT } = process.env
const dB = DB_URL.replace('<password>', DB_PASSWORD)
const port = PORT || 1234

const { promisify } = require('util')
const connect = promisify(mongoose.connect)

const connectToDB = async () => {
    try {
        await connect(dB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connection to database established')
    } catch (error) {
        console.log('failed to establish database connection')
        console.log(error.message)
    }
}

connectToDB()

const expressServer = app.listen(port, () => console.log(`port ${port} connected`))
const io = socketio(expressServer)
// const clientNode = client(`http://localhost:${port}`)

exports.io = io
exports.client = client