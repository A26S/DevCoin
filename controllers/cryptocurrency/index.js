const Wallet = require('../../models/Wallet')
const Transaction = require('../../models/Transaction')
const TransactionPool = require('../../models/TransactionPool')
const Miner = require('../../models/Miner')
const { io } = require('../../server')
const { getNode, getTransactionPool, clearTransactionPool } = require('../../utils/clientSocket')
 
const createWallet = async (req, res, next) => {
    try {
        const wallet = await Wallet.new()
        return res.json({
            wallet
        })
    } catch (error) {
        return next(error)
    }
}

const createTransaction = async (req, res, next) => {
    try {
        const senderWallet = await Wallet.new()
        const recipientWallet = await Wallet.new()
        const transaction = await Transaction.new(senderWallet, recipientWallet, 3)
        if (transaction.verifySignature(senderWallet)) {
            const { amount, from, to, status } = await transaction.addToPool(senderWallet, recipientWallet)
            return res.json({
                amount,
                from,
                to,
                status
            })
        }
    } catch (error) {
        return next(error)
    }
}

const getTransactions = async (req, res, next) => {
    try {
        const pool = await TransactionPool.findOrCreateOne()
        const { transactions } = pool
        io.emit('transactions', transactions)
        const socketNode = getNode(req)
        getTransactionPool(socketNode)
        return res.json({
            transactions
        })
    } catch (error) {
        return next(error)
    }
}

const mine = async (req, res, next) => {   
    try {
        const miner = await Miner.new()
        const { block, transaction } = await miner.mine()
        io.emit('clear pool', [])
        const socketNode = getNode(req)
        clearTransactionPool(socketNode)
        return res.json({
            block,
            transaction
        })
    } catch (error) {
        return next(error)
    }
}

exports.createWallet = createWallet
exports.createTransaction = createTransaction
exports.getTransactions = getTransactions
exports.mine = mine