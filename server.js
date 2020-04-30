const dotenv = require('dotenv')
dotenv.config()
const socketio = require('socket.io')
const mongoose = require('mongoose')
const { promisify } = require('util')

const app = require('./app')
const { DB_URL, DB_PASSWORD, PORT } = process.env
const dB = DB_URL.replace('<password>', DB_PASSWORD)
const port = PORT || 1234

const connect = promisify(mongoose.connect)
// const listen = promisify(app.listen(port))

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

const expressServer = app.listen(port, () => console.log(`port ${port} connected`))
const io = socketio(expressServer)

io.on('connect', socket => {
    
})

// const connectToServer = async () => {
//     try {
//         server.listen(port, () => console.log(`port ${port} connected`))
//     } catch (error) {
//         console.log(`cannot listen on port ${port}`)
//         console.log(error.message)
//     }
// }


connectToDB()
exports.io = io
// connectToServer()

// app.listen(port)

// const Block = require('./models/Block')
// const Blockchain = require('./models/Blockchain')

// const bc = new Blockchain()
// console.log(bc)

// const block = new Block()
// block.mine()
// console.log(Block.genesis())
// block.computeHash()
// console.log(block.computeHash())
// console.log(block)
// block.save()


// const { computeHash } = require('./utils/computeHash')

// console.log(computeHash('lol', 'ok', 'yes'))