const { client } = require('../server')
const { BLOCKCHAIN, TRANSACTIONS, CLEAR_POOL } = require('./socketActions')

const { PORT } = process.env

const getNode = req => {
    const { protocol, hostname } = req
    const connectionString = `${protocol}://${hostname}:${PORT}`
    const clientNode = client(connectionString)
    return clientNode
}

const getChain = socket => {
    socket.on(BLOCKCHAIN, blockchain => {
        console.log({
            blockchain
        })
    })
}

const getTransactionPool = socket => {
    socket.on(TRANSACTIONS, transactions => {
        console.log({
            transactions
        })
    })
}

const clearTransactionPool = socket => {
    socket.on(CLEAR_POOL, emptyPool => {
        console.log({
            transactions: emptyPool
        })
    })
}

exports.getNode = getNode
exports.getChain = getChain
exports.getTransactionPool = getTransactionPool
exports.clearTransactionPool = clearTransactionPool