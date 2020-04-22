const dotenv = require('dotenv')
dotenv.config()
const { promisify } = require('util')
const mongoose = require('mongoose')

const app = require('./app')
const { DB_URL, DB_PASSWORD, PORT } = process.env
const dB = DB_URL.replace('<password>', DB_PASSWORD)

const connect = promisify(mongoose.connect)

const establishConnectionToDB = async () => {
    try {
        await connect(dB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connection to database established')
    } catch (error) {
        console.log('failed to establish database connection')
    }
}

establishConnectionToDB()

const Block = require('./models/Block')
const Blockchain = require('./models/Blockchain')

// const bc = new Blockchain()
// console.log(bc)

const block = new Block()
block.mine()
// console.log(Block.genesis())
// block.computeHash()
// console.log(block.computeHash())
console.log(block)
