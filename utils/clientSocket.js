const { client } = require('../server')

const { PORT } = process.env

const getNode = req => {
    const { protocol, hostname } = req
    const connectionString = `${protocol}://${hostname}:${PORT}`
    const clientNode = client(connectionString)
    return clientNode
}

const getChain = socket => {
    socket.on('blockchain', blockchain => {
        console.log({
            blockchain
        })
    })
}

const getTransactionPool = socket => {
    socket.on('transactions', transactions => {
        console.log({
            transactions
        })
    })
}

const clearTransactionPool = socket => {
    socket.on('clear pool', emptyPool => {
        console.log({
            transactions: emptyPool
        })
    })
}

exports.getNode = getNode
exports.getChain = getChain
exports.getTransactionPool = getTransactionPool
exports.clearTransactionPool = clearTransactionPool