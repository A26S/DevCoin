const Block = require('../../models/Block')
const Blockchain = require('../../models/Blockchain')
const Wallet = require('../../models/Wallet')
const Transaction = require('../../models/Transaction')
const TransactionPool = require('../../models/TransactionPool')
const Miner = require('../../models/Miner')
const CustomError = require('../../utils/CustomError')

const show = async (req, res, next) => {    
    try {
        const blockchain = await Blockchain.findOrCreateOne()
        if (!blockchain) {
            const error = new CustomError('could not create blockchain', 500)
            throw error
        }
        const { io, client } = require('../../server') // ---- this import was causing errors!!!
        io.on('connect', socket => {
            socket.emit('blockchain', blockchain)
        })
        return res.status(200).json({
            blockchain
        })
    } catch (error) {
        return next(error)
    }
}

const clearAll = async (req, res, next) => { // dev use only :)
    try {
        const blocks = await Block.find()
        const chain = await Blockchain.find()
        const wallets = await Wallet.find()
        const transactions = await Transaction.find()
        const transactionPool = await TransactionPool.find()
        const miners = await Miner.find()
        const database = [...blocks, ...chain, ...wallets, ...transactions, ...transactionPool, ...miners]
        for await (const element of database) {
            element.deleteOne()
        }
        return res.json({
            message: 'deleted the database',
            database
        })
    } catch (error) {
        const err = new CustomError('could not access database', 500)
        return next(err)
    }
}

exports.show = show
exports.clearAll = clearAll